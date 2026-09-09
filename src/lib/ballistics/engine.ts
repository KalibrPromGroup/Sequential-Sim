import { chemicalEnergy, specificGasConstant } from "./propellant.ts";
import type {
  Charge,
  ChargeSample,
  EnergyBreakdown,
  GunConfig,
  PortState,
  Sample,
  SimEvent,
  SimResult,
  SimWarning,
  SimStatus,
} from "./types.ts";
import { SAAMI_22LR_MAP_PA, STEEL_YIELD_PA } from "./units.ts";

const DT = 2.5e-7;
const T_MAX = 0.018;
const SAMPLE_EVERY = 48;
const P_FLOOR = 1.01325e5;
const T_FLOOR = 280;
const EPS_VOL = 1e-14;

function boreArea(d: number): number {
  return Math.PI * 0.25 * d * d;
}

function portState(x: number, bulletLen: number, port: number): PortState {
  const nose = x + bulletLen;
  if (nose < port) return "ahead";
  if (x < port) return "sealed";
  return "behind";
}

function vieilleRate(beta: number, n: number, p: number): number {
  const pMPa = Math.max(p, P_FLOOR) / 1e6;
  return beta * pMPa ** n;
}

function chokedMassFlow(
  p: number,
  t: number,
  area: number,
  gamma: number,
  r: number,
): number {
  if (p < 1.2e5 || t < 80 || area <= 0) return 0;
  const crit = (2 / (gamma + 1)) ** ((gamma + 1) / (2 * (gamma - 1)));
  return 0.85 * area * p * Math.sqrt(gamma / (r * t)) * crit;
}

function mixGamma(charges: Charge[], z: Float64Array): number {
  let num = 0;
  let den = 0;
  for (let i = 0; i < charges.length; i++) {
    const c = charges[i]!;
    if (!c.enabled) continue;
    const m = c.mass * z[i]!;
    num += m * c.propellant.gamma;
    den += m;
  }
  return den > 0 ? num / den : 1.23;
}

function mixCovolume(charges: Charge[], z: Float64Array): number {
  let num = 0;
  let den = 0;
  for (let i = 0; i < charges.length; i++) {
    const c = charges[i]!;
    if (!c.enabled) continue;
    const m = c.mass * z[i]!;
    num += m * c.propellant.covolume;
    den += m;
  }
  return den > 0 ? num / den : 1e-3;
}

function mixR(charges: Charge[], z: Float64Array): number {
  let num = 0;
  let den = 0;
  for (let i = 0; i < charges.length; i++) {
    const c = charges[i]!;
    if (!c.enabled) continue;
    const m = c.mass * z[i]!;
    num += m * specificGasConstant(c.propellant);
    den += m;
  }
  return den > 0 ? num / den : 380;
}

function solidsInBore(
  charges: Charge[],
  z: Float64Array,
  connected: Uint8Array,
): number {
  let v = 0;
  for (let i = 0; i < charges.length; i++) {
    const c = charges[i]!;
    if (!c.enabled) continue;
    const inBore = c.kind === "base" || connected[i] === 1;
    if (!inBore) continue;
    v += (c.mass * (1 - z[i]!)) / c.propellant.density;
  }
  return v;
}

function openedSideVolume(
  charges: Charge[],
  connected: Uint8Array,
): number {
  let v = 0;
  for (let i = 0; i < charges.length; i++) {
    const c = charges[i]!;
    if (!c.enabled) continue;
    if (c.kind === "sequential" && connected[i] === 1) v += c.chamberVolume;
  }
  return v;
}

function chargeSample(
  z: number,
  ignited: boolean,
  port: PortState,
  pSide: number,
  isolated: boolean,
): ChargeSample {
  return { z, ignited, port, pSide, isolated };
}

export function closedBombPressure(charge: Charge): number {
  const { mass, propellant, chamberVolume } = charge;
  const vGas = chamberVolume - propellant.covolume * mass;
  if (vGas <= EPS_VOL) return Infinity;
  return (mass * propellant.impetus) / vGas;
}

export function totalChemicalEnergy(config: GunConfig): number {
  let e = 0;
  for (const c of config.charges) {
    if (c.enabled) e += chemicalEnergy(c.propellant, c.mass);
  }
  return e;
}

