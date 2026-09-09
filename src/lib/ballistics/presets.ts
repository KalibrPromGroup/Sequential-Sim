import { clonePropellant, RIMFIRE_FLAKE } from "./propellant.ts";
import type { Charge, GunConfig } from "./types.ts";
import { grainsToKg, inchesToM, mToInches } from "./units.ts";

function portAreaFromDiameter(mm: number): number {
  const r = (mm / 1000) / 2;
  return Math.PI * r * r;
}

function blankCharge(
  index: number,
  positionIn: number,
  side: 1 | -1,
  massGr = 1.2,
): Charge {
  return {
    id: `s${index}`,
    kind: "sequential",
    label: `Blank ${index}`,
    position: inchesToM(positionIn),
    mass: grainsToKg(massGr),
    propellant: clonePropellant(RIMFIRE_FLAKE),
    chamberVolume: 0.48e-6,
    portArea: portAreaFromDiameter(3.2),
    triggerOffset: 0,
    angle: 42,
    side,
    enabled: true,
  };
}

function baseCharge(massGr: number): Charge {
  return {
    id: "base",
    kind: "base",
    label: "Base .22 LR",
    position: 0,
    mass: grainsToKg(massGr),
    propellant: clonePropellant(RIMFIRE_FLAKE),
    chamberVolume: 0.44e-6,
    portArea: portAreaFromDiameter(5.5),
    triggerOffset: 0,
    angle: 0,
    side: 1,
    enabled: true,
  };
}

const GUN_DEFAULTS = {
  boreDiameter: 0.00566,
  chamberVolume: 0.44e-6,
  projectileMass: grainsToKg(40),
  projectileLength: 0.0104,
  startPressure: 6.8e6,
  engravingPressure: 8e6,
  engravingDecay: 0.01,
  frictionPressure: 4.5e5,
  heatTransfer: 4.8e4,
  wallTemp: 293,
  ambientPressure: 101325,
  wallThickness: 0.0035,
} satisfies Partial<GunConfig>;

function gun(
  partial: Omit<GunConfig, keyof typeof GUN_DEFAULTS> & Partial<GunConfig>,
): GunConfig {
  return { ...GUN_DEFAULTS, ...partial } as GunConfig;
}

/** Factory-ish standard-velocity .22 LR, 40 gr, ~18.5" rifle barrel. */
export function presetStandard22(): GunConfig {
  return gun({
    name: ".22 LR Standard",
    barrelLength: inchesToM(18.5),
    charges: [baseCharge(1.1)],
  });
}

/** High-velocity 40 gr .22 LR in a 24" barrel. */
export function presetHv22(): GunConfig {
  return gun({
    name: ".22 LR High Velocity",
    barrelLength: inchesToM(24),
    charges: [baseCharge(1.25)],
  });
}

/**
 * Compact V-3 layout: 24" barrel, base .22 LR plus four .22 blanks
 * staged so each fires as pressure from the previous peak is falling.
 */
export function presetV3Compact(): GunConfig {
  return gun({
    name: "V-3 Compact · 4 blanks",
    barrelLength: inchesToM(24),
    wallThickness: 0.005,
    charges: [
      baseCharge(1.1),
      blankCharge(1, 2.4, 1, 1.25),
      blankCharge(2, 5.2, -1, 1.25),
      blankCharge(3, 9.0, 1, 1.25),
      blankCharge(4, 14.0, -1, 1.25),
    ],
  });
}

/** Eight blanks on a 28" tube — denser staging, still compact vs. the historical V-3. */
export function presetV3Dense(): GunConfig {
  const stations = [2.0, 4.0, 6.4, 9.0, 12.0, 15.4, 19.2, 23.2];
  return gun({
    name: "V-3 Dense · 8 blanks",
    barrelLength: inchesToM(28),
    wallThickness: 0.006,
    charges: [
      baseCharge(1.1),
      ...stations.map((s, i) =>
        blankCharge(i + 1, s, i % 2 === 0 ? 1 : -1, 1.2),
      ),
    ],
  });
}