function hoopStress(p: number, diameter: number, wall: number): number {
  if (wall <= 0) return Infinity;
  return (p * diameter) / (2 * wall);
}

function buildWarnings(
  config: GunConfig,
  summary: SimResult["summary"],
  status: SimStatus,
): SimWarning[] {
  const w: SimWarning[] = [];
  if (summary.saamiRatio > 1.05) {
    w.push({
      id: "saami",
      level: summary.saamiRatio > 1.6 ? "danger" : "warn",
      title: "Above .22 LR SAAMI MAP",
      body: `Peak space-mean pressure is ${(summary.saamiRatio * 100).toFixed(0)}% of the 24,000 psi SAAMI maximum average pressure for .22 Long Rifle. A real rimfire barrel is not rated for this. The sequential-charge idea needs a purpose-built tube, not a converted .22.`,
    });
  }
  if (summary.hoopStress > STEEL_YIELD_PA) {
    w.push({
      id: "yield",
      level: "danger",
      title: "Hoop stress past yield",
      body: "Thin-wall estimate σ = P d / (2 t) exceeds ~415 MPa. In this model the barrel would yield. Increase wall thickness or destage the charges so peaks do not stack.",
    });
  }
  if (summary.unburnedFraction > 0.08) {
    w.push({
      id: "unburned",
      level: "warn",
      title: "Incomplete burn",
      body: `${(summary.unburnedFraction * 100).toFixed(0)}% of the powder is still solid at muzzle exit. Vieille's law slows dramatically as the bore volume grows — late stations often fizzle. Move them forward or reduce web thickness.`,
    });
  }
  if (summary.blowbyMass > 1e-6) {
    w.push({
      id: "blowby",
      level: "warn",
      title: "Precursor blow-by",
      body: "A side charge dumped gas while its port was still ahead of the bullet. That mass is lost as a precursor wave and can even put pressure in front of the projectile. Fire after the base uncovers the port.",
    });
  }
  if (status !== "exited") {
    w.push({
      id: "stuck",
      level: "danger",
      title: status === "stuck" ? "Projectile did not start" : "Did not reach the muzzle",
      body: "Start pressure, friction, or a mistimed precursor stall can pin the bullet. Lower start pressure or delay the side charges.",
    });
  }
  if (summary.efficiency < 0.12 && status === "exited") {
    w.push({
      id: "efficiency",
      level: "info",
      title: "Low energy conversion",
      body: "Only a small fraction of chemical energy became projectile kinetic energy. Typical small-arms interior ballistics convert 20–40%. Check timing, heat loss, and unburned fraction.",
    });
  }
  return w;
}

function energyBreakdown(args: {
  chemical: number;
  released: number;
  keProj: number;
  keGas: number;
  heat: number;
  friction: number;
  blowby: number;
  eSide: number;
  eBore: number;
  primer: number;
}): EnergyBreakdown {
  return {
    chemical: args.chemical,
    unburned: Math.max(0, args.chemical - args.released),
    projectile: args.keProj,
    gasKinetic: args.keGas,
    thermal: Math.max(0, args.eBore + args.eSide),
    heat: args.heat,
    friction: args.friction,
    blowby: args.blowby,
    primer: args.primer,
  };
}

/**
 * Lumped-parameter sequential-charge interior ballistics.
 *
 * Control volume: gas behind the projectile, including any side chamber
 * whose port has been uncovered by the bullet base.
 *
 *   Noble-Abel:     P (V − α m − V_solid) = (γ − 1) E
 *   Vieille:        r = β (P / 1 MPa)^n ,  dz = r dt / web
 *   Resal energy:   E_chem = E_therm + KE_proj + KE_gas + Q + W_fric + E_blowby
 *   Lagrange:       m_eff = m + m_g / 3
 *   Motion:         m_eff a = (P − P_res − P_atm) A
 *
 * Sequential charges ignite when the base reaches position + triggerOffset
 * and dump into the bore once the port state is "behind". Prefire while
 * "ahead" vents overboard as precursor blow-by through a choked orifice.
 */
export function simulate(config: GunConfig): SimResult {
  const charges = config.charges;
  const n = charges.length;
  const A = boreArea(config.boreDiameter);
  const mProj = config.projectileMass;
  const L = config.barrelLength;
  const d = config.boreDiameter;

  const z = new Float64Array(n);
  const ignited = new Uint8Array(n);
  const connected = new Uint8Array(n);
  const mSide = new Float64Array(n);
  const eSide = new Float64Array(n);
  const mBlow = new Float64Array(n);
  const sidePeak = new Float64Array(n);
  const burnoutNoted = new Uint8Array(n);
  const igniteNoted = new Uint8Array(n);
  const blowNoted = new Uint8Array(n);

  let t = 0;
  let x = 0;
  let v = 0;
  let moved = false;
  let qHeat = 0;
  let wFric = 0;
  let eBlow = 0;

  const events: SimEvent[] = [];
  const samples: Sample[] = [];

  const chemTotal = totalChemicalEnergy(config);
  const peakClosed = charges.reduce((acc, c) => {
    if (!c.enabled || c.kind !== "base") return acc;
    return Math.max(acc, closedBombPressure(c));
  }, 0);

  // Primer: flash a few percent of the base grain so Vieille has a
  // non-trivial starting pressure. Rimfire priming compound is the physical
  // analogue; that energy is already counted in C z f/(γ−1).
  let primer = 0;
  for (let i = 0; i < n; i++) {
    const c = charges[i]!;
    if (c.kind === "base" && c.enabled) {
      z[i] = 0.03;
      ignited[i] = 1;
      primer = chemicalEnergy(c.propellant, c.mass * z[i]!);
    }
  }
  events.push({
    t: 0,
    x: 0,
    kind: "primer",
    chargeId: charges.find((c) => c.kind === "base")?.id,
    note: "Rimfire primer flashes the base charge",
  });

  let pPeak = 0;
  let pPeakX = 0;
  let pPeakT = 0;
  let peakNoted = false;
  let steps = 0;
  let status: SimStatus = "max-time";

  const snapshot = (
    p: number,
    pBreech: number,
    pBase: number,
    temp: number,
    mGas: number,
    eTherm: number,
    keProj: number,
    keGas: number,
    released: number,
    a: number,
    ports: PortState[],
  ): Sample => ({
    t,
    x,
    v,
    a,
    p,
    pBreech,
    pBase,
    temperature: temp,
    mGas,
    eTherm,
    keProj,
    keGas,
    heatLoss: qHeat,
    frictionWork: wFric,
    blowbyEnergy: eBlow,
    released,
    charges: charges.map((c, i) =>
      chargeSample(
        z[i]!,
        ignited[i] === 1,
        ports[i]!,
        c.kind === "base" || connected[i] === 1 ? p : sidePeak[i]! > 0
          ? (c.propellant.gamma - 1) *
            eSide[i]! /
            Math.max(
              c.chamberVolume -
                (c.mass * (1 - z[i]!)) / c.propellant.density -
                c.propellant.covolume * mSide[i]!,
              EPS_VOL,
            )
          : P_FLOOR,
        connected[i] === 0 && c.kind === "sequential",
      ),
    ),
  });

  while (t < T_MAX) {
    steps++;

    const ports: PortState[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const c = charges[i]!;
      if (!c.enabled) {
        ports[i] = "behind";
        continue;
      }
      if (c.kind === "base") {
        ports[i] = "behind";
        connected[i] = 1;
        continue;
      }
      const ps = portState(x, config.projectileLength, c.position);
      ports[i] = ps;
      if (ps === "behind" && connected[i] === 0) {
        connected[i] = 1;
        // Instant mix is accurate: for a ~3 mm port, V/(A c) ~ 15 µs.
        mSide[i] = 0;
        eSide[i] = 0;
      }
    }

    for (let i = 0; i < n; i++) {
      const c = charges[i]!;
      if (!c.enabled || ignited[i]) continue;
      if (x + 1e-9 >= c.position + c.triggerOffset) {
        ignited[i] = 1;
        // Flash kernel — primer or bore-gas ignition. Isolated charges
        // need this or Vieille crawls at 1 atm and never takes off.
        if (z[i]! < 0.03) {
          const z0 = 0.03;
          const dm = c.mass * (z0 - z[i]!);
          z[i] = z0;
          if (c.kind === "sequential" && connected[i] === 0) {
            mSide[i] = mSide[i]! + dm;
            eSide[i] = eSide[i]! + chemicalEnergy(c.propellant, dm);
          }
        }
        if (!igniteNoted[i]) {
          igniteNoted[i] = 1;
          events.push({
            t,
            x,
            kind: "ignite",
            chargeId: c.id,
            note:
              c.kind === "base"
                ? "Base charge burning"
                : ports[i] === "ahead"
                  ? `Charge ${c.label} pre-fired (port still ahead)`
                  : `Charge ${c.label} ignited at port`,
          });
          if (ports[i] === "ahead") {
            events.push({
              t,
              x,
              kind: "blow-by",
              chargeId: c.id,
              note: `Blow-by: ${c.label} venting ahead of the bullet`,
            });
          }
        }
      }
    }

    let released = 0;
    for (let i = 0; i < n; i++) {
      const c = charges[i]!;
      if (!c.enabled) continue;
      released += chemicalEnergy(c.propellant, c.mass * z[i]!);
    }

    let eSideSum = 0;
    let mSideSum = 0;
    let mBlowSum = 0;
    for (let i = 0; i < n; i++) {
      eSideSum += eSide[i]!;
      mSideSum += mSide[i]!;
      mBlowSum += mBlow[i]!;
    }

    let mBurned = 0;
    for (let i = 0; i < n; i++) {
      const c = charges[i]!;
      if (c.enabled) mBurned += c.mass * z[i]!;
    }
    const mGas = Math.max(0, mBurned - mSideSum - mBlowSum);

    const keProj = 0.5 * mProj * v * v;
    const keGas = 0.5 * (mGas / 3) * v * v;
    const eBore = released - keProj - keGas - qHeat - wFric - eBlow - eSideSum;

    const gamma = mixGamma(charges, z);
    const alpha = mixCovolume(charges, z);
    const rBar = mixR(charges, z);

    const vGeom =
      config.chamberVolume + A * x + openedSideVolume(charges, connected);
    const vSolid = solidsInBore(charges, z, connected);
    const vGas = vGeom - vSolid - alpha * mGas;

    let p = P_FLOOR;
    let temp = config.wallTemp;
    if (mGas > 1e-12 && eBore > 0 && vGas > EPS_VOL) {
      p = ((gamma - 1) * eBore) / vGas;
      temp = (p * vGas) / (mGas * rBar);
    }
    p = Math.min(Math.max(p, P_FLOOR), 2e9);
    temp = Math.min(Math.max(temp, T_FLOOR), 6000);

    const mEff = mProj + mGas / 3;
    const aLag = ((p - config.ambientPressure) * A) / Math.max(mEff, 1e-9);
    const pBreech = x > 0.001 ? p + (mGas * aLag) / (4 * A) : p;
    const pBase = x > 0.001 ? p - (mGas * aLag) / (4 * A) : p;

    if (p > pPeak) {
      pPeak = p;
      pPeakX = x;
      pPeakT = t;
    }

    const pEng =
      config.engravingPressure * Math.exp(-x / Math.max(config.engravingDecay, 1e-4));
    const pRes = pEng + config.frictionPressure;

    let a = 0;
    const driving = p - config.ambientPressure - pRes;
    if (!moved) {
      if (p >= config.startPressure && driving > 0) {
        moved = true;
        events.push({
          t,
          x,
          kind: "shot-start",
          note: "Engraving pressure exceeded — projectile starts",
        });
      }
    }
    if (moved) {
      a = (driving * A) / mEff;
      v += a * DT;
      if (v < 0) v = 0;
      x += v * DT;
      if (x < 0) {
        x = 0;
        v = 0;
      }
      wFric += Math.max(pRes, 0) * A * v * DT;
    }

    const wallArea = Math.PI * d * (x + config.chamberVolume / A);
    const qDot = config.heatTransfer * wallArea * Math.max(temp - config.wallTemp, 0);
    qHeat += qDot * DT;

    // Burn each ignited charge at the pressure of the volume it occupies.
    for (let i = 0; i < n; i++) {
      const c = charges[i]!;
      if (!c.enabled || !ignited[i] || z[i]! >= 1) continue;
      const isolated = c.kind === "sequential" && connected[i] === 0;
      let pBurn = p;
      if (isolated) {
        const vs =
          c.chamberVolume -
          (c.mass * (1 - z[i]!)) / c.propellant.density -
          c.propellant.covolume * mSide[i]!;
        pBurn =
          mSide[i]! > 1e-12 && eSide[i]! > 0 && vs > EPS_VOL
            ? ((c.propellant.gamma - 1) * eSide[i]!) / vs
            : P_FLOOR;
        sidePeak[i] = Math.max(sidePeak[i]!, pBurn);
      }
      const r = vieilleRate(c.propellant.burnBeta, c.propellant.burnExp, pBurn);
      const dz = Math.min(1 - z[i]!, (r / c.propellant.web) * DT);
      if (dz <= 0) continue;
      const dm = c.mass * dz;
      const dE = chemicalEnergy(c.propellant, dm);
      z[i] = z[i]! + dz;
      if (isolated) {
        mSide[i] = mSide[i]! + dm;
        eSide[i] = eSide[i]! + dE;
      }
      if (z[i]! >= 0.999 && !burnoutNoted[i]) {
        burnoutNoted[i] = 1;
        z[i] = 1;
        events.push({
          t,
          x,
          kind: "burnout",
          chargeId: c.id,
          note: `${c.label} burned out`,
        });
      }
    }

    // Precursor leak: isolated gas in a port still ahead of the bullet.
    for (let i = 0; i < n; i++) {
      const c = charges[i]!;
      if (!c.enabled) continue;
      if (ports[i] !== "ahead" || mSide[i]! <= 0) continue;
      const vs =
        c.chamberVolume -
        (c.mass * (1 - z[i]!)) / c.propellant.density -
        c.propellant.covolume * mSide[i]!;
      const pSide =
        eSide[i]! > 0 && vs > EPS_VOL
          ? ((c.propellant.gamma - 1) * eSide[i]!) / vs
          : P_FLOOR;
      const tSide = Math.max(
        T_FLOOR,
        (pSide * Math.max(vs, EPS_VOL)) /
          (mSide[i]! * specificGasConstant(c.propellant)),
      );
      const mdot = chokedMassFlow(
        pSide,
        tSide,
        c.portArea,
        c.propellant.gamma,
        specificGasConstant(c.propellant),
      );
      const dm = Math.min(mSide[i]!, mdot * DT);
      if (dm <= 0) continue;
      const frac = dm / mSide[i]!;
      eBlow += eSide[i]! * frac;
      eSide[i] = eSide[i]! * (1 - frac);
      mSide[i] = mSide[i]! - dm;
      mBlow[i] = mBlow[i]! + dm;
      if (!blowNoted[i]) {
        blowNoted[i] = 1;
      }
    }

    if (!peakNoted && moved && p < pPeak * 0.92 && pPeak > config.startPressure) {
      peakNoted = true;
      events.push({
        t: pPeakT,
        x: pPeakX,
        kind: "peak-pressure",
        note: "First global pressure peak",
      });
    }

    if (x >= L) {
      status = "exited";
      x = L;
      events.push({
        t,
        x,
        kind: "muzzle",
        note: "Projectile base at the muzzle",
      });
      samples.push(
        snapshot(p, pBreech, pBase, temp, mGas, Math.max(eBore, 0), keProj, keGas, released, a, ports),
      );
      break;
    }

    if (steps % SAMPLE_EVERY === 1) {
      samples.push(
        snapshot(p, pBreech, pBase, temp, mGas, Math.max(eBore, 0), keProj, keGas, released, a, ports),
      );
    }

    t += DT;
  }

  if (status !== "exited") {
    if (!moved) status = "stuck";
    const lastPorts: PortState[] = charges.map((c, i) =>
      c.kind === "base" ? "behind" : portState(x, config.projectileLength, c.position),
    );
    samples.push(
      snapshot(
        samples.at(-1)?.p ?? P_FLOOR,
        samples.at(-1)?.pBreech ?? P_FLOOR,
        samples.at(-1)?.pBase ?? P_FLOOR,
        samples.at(-1)?.temperature ?? T_FLOOR,
        samples.at(-1)?.mGas ?? 0,
        samples.at(-1)?.eTherm ?? 0,
        0.5 * mProj * v * v,
        samples.at(-1)?.keGas ?? 0,
        samples.at(-1)?.released ?? primer,
        0,
        lastPorts,
      ),
    );
  }

  const last = samples.at(-1)!;
  let mBlowSum = 0;
  let eSideSum = 0;
  let burned = 0;
  let massAll = 0;
  let sidePeakMax = 0;
  for (let i = 0; i < n; i++) {
    const c = charges[i]!;
    if (!c.enabled) continue;
    mBlowSum += mBlow[i]!;
    eSideSum += eSide[i]!;
    burned += c.mass * z[i]!;
    massAll += c.mass;
    sidePeakMax = Math.max(sidePeakMax, sidePeak[i]!);
  }

  const energy = energyBreakdown({
    chemical: chemTotal,
    released: last.released,
    keProj: last.keProj,
    keGas: last.keGas,
    heat: last.heatLoss,
    friction: last.frictionWork,
    blowby: last.blowbyEnergy,
    eSide: eSideSum,
    eBore: last.eTherm,
    primer,
  });

  const summary = {
    muzzleVelocity: last.v,
    muzzleEnergy: last.keProj,
    peakPressure: pPeak,
    peakPressureTravel: pPeakX,
    peakPressureTime: pPeakT,
    timeToMuzzle: status === "exited" ? last.t : NaN,
    burnComplete: massAll > 0 ? burned / massAll > 0.99 : true,
    unburnedFraction: massAll > 0 ? 1 - burned / massAll : 0,
    efficiency: chemTotal > 0 ? last.keProj / chemTotal : 0,
    piezometric: peakClosed > 0 ? pPeak / peakClosed : 0,
    hoopStress: hoopStress(pPeak, d, config.wallThickness),
    saamiRatio: pPeak / SAAMI_22LR_MAP_PA,
    energy,
    sidePeakPressure: sidePeakMax,
    blowbyMass: mBlowSum,
  };

  return {
    status,
    samples,
    events,
    summary,
    warnings: buildWarnings(config, summary, status),
    steps,
    dt: DT,
    closedBombPressure: peakClosed,
  };
}