/** Same stations as compact, but charges fire 50 mm early — precursor blow-by. */
export function presetMistimed(): GunConfig {
  const cfg = presetV3Compact();
  cfg.name = "Mistimed · early fire";
  cfg.charges = cfg.charges.map((c) =>
    c.kind === "sequential" ? { ...c, triggerOffset: -0.05 } : { ...c },
  );
  return cfg;
}

/** Blanks clustered near the muzzle — too late, incomplete burn. */
export function presetLate(): GunConfig {
  return gun({
    name: "Staged late",
    barrelLength: inchesToM(24),
    wallThickness: 0.005,
    charges: [
      baseCharge(1.1),
      blankCharge(1, 12.0, 1, 1.25),
      blankCharge(2, 15.5, -1, 1.25),
      blankCharge(3, 18.5, 1, 1.25),
      blankCharge(4, 21.5, -1, 1.25),
    ],
  });
}

export const PRESETS: { id: string; make: () => GunConfig; blurb: string }[] = [
  {
    id: "v3",
    make: presetV3Compact,
    blurb: "Four .22 blanks on a 24 in tube. The demonstration layout.",
  },
  {
    id: "dense",
    make: presetV3Dense,
    blurb: "Eight blanks, 28 in. More energy, tighter staging.",
  },
  {
    id: "sv",
    make: presetStandard22,
    blurb: "Ordinary .22 LR, no side charges. Calibration reference.",
  },
  {
    id: "hv",
    make: presetHv22,
    blurb: "High-velocity .22 LR in a 24 in barrel.",
  },
  {
    id: "early",
    make: presetMistimed,
    blurb: "Same as compact, fired 50 mm too soon. Blow-by lesson.",
  },
  {
    id: "late",
    make: presetLate,
    blurb: "Blanks near the muzzle. They will not finish burning.",
  },
];

export function nextChargeId(charges: Charge[]): string {
  let max = 0;
  for (const c of charges) {
    if (c.kind !== "sequential") continue;
    const n = Number.parseInt(c.id.replace(/\D/g, ""), 10);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return `s${max + 1}`;
}

export function addSequentialCharge(config: GunConfig): GunConfig {
  const seq = config.charges.filter((c) => c.kind === "sequential");
  const n = seq.length + 1;
  const idNum = Number.parseInt(nextChargeId(config.charges).slice(1), 10);
  const lastPos = seq.at(-1)?.position ?? inchesToM(2.2);
  const pos = Math.min(lastPos + inchesToM(3.2), config.barrelLength * 0.88);
  const charge = blankCharge(idNum, mToInches(pos), n % 2 === 1 ? 1 : -1);
  charge.id = `s${idNum}`;
  charge.label = `Blank ${idNum}`;
  return { ...config, charges: [...config.charges, charge] };
}

export function removeCharge(config: GunConfig, id: string): GunConfig {
  const target = config.charges.find((c) => c.id === id);
  if (!target || target.kind === "base") return config;
  return { ...config, charges: config.charges.filter((c) => c.id !== id) };
}

export function distributeStations(
  config: GunConfig,
  mode: "even" | "v3" | "front",
): GunConfig {
  const seq = config.charges.filter((c) => c.kind === "sequential" && c.enabled);
  const n = seq.length;
  if (n === 0) return config;
  const L = config.barrelLength;
  const start = L * (mode === "front" ? 0.08 : 0.1);
  const end = L * (mode === "front" ? 0.48 : mode === "v3" ? 0.62 : 0.82);
  const ids = new Set(seq.map((c) => c.id));
  let k = 0;
  const charges = config.charges.map((c) => {
    if (!ids.has(c.id)) return c;
    const u = n === 1 ? 0 : k / (n - 1);
    k += 1;
    const shaped = mode === "v3" ? u ** 1.25 : u;
    return { ...c, position: start + (end - start) * shaped };
  });
  return { ...config, charges };
}

export function cloneConfig(config: GunConfig): GunConfig {
  return {
    ...config,
    charges: config.charges.map((c) => ({
      ...c,
      propellant: clonePropellant(c.propellant),
    })),
  };
}