export function simulateBaseline(config: GunConfig): SimResult {
  const copy: GunConfig = {
    ...config,
    name: `${config.name} (base only)`,
    charges: config.charges.map((c) =>
      c.kind === "sequential" ? { ...c, enabled: false } : { ...c },
    ),
  };
  return simulate(copy);
}

export function interpolateSample(samples: Sample[], t: number): Sample {
  if (samples.length === 0) {
    throw new Error("no samples");
  }
  if (t <= samples[0]!.t) return samples[0]!;
  const last = samples[samples.length - 1]!;
  if (t >= last.t) return last;
  let lo = 0;
  let hi = samples.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid]!.t <= t) lo = mid;
    else hi = mid;
  }
  const a = samples[lo]!;
  const b = samples[hi]!;
  const u = (t - a.t) / Math.max(b.t - a.t, 1e-12);
  const lerp = (x: number, y: number) => x + (y - x) * u;
  return {
    t,
    x: lerp(a.x, b.x),
    v: lerp(a.v, b.v),
    a: lerp(a.a, b.a),
    p: lerp(a.p, b.p),
    pBreech: lerp(a.pBreech, b.pBreech),
    pBase: lerp(a.pBase, b.pBase),
    temperature: lerp(a.temperature, b.temperature),
    mGas: lerp(a.mGas, b.mGas),
    eTherm: lerp(a.eTherm, b.eTherm),
    keProj: lerp(a.keProj, b.keProj),
    keGas: lerp(a.keGas, b.keGas),
    heatLoss: lerp(a.heatLoss, b.heatLoss),
    frictionWork: lerp(a.frictionWork, b.frictionWork),
    blowbyEnergy: lerp(a.blowbyEnergy, b.blowbyEnergy),
    released: lerp(a.released, b.released),
    charges: a.charges.map((c, i) => {
      const d = b.charges[i]!;
      return {
        z: lerp(c.z, d.z),
        ignited: u < 0.5 ? c.ignited : d.ignited,
        port: u < 0.5 ? c.port : d.port,
        pSide: lerp(c.pSide, d.pSide),
        isolated: u < 0.5 ? c.isolated : d.isolated,
      };
    }),
  };
}
