import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as RotateCcw, c as Pause, i as SlidersHorizontal, l as Info, n as TriangleAlert, o as Plus, r as Trash2, s as Play, t as X, u as BookOpen } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CWdykWHd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var tapScale = "active:not-disabled:scale-[0.96]";
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-10 items-center gap-1 rounded-lg bg-secondary p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-muted-foreground", "transition-colors duration-150", "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-border)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-3 outline-none", className),
		...props
	});
}
/** Unit conversions. The integrator is SI throughout. */
var GRAIN = 6479891e-11;
var INCH = .0254;
var FPS = .3048;
var PSI = 6894.757293168;
var FTLB = 1.3558179483314;
function grainsToKg(gr) {
	return gr * GRAIN;
}
function kgToGrains(kg) {
	return kg / GRAIN;
}
function inchesToM(inches) {
	return inches * INCH;
}
function mToInches(m) {
	return m / INCH;
}
function msToFps(ms) {
	return ms / FPS;
}
function psiToPa(psi) {
	return psi * PSI;
}
function paToPsi(pa) {
	return pa / PSI;
}
function jToFtLb(j) {
	return j / FTLB;
}
var SAAMI_22LR_MAP_PA = psiToPa(24e3);
/**
* Fast single-base nitrocellulose flake, representative of factory .22 LR
* powder and .22 blanks. Impetus / covolume / gamma sit in the published
* range for NC small-arms propellants (Corner; STANAG 4367-class values).
*
* Vieille β and web are calibrated so a 40 gr / 1.10 gr load in an 18.5"
* barrel produces ~1080 fps at ~21 ksi — a CCI-standard-velocity-class
* interior-ballistics point. Sequential blanks reuse the same powder.
*/
var RIMFIRE_FLAKE = {
	name: "Rimfire flake (fast NC)",
	impetus: 108e4,
	gamma: 1.23,
	covolume: .001,
	density: 1600,
	flameTemp: 2820,
	burnExp: .8,
	burnBeta: .0056,
	web: 23e-6
};
function clonePropellant(p) {
	return { ...p };
}
/** Chemical energy released by burning mass m of this powder, J. */
function chemicalEnergy(p, mass) {
	return mass * p.impetus / (p.gamma - 1);
}
/** Specific gas constant R = f / T_expl, J/(kg K). */
function specificGasConstant(p) {
	return p.impetus / p.flameTemp;
}
var DT = 25e-8;
var T_MAX = .018;
var SAMPLE_EVERY = 48;
var P_FLOOR = 101325;
var T_FLOOR = 280;
var EPS_VOL = 1e-14;
function boreArea(d) {
	return Math.PI * .25 * d * d;
}
function portState(x, bulletLen, port) {
	if (x + bulletLen < port) return "ahead";
	if (x < port) return "sealed";
	return "behind";
}
function vieilleRate(beta, n, p) {
	return beta * (Math.max(p, P_FLOOR) / 1e6) ** n;
}
function chokedMassFlow(p, t, area, gamma, r) {
	if (p < 12e4 || t < 80 || area <= 0) return 0;
	const crit = (2 / (gamma + 1)) ** ((gamma + 1) / (2 * (gamma - 1)));
	return .85 * area * p * Math.sqrt(gamma / (r * t)) * crit;
}
function mixGamma(charges, z) {
	let num = 0;
	let den = 0;
	for (let i = 0; i < charges.length; i++) {
		const c = charges[i];
		if (!c.enabled) continue;
		const m = c.mass * z[i];
		num += m * c.propellant.gamma;
		den += m;
	}
	return den > 0 ? num / den : 1.23;
}
function mixCovolume(charges, z) {
	let num = 0;
	let den = 0;
	for (let i = 0; i < charges.length; i++) {
		const c = charges[i];
		if (!c.enabled) continue;
		const m = c.mass * z[i];
		num += m * c.propellant.covolume;
		den += m;
	}
	return den > 0 ? num / den : .001;
}
function mixR(charges, z) {
	let num = 0;
	let den = 0;
	for (let i = 0; i < charges.length; i++) {
		const c = charges[i];
		if (!c.enabled) continue;
		const m = c.mass * z[i];
		num += m * specificGasConstant(c.propellant);
		den += m;
	}
	return den > 0 ? num / den : 380;
}
function solidsInBore(charges, z, connected) {
	let v = 0;
	for (let i = 0; i < charges.length; i++) {
		const c = charges[i];
		if (!c.enabled) continue;
		if (!(c.kind === "base" || connected[i] === 1)) continue;
		v += c.mass * (1 - z[i]) / c.propellant.density;
	}
	return v;
}
function openedSideVolume(charges, connected) {
	let v = 0;
	for (let i = 0; i < charges.length; i++) {
		const c = charges[i];
		if (!c.enabled) continue;
		if (c.kind === "sequential" && connected[i] === 1) v += c.chamberVolume;
	}
	return v;
}
function chargeSample(z, ignited, port, pSide, isolated) {
	return {
		z,
		ignited,
		port,
		pSide,
		isolated
	};
}
function closedBombPressure(charge) {
	const { mass, propellant, chamberVolume } = charge;
	const vGas = chamberVolume - propellant.covolume * mass;
	if (vGas <= EPS_VOL) return Infinity;
	return mass * propellant.impetus / vGas;
}
function totalChemicalEnergy(config) {
	let e = 0;
	for (const c of config.charges) if (c.enabled) e += chemicalEnergy(c.propellant, c.mass);
	return e;
}
function hoopStress(p, diameter, wall) {
	if (wall <= 0) return Infinity;
	return p * diameter / (2 * wall);
}
function buildWarnings(config, summary, status) {
	const w = [];
	if (summary.saamiRatio > 1.05) w.push({
		id: "saami",
		level: summary.saamiRatio > 1.6 ? "danger" : "warn",
		title: "Above .22 LR SAAMI MAP",
		body: `Peak space-mean pressure is ${(summary.saamiRatio * 100).toFixed(0)}% of the 24,000 psi SAAMI maximum average pressure for .22 Long Rifle. A real rimfire barrel is not rated for this. The sequential-charge idea needs a purpose-built tube, not a converted .22.`
	});
	if (summary.hoopStress > 415e6) w.push({
		id: "yield",
		level: "danger",
		title: "Hoop stress past yield",
		body: "Thin-wall estimate σ = P d / (2 t) exceeds ~415 MPa. In this model the barrel would yield. Increase wall thickness or destage the charges so peaks do not stack."
	});
	if (summary.unburnedFraction > .08) w.push({
		id: "unburned",
		level: "warn",
		title: "Incomplete burn",
		body: `${(summary.unburnedFraction * 100).toFixed(0)}% of the powder is still solid at muzzle exit. Vieille's law slows dramatically as the bore volume grows — late stations often fizzle. Move them forward or reduce web thickness.`
	});
	if (summary.blowbyMass > 1e-6) w.push({
		id: "blowby",
		level: "warn",
		title: "Precursor blow-by",
		body: "A side charge dumped gas while its port was still ahead of the bullet. That mass is lost as a precursor wave and can even put pressure in front of the projectile. Fire after the base uncovers the port."
	});
	if (status !== "exited") w.push({
		id: "stuck",
		level: "danger",
		title: status === "stuck" ? "Projectile did not start" : "Did not reach the muzzle",
		body: "Start pressure, friction, or a mistimed precursor stall can pin the bullet. Lower start pressure or delay the side charges."
	});
	if (summary.efficiency < .12 && status === "exited") w.push({
		id: "efficiency",
		level: "info",
		title: "Low energy conversion",
		body: "Only a small fraction of chemical energy became projectile kinetic energy. Typical small-arms interior ballistics convert 20–40%. Check timing, heat loss, and unburned fraction."
	});
	return w;
}
function energyBreakdown(args) {
	return {
		chemical: args.chemical,
		unburned: Math.max(0, args.chemical - args.released),
		projectile: args.keProj,
		gasKinetic: args.keGas,
		thermal: Math.max(0, args.eBore + args.eSide),
		heat: args.heat,
		friction: args.friction,
		blowby: args.blowby,
		primer: args.primer
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
function simulate(config) {
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
	const events = [];
	const samples = [];
	const chemTotal = totalChemicalEnergy(config);
	const peakClosed = charges.reduce((acc, c) => {
		if (!c.enabled || c.kind !== "base") return acc;
		return Math.max(acc, closedBombPressure(c));
	}, 0);
	let primer = 0;
	for (let i = 0; i < n; i++) {
		const c = charges[i];
		if (c.kind === "base" && c.enabled) {
			z[i] = .03;
			ignited[i] = 1;
			primer = chemicalEnergy(c.propellant, c.mass * z[i]);
		}
	}
	events.push({
		t: 0,
		x: 0,
		kind: "primer",
		chargeId: charges.find((c) => c.kind === "base")?.id,
		note: "Rimfire primer flashes the base charge"
	});
	let pPeak = 0;
	let pPeakX = 0;
	let pPeakT = 0;
	let peakNoted = false;
	let steps = 0;
	let status = "max-time";
	const snapshot = (p, pBreech, pBase, temp, mGas, eTherm, keProj, keGas, released, a, ports) => ({
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
		charges: charges.map((c, i) => chargeSample(z[i], ignited[i] === 1, ports[i], c.kind === "base" || connected[i] === 1 ? p : sidePeak[i] > 0 ? (c.propellant.gamma - 1) * eSide[i] / Math.max(c.chamberVolume - c.mass * (1 - z[i]) / c.propellant.density - c.propellant.covolume * mSide[i], EPS_VOL) : P_FLOOR, connected[i] === 0 && c.kind === "sequential"))
	});
	while (t < T_MAX) {
		steps++;
		const ports = new Array(n);
		for (let i = 0; i < n; i++) {
			const c = charges[i];
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
				mSide[i] = 0;
				eSide[i] = 0;
			}
		}
		for (let i = 0; i < n; i++) {
			const c = charges[i];
			if (!c.enabled || ignited[i]) continue;
			if (x + 1e-9 >= c.position + c.triggerOffset) {
				ignited[i] = 1;
				if (z[i] < .03) {
					const z0 = .03;
					const dm = c.mass * (z0 - z[i]);
					z[i] = z0;
					if (c.kind === "sequential" && connected[i] === 0) {
						mSide[i] = mSide[i] + dm;
						eSide[i] = eSide[i] + chemicalEnergy(c.propellant, dm);
					}
				}
				if (!igniteNoted[i]) {
					igniteNoted[i] = 1;
					events.push({
						t,
						x,
						kind: "ignite",
						chargeId: c.id,
						note: c.kind === "base" ? "Base charge burning" : ports[i] === "ahead" ? `Charge ${c.label} pre-fired (port still ahead)` : `Charge ${c.label} ignited at port`
					});
					if (ports[i] === "ahead") events.push({
						t,
						x,
						kind: "blow-by",
						chargeId: c.id,
						note: `Blow-by: ${c.label} venting ahead of the bullet`
					});
				}
			}
		}
		let released = 0;
		for (let i = 0; i < n; i++) {
			const c = charges[i];
			if (!c.enabled) continue;
			released += chemicalEnergy(c.propellant, c.mass * z[i]);
		}
		let eSideSum = 0;
		let mSideSum = 0;
		let mBlowSum = 0;
		for (let i = 0; i < n; i++) {
			eSideSum += eSide[i];
			mSideSum += mSide[i];
			mBlowSum += mBlow[i];
		}
		let mBurned = 0;
		for (let i = 0; i < n; i++) {
			const c = charges[i];
			if (c.enabled) mBurned += c.mass * z[i];
		}
		const mGas = Math.max(0, mBurned - mSideSum - mBlowSum);
		const keProj = .5 * mProj * v * v;
		const keGas = .5 * (mGas / 3) * v * v;
		const eBore = released - keProj - keGas - qHeat - wFric - eBlow - eSideSum;
		const gamma = mixGamma(charges, z);
		const alpha = mixCovolume(charges, z);
		const rBar = mixR(charges, z);
		const vGas = config.chamberVolume + A * x + openedSideVolume(charges, connected) - solidsInBore(charges, z, connected) - alpha * mGas;
		let p = P_FLOOR;
		let temp = config.wallTemp;
		if (mGas > 1e-12 && eBore > 0 && vGas > EPS_VOL) {
			p = (gamma - 1) * eBore / vGas;
			temp = p * vGas / (mGas * rBar);
		}
		p = Math.min(Math.max(p, P_FLOOR), 2e9);
		temp = Math.min(Math.max(temp, T_FLOOR), 6e3);
		const mEff = mProj + mGas / 3;
		const aLag = (p - config.ambientPressure) * A / Math.max(mEff, 1e-9);
		const pBreech = x > .001 ? p + mGas * aLag / (4 * A) : p;
		const pBase = x > .001 ? p - mGas * aLag / (4 * A) : p;
		if (p > pPeak) {
			pPeak = p;
			pPeakX = x;
			pPeakT = t;
		}
		const pRes = config.engravingPressure * Math.exp(-x / Math.max(config.engravingDecay, 1e-4)) + config.frictionPressure;
		let a = 0;
		const driving = p - config.ambientPressure - pRes;
		if (!moved) {
			if (p >= config.startPressure && driving > 0) {
				moved = true;
				events.push({
					t,
					x,
					kind: "shot-start",
					note: "Engraving pressure exceeded — projectile starts"
				});
			}
		}
		if (moved) {
			a = driving * A / mEff;
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
		for (let i = 0; i < n; i++) {
			const c = charges[i];
			if (!c.enabled || !ignited[i] || z[i] >= 1) continue;
			const isolated = c.kind === "sequential" && connected[i] === 0;
			let pBurn = p;
			if (isolated) {
				const vs = c.chamberVolume - c.mass * (1 - z[i]) / c.propellant.density - c.propellant.covolume * mSide[i];
				pBurn = mSide[i] > 1e-12 && eSide[i] > 0 && vs > EPS_VOL ? (c.propellant.gamma - 1) * eSide[i] / vs : P_FLOOR;
				sidePeak[i] = Math.max(sidePeak[i], pBurn);
			}
			const r = vieilleRate(c.propellant.burnBeta, c.propellant.burnExp, pBurn);
			const dz = Math.min(1 - z[i], r / c.propellant.web * DT);
			if (dz <= 0) continue;
			const dm = c.mass * dz;
			const dE = chemicalEnergy(c.propellant, dm);
			z[i] = z[i] + dz;
			if (isolated) {
				mSide[i] = mSide[i] + dm;
				eSide[i] = eSide[i] + dE;
			}
			if (z[i] >= .999 && !burnoutNoted[i]) {
				burnoutNoted[i] = 1;
				z[i] = 1;
				events.push({
					t,
					x,
					kind: "burnout",
					chargeId: c.id,
					note: `${c.label} burned out`
				});
			}
		}
		for (let i = 0; i < n; i++) {
			const c = charges[i];
			if (!c.enabled) continue;
			if (ports[i] !== "ahead" || mSide[i] <= 0) continue;
			const vs = c.chamberVolume - c.mass * (1 - z[i]) / c.propellant.density - c.propellant.covolume * mSide[i];
			const pSide = eSide[i] > 0 && vs > EPS_VOL ? (c.propellant.gamma - 1) * eSide[i] / vs : P_FLOOR;
			const mdot = chokedMassFlow(pSide, Math.max(T_FLOOR, pSide * Math.max(vs, EPS_VOL) / (mSide[i] * specificGasConstant(c.propellant))), c.portArea, c.propellant.gamma, specificGasConstant(c.propellant));
			const dm = Math.min(mSide[i], mdot * DT);
			if (dm <= 0) continue;
			const frac = dm / mSide[i];
			eBlow += eSide[i] * frac;
			eSide[i] = eSide[i] * (1 - frac);
			mSide[i] = mSide[i] - dm;
			mBlow[i] = mBlow[i] + dm;
			if (!blowNoted[i]) blowNoted[i] = 1;
		}
		if (!peakNoted && moved && p < pPeak * .92 && pPeak > config.startPressure) {
			peakNoted = true;
			events.push({
				t: pPeakT,
				x: pPeakX,
				kind: "peak-pressure",
				note: "First global pressure peak"
			});
		}
		if (x >= L) {
			status = "exited";
			x = L;
			events.push({
				t,
				x,
				kind: "muzzle",
				note: "Projectile base at the muzzle"
			});
			samples.push(snapshot(p, pBreech, pBase, temp, mGas, Math.max(eBore, 0), keProj, keGas, released, a, ports));
			break;
		}
		if (steps % SAMPLE_EVERY === 1) samples.push(snapshot(p, pBreech, pBase, temp, mGas, Math.max(eBore, 0), keProj, keGas, released, a, ports));
		t += DT;
	}
	if (status !== "exited") {
		if (!moved) status = "stuck";
		const lastPorts = charges.map((c, i) => c.kind === "base" ? "behind" : portState(x, config.projectileLength, c.position));
		samples.push(snapshot(samples.at(-1)?.p ?? P_FLOOR, samples.at(-1)?.pBreech ?? P_FLOOR, samples.at(-1)?.pBase ?? P_FLOOR, samples.at(-1)?.temperature ?? T_FLOOR, samples.at(-1)?.mGas ?? 0, samples.at(-1)?.eTherm ?? 0, .5 * mProj * v * v, samples.at(-1)?.keGas ?? 0, samples.at(-1)?.released ?? primer, 0, lastPorts));
	}
	const last = samples.at(-1);
	let mBlowSum = 0;
	let eSideSum = 0;
	let burned = 0;
	let massAll = 0;
	let sidePeakMax = 0;
	for (let i = 0; i < n; i++) {
		const c = charges[i];
		if (!c.enabled) continue;
		mBlowSum += mBlow[i];
		eSideSum += eSide[i];
		burned += c.mass * z[i];
		massAll += c.mass;
		sidePeakMax = Math.max(sidePeakMax, sidePeak[i]);
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
		primer
	});
	const summary = {
		muzzleVelocity: last.v,
		muzzleEnergy: last.keProj,
		peakPressure: pPeak,
		peakPressureTravel: pPeakX,
		peakPressureTime: pPeakT,
		timeToMuzzle: status === "exited" ? last.t : NaN,
		burnComplete: massAll > 0 ? burned / massAll > .99 : true,
		unburnedFraction: massAll > 0 ? 1 - burned / massAll : 0,
		efficiency: chemTotal > 0 ? last.keProj / chemTotal : 0,
		piezometric: peakClosed > 0 ? pPeak / peakClosed : 0,
		hoopStress: hoopStress(pPeak, d, config.wallThickness),
		saamiRatio: pPeak / SAAMI_22LR_MAP_PA,
		energy,
		sidePeakPressure: sidePeakMax,
		blowbyMass: mBlowSum
	};
	return {
		status,
		samples,
		events,
		summary,
		warnings: buildWarnings(config, summary, status),
		steps,
		dt: DT,
		closedBombPressure: peakClosed
	};
}
function simulateBaseline(config) {
	return simulate({
		...config,
		name: `${config.name} (base only)`,
		charges: config.charges.map((c) => c.kind === "sequential" ? {
			...c,
			enabled: false
		} : { ...c })
	});
}
function interpolateSample(samples, t) {
	if (samples.length === 0) throw new Error("no samples");
	if (t <= samples[0].t) return samples[0];
	const last = samples[samples.length - 1];
	if (t >= last.t) return last;
	let lo = 0;
	let hi = samples.length - 1;
	while (hi - lo > 1) {
		const mid = lo + hi >> 1;
		if (samples[mid].t <= t) lo = mid;
		else hi = mid;
	}
	const a = samples[lo];
	const b = samples[hi];
	const u = (t - a.t) / Math.max(b.t - a.t, 1e-12);
	const lerp = (x, y) => x + (y - x) * u;
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
			const d = b.charges[i];
			return {
				z: lerp(c.z, d.z),
				ignited: u < .5 ? c.ignited : d.ignited,
				port: u < .5 ? c.port : d.port,
				pSide: lerp(c.pSide, d.pSide),
				isolated: u < .5 ? c.isolated : d.isolated
			};
		})
	};
}
function portAreaFromDiameter(mm) {
	const r = mm / 1e3 / 2;
	return Math.PI * r * r;
}
function blankCharge(index, positionIn, side, massGr = 1.2) {
	return {
		id: `s${index}`,
		kind: "sequential",
		label: `Blank ${index}`,
		position: inchesToM(positionIn),
		mass: grainsToKg(massGr),
		propellant: clonePropellant(RIMFIRE_FLAKE),
		chamberVolume: 48e-8,
		portArea: portAreaFromDiameter(3.2),
		triggerOffset: 0,
		angle: 42,
		side,
		enabled: true
	};
}
function baseCharge(massGr) {
	return {
		id: "base",
		kind: "base",
		label: "Base .22 LR",
		position: 0,
		mass: grainsToKg(massGr),
		propellant: clonePropellant(RIMFIRE_FLAKE),
		chamberVolume: 44e-8,
		portArea: portAreaFromDiameter(5.5),
		triggerOffset: 0,
		angle: 0,
		side: 1,
		enabled: true
	};
}
var GUN_DEFAULTS = {
	boreDiameter: .00566,
	chamberVolume: 44e-8,
	projectileMass: grainsToKg(40),
	projectileLength: .0104,
	startPressure: 68e5,
	engravingPressure: 8e6,
	engravingDecay: .01,
	frictionPressure: 45e4,
	heatTransfer: 48e3,
	wallTemp: 293,
	ambientPressure: 101325,
	wallThickness: .0035
};
function gun(partial) {
	return {
		...GUN_DEFAULTS,
		...partial
	};
}
/** Factory-ish standard-velocity .22 LR, 40 gr, ~18.5" rifle barrel. */
function presetStandard22() {
	return gun({
		name: ".22 LR Standard",
		barrelLength: inchesToM(18.5),
		charges: [baseCharge(1.1)]
	});
}
/** High-velocity 40 gr .22 LR in a 24" barrel. */
function presetHv22() {
	return gun({
		name: ".22 LR High Velocity",
		barrelLength: inchesToM(24),
		charges: [baseCharge(1.25)]
	});
}
/**
* Compact V-3 layout: 24" barrel, base .22 LR plus four .22 blanks
* staged so each fires as pressure from the previous peak is falling.
*/
function presetV3Compact() {
	return gun({
		name: "V-3 Compact · 4 blanks",
		barrelLength: inchesToM(24),
		wallThickness: .005,
		charges: [
			baseCharge(1.1),
			blankCharge(1, 2.4, 1, 1.25),
			blankCharge(2, 5.2, -1, 1.25),
			blankCharge(3, 9, 1, 1.25),
			blankCharge(4, 14, -1, 1.25)
		]
	});
}
/** Eight blanks on a 28" tube — denser staging, still compact vs. the historical V-3. */
function presetV3Dense() {
	return gun({
		name: "V-3 Dense · 8 blanks",
		barrelLength: inchesToM(28),
		wallThickness: .006,
		charges: [baseCharge(1.1), ...[
			2,
			4,
			6.4,
			9,
			12,
			15.4,
			19.2,
			23.2
		].map((s, i) => blankCharge(i + 1, s, i % 2 === 0 ? 1 : -1, 1.2))]
	});
}
/** Same stations as compact, but charges fire 50 mm early — precursor blow-by. */
function presetMistimed() {
	const cfg = presetV3Compact();
	cfg.name = "Mistimed · early fire";
	cfg.charges = cfg.charges.map((c) => c.kind === "sequential" ? {
		...c,
		triggerOffset: -.05
	} : { ...c });
	return cfg;
}
/** Blanks clustered near the muzzle — too late, incomplete burn. */
function presetLate() {
	return gun({
		name: "Staged late",
		barrelLength: inchesToM(24),
		wallThickness: .005,
		charges: [
			baseCharge(1.1),
			blankCharge(1, 12, 1, 1.25),
			blankCharge(2, 15.5, -1, 1.25),
			blankCharge(3, 18.5, 1, 1.25),
			blankCharge(4, 21.5, -1, 1.25)
		]
	});
}
var PRESETS = [
	{
		id: "v3",
		make: presetV3Compact,
		blurb: "Four .22 blanks on a 24 in tube. The demonstration layout."
	},
	{
		id: "dense",
		make: presetV3Dense,
		blurb: "Eight blanks, 28 in. More energy, tighter staging."
	},
	{
		id: "sv",
		make: presetStandard22,
		blurb: "Ordinary .22 LR, no side charges. Calibration reference."
	},
	{
		id: "hv",
		make: presetHv22,
		blurb: "High-velocity .22 LR in a 24 in barrel."
	},
	{
		id: "early",
		make: presetMistimed,
		blurb: "Same as compact, fired 50 mm too soon. Blow-by lesson."
	},
	{
		id: "late",
		make: presetLate,
		blurb: "Blanks near the muzzle. They will not finish burning."
	}
];
function nextChargeId(charges) {
	let max = 0;
	for (const c of charges) {
		if (c.kind !== "sequential") continue;
		const n = Number.parseInt(c.id.replace(/\D/g, ""), 10);
		if (Number.isFinite(n)) max = Math.max(max, n);
	}
	return `s${max + 1}`;
}
function addSequentialCharge(config) {
	const seq = config.charges.filter((c) => c.kind === "sequential");
	const n = seq.length + 1;
	const idNum = Number.parseInt(nextChargeId(config.charges).slice(1), 10);
	const lastPos = seq.at(-1)?.position ?? inchesToM(2.2);
	const charge = blankCharge(idNum, mToInches(Math.min(lastPos + inchesToM(3.2), config.barrelLength * .88)), n % 2 === 1 ? 1 : -1);
	charge.id = `s${idNum}`;
	charge.label = `Blank ${idNum}`;
	return {
		...config,
		charges: [...config.charges, charge]
	};
}
function removeCharge(config, id) {
	const target = config.charges.find((c) => c.id === id);
	if (!target || target.kind === "base") return config;
	return {
		...config,
		charges: config.charges.filter((c) => c.id !== id)
	};
}
function distributeStations(config, mode) {
	const seq = config.charges.filter((c) => c.kind === "sequential" && c.enabled);
	const n = seq.length;
	if (n === 0) return config;
	const L = config.barrelLength;
	const start = L * (mode === "front" ? .08 : .1);
	const end = L * (mode === "front" ? .48 : mode === "v3" ? .62 : .82);
	const ids = new Set(seq.map((c) => c.id));
	let k = 0;
	const charges = config.charges.map((c) => {
		if (!ids.has(c.id)) return c;
		const u = n === 1 ? 0 : k / (n - 1);
		k += 1;
		const shaped = mode === "v3" ? u ** 1.25 : u;
		return {
			...c,
			position: start + (end - start) * shaped
		};
	});
	return {
		...config,
		charges
	};
}
function cloneConfig(config) {
	return {
		...config,
		charges: config.charges.map((c) => ({
			...c,
			propellant: clonePropellant(c.propellant)
		}))
	};
}
var STORAGE_KEY = "cascade-bore-v1";
function runPair(config) {
	return {
		result: simulate(config),
		baseline: simulateBaseline(config)
	};
}
var defaultConfig = presetV3Compact();
var defaultPair = runPair(defaultConfig);
function loadSavedConfig() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.charges?.length || !parsed.barrelLength) return null;
		return parsed;
	} catch {
		return null;
	}
}
var useLab = create((set, get) => {
	const persist = (config) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
		} catch {}
	};
	const apply = (config, extra) => {
		const pair = runPair(config);
		persist(config);
		set({
			config,
			result: pair.result,
			baseline: pair.baseline,
			playhead: 0,
			playing: false,
			...extra
		});
	};
	return {
		config: defaultConfig,
		result: defaultPair.result,
		baseline: defaultPair.baseline,
		playhead: 0,
		playing: false,
		speed: 500,
		selectedChargeId: "base",
		advanced: false,
		theoryOpen: false,
		presetId: "v3",
		setConfig: (config) => apply(cloneConfig(config)),
		patchConfig: (partial) => apply({
			...get().config,
			...partial
		}),
		patchCharge: (id, partial) => {
			const config = {
				...get().config,
				charges: get().config.charges.map((c) => c.id === id ? {
					...c,
					...partial
				} : c)
			};
			apply(config);
		},
		loadPreset: (id) => {
			const preset = PRESETS.find((p) => p.id === id);
			if (!preset) return;
			apply(preset.make(), {
				presetId: id,
				selectedChargeId: "base"
			});
		},
		addCharge: () => apply(addSequentialCharge(get().config)),
		removeCharge: (id) => {
			apply(removeCharge(get().config, id), { selectedChargeId: "base" });
		},
		distribute: (mode) => apply(distributeStations(get().config, mode)),
		setPlayhead: (t) => set({ playhead: t }),
		setPlaying: (playing) => set({ playing }),
		setSpeed: (speed) => set({ speed }),
		selectCharge: (id) => set({ selectedChargeId: id }),
		toggleAdvanced: () => set({ advanced: !get().advanced }),
		setTheoryOpen: (theoryOpen) => set({ theoryOpen }),
		hydrate: () => {
			const saved = loadSavedConfig();
			if (!saved) return;
			apply(saved);
		},
		sampleAt: () => {
			const { result, playhead } = get();
			if (!result.samples.length) return null;
			return interpolateSample(result.samples, playhead);
		}
	};
});
function ChartTip({ active, payload, label, unit }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-popover px-2.5 py-1.5 text-xs shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 font-mono text-muted-foreground",
			children: [
				label,
				" ",
				unit
			]
		}), payload.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-mono tabular-nums",
			style: { color: p.color },
			children: [
				p.name,
				" ",
				Number(p.value).toFixed(1)
			]
		}, p.name))]
	});
}
function ChartsPanel() {
	const result = useLab((s) => s.result);
	const baseline = useLab((s) => s.baseline);
	const data = (0, import_react.useMemo)(() => {
		const n = result.samples.length;
		const step = Math.max(1, Math.floor(n / 160));
		const rows = [];
		for (let i = 0; i < n; i += step) {
			const s = result.samples[i];
			const b = baseline.samples.find((q) => q.x >= s.x) ?? baseline.samples.at(-1);
			rows.push({
				xIn: mToInches(s.x),
				tMs: s.t * 1e3,
				pKsi: paToPsi(s.p) / 1e3,
				pBaseKsi: b ? paToPsi(b.p) / 1e3 : 0,
				vFps: msToFps(s.v),
				vBaseFps: b ? msToFps(b.v) : 0,
				proj: s.keProj,
				therm: s.eTherm,
				heat: s.heatLoss,
				chem: s.released
			});
		}
		return rows;
	}, [result, baseline]);
	const axis = {
		fontSize: 10,
		fill: "var(--color-muted-foreground)",
		fontFamily: "IBM Plex Mono"
	};
	const grid = {
		stroke: "var(--color-border)",
		strokeDasharray: "2 4"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "pressure",
		className: "px-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "pressure",
					children: "Pressure vs travel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "velocity",
					children: "Velocity vs travel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "energy",
					children: "Energy"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "pressure",
				className: "h-[220px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { ...grid }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "xIn",
								tick: axis,
								tickFormatter: (v) => `${Number(v).toFixed(0)}"`,
								interval: "preserveStartEnd",
								minTickGap: 24
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: axis,
								tickFormatter: (v) => `${v}`,
								width: 36
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { unit: "in" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "pBaseKsi",
								name: "base-only ksi",
								stroke: "var(--color-chart-base)",
								dot: false,
								strokeWidth: 1.25,
								strokeDasharray: "4 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "pKsi",
								name: "space-mean ksi",
								stroke: "var(--color-chart-pressure)",
								dot: false,
								strokeWidth: 1.75
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "velocity",
				className: "h-[220px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { ...grid }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "xIn",
								tick: axis,
								tickFormatter: (v) => `${Number(v).toFixed(0)}"`,
								interval: "preserveStartEnd",
								minTickGap: 24
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: axis,
								width: 40
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { unit: "in" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "vBaseFps",
								name: "base-only fps",
								stroke: "var(--color-chart-base)",
								dot: false,
								strokeWidth: 1.25,
								strokeDasharray: "4 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "vFps",
								name: "fps",
								stroke: "var(--color-chart-velocity)",
								dot: false,
								strokeWidth: 1.75
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "energy",
				className: "h-[220px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { ...grid }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "tMs",
								tick: axis,
								tickFormatter: (v) => `${Number(v).toFixed(1)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: axis,
								width: 36
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { unit: "ms" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "proj",
								name: "projectile J",
								stackId: "1",
								stroke: "var(--color-chart-velocity)",
								fill: "var(--color-chart-velocity)",
								fillOpacity: .35
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "therm",
								name: "thermal J",
								stackId: "1",
								stroke: "var(--color-chart-energy)",
								fill: "var(--color-chart-energy)",
								fillOpacity: .25
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "heat",
								name: "heat loss J",
								stackId: "1",
								stroke: "var(--color-chart-heat)",
								fill: "var(--color-chart-heat)",
								fillOpacity: .25
							})
						]
					})
				})
			})
		]
	});
}
var buttonVariants = cva(cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium", "transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", "disabled:pointer-events-none disabled:opacity-40", tapScale), {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[var(--shadow-border)]",
			outline: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:bg-accent",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md bg-secondary px-3 text-sm text-foreground tabular-nums", "shadow-[var(--shadow-border)] placeholder:text-muted-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:opacity-40", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function Separator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-px w-full bg-border", className) });
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-primary shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full", "bg-border transition-colors duration-150 data-[state=checked]:bg-primary", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-foreground transition-transform duration-150 data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-primary-foreground" })
	});
}
function Field({ label, value, onChange, min, max, step, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[11px] tabular-nums text-muted-foreground",
				children: [
					value.toFixed(step < 1 ? 2 : 0),
					" ",
					suffix
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			min,
			max,
			step,
			value: [value],
			onValueChange: ([v]) => onChange(v ?? value)
		})]
	});
}
function ControlsPanel() {
	const config = useLab((s) => s.config);
	const selectedChargeId = useLab((s) => s.selectedChargeId);
	const advanced = useLab((s) => s.advanced);
	const presetId = useLab((s) => s.presetId);
	const patchConfig = useLab((s) => s.patchConfig);
	const patchCharge = useLab((s) => s.patchCharge);
	const loadPreset = useLab((s) => s.loadPreset);
	const addCharge = useLab((s) => s.addCharge);
	const removeCharge = useLab((s) => s.removeCharge);
	const distribute = useLab((s) => s.distribute);
	const selectCharge = useLab((s) => s.selectCharge);
	const toggleAdvanced = useLab((s) => s.toggleAdvanced);
	const selected = config.charges.find((c) => c.id === selectedChargeId) ?? config.charges[0];
	const seqCount = config.charges.filter((c) => c.kind === "sequential").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Layout preset" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)]",
						value: presetId,
						onChange: (e) => loadPreset(e.target.value),
						children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.make().name
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted-foreground",
						children: PRESETS.find((p) => p.id === presetId)?.blurb
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Barrel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Travel length",
						value: mToInches(config.barrelLength),
						min: 6,
						max: 48,
						step: .5,
						suffix: "in",
						onChange: (v) => patchConfig({ barrelLength: inchesToM(v) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Projectile mass",
						value: kgToGrains(config.projectileMass),
						min: 20,
						max: 60,
						step: 1,
						suffix: "gr",
						onChange: (v) => patchConfig({ projectileMass: grainsToKg(v) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Wall thickness",
						value: config.wallThickness * 1e3,
						min: 2,
						max: 10,
						step: .25,
						suffix: "mm",
						onChange: (v) => patchConfig({ wallThickness: v / 1e3 })
					}),
					advanced ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Start pressure",
						value: paToPsi(config.startPressure),
						min: 200,
						max: 3e3,
						step: 50,
						suffix: "psi",
						onChange: (v) => patchConfig({ startPressure: psiToPa(v) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Heat transfer",
						value: config.heatTransfer / 1e4,
						min: 1,
						max: 20,
						step: .5,
						suffix: "×10⁴ W/m²K",
						onChange: (v) => patchConfig({ heatTransfer: v * 1e4 })
					})] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: "Charges"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: addCharge,
							disabled: seqCount >= 12,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add blank"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1",
						children: config.charges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => selectCharge(c.id),
							className: `flex h-11 items-center justify-between rounded-lg px-3 text-left text-sm transition-colors ${c.id === selectedChargeId ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] tabular-nums",
								children: [
									c.kind === "base" ? "chamber" : `${mToInches(c.position).toFixed(1)} in`,
									" · ",
									kgToGrains(c.mass).toFixed(2),
									" gr"
								]
							})]
						}, c.id))
					}),
					seqCount > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => distribute("v3"),
								children: "V-3 spacing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => distribute("even"),
								children: "Even"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => distribute("front"),
								children: "Front-load"
							})
						]
					}) : null
				]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: selected.label
						}), selected.kind === "sequential" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Remove charge",
							onClick: () => removeCharge(selected.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}) : null]
					}),
					selected.kind === "sequential" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "enabled",
							children: "Enabled"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							id: "enabled",
							checked: selected.enabled,
							onCheckedChange: (v) => patchCharge(selected.id, { enabled: v })
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Powder mass",
						value: kgToGrains(selected.mass),
						min: .3,
						max: 3.5,
						step: .05,
						suffix: "gr",
						onChange: (v) => patchCharge(selected.id, { mass: grainsToKg(v) })
					}),
					selected.kind === "sequential" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Port station",
							value: mToInches(selected.position),
							min: .4,
							max: Math.max(1, mToInches(config.barrelLength) - .5),
							step: .1,
							suffix: "in",
							onChange: (v) => patchCharge(selected.id, { position: inchesToM(v) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ignition offset",
							value: selected.triggerOffset * 1e3,
							min: -80,
							max: 40,
							step: 1,
							suffix: "mm",
							onChange: (v) => patchCharge(selected.id, { triggerOffset: v / 1e3 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: "Negative offset fires before the bullet base uncovers the port (blow-by risk). Zero is flash-at-port, the V-3 default."
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted-foreground",
						children: "Base charge is a .22 Long Rifle round in the chamber. Sequential stations are .22 blanks tapping the bore like the V-3 / Hochdruckpumpe."
					}),
					advanced ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Half-web",
							value: selected.propellant.web * 1e6,
							min: 8,
							max: 60,
							step: 1,
							suffix: "µm",
							onChange: (v) => patchCharge(selected.id, { propellant: {
								...selected.propellant,
								web: v * 1e-6
							} })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Vieille β",
							value: selected.propellant.burnBeta * 1e3,
							min: 1,
							max: 12,
							step: .2,
							suffix: "mm/s @ 1 MPa",
							onChange: (v) => patchCharge(selected.id, { propellant: {
								...selected.propellant,
								burnBeta: v / 1e3
							} })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "label",
								children: "Label"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "label",
								value: selected.label,
								onChange: (e) => patchCharge(selected.id, { label: e.target.value })
							})]
						})
					] }) : null
				]
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: toggleAdvanced,
				className: "text-left text-xs text-muted-foreground hover:text-foreground",
				children: advanced ? "Hide advanced powder and start parameters" : "Show advanced powder parameters"
			})
		]
	});
}
function fmtPsi(pa, digits = 0) {
	if (!Number.isFinite(pa)) return "—";
	const psi = paToPsi(pa);
	if (Math.abs(psi) >= 1e3) return `${(psi / 1e3).toFixed(1)} ksi`;
	return `${psi.toFixed(digits)} psi`;
}
function fmtMPa(pa, digits = 0) {
	if (!Number.isFinite(pa)) return "—";
	return `${(pa / 1e6).toFixed(digits)} MPa`;
}
function fmtJ(j, digits = 1) {
	if (!Number.isFinite(j)) return "—";
	return `${j.toFixed(digits)} J`;
}
function fmtFtLb(j, digits = 0) {
	if (!Number.isFinite(j)) return "—";
	return `${jToFtLb(j).toFixed(digits)} ft·lb`;
}
function fmtInches(m, digits = 2) {
	return `${mToInches(m).toFixed(digits)} in`;
}
function fmtUs(s) {
	if (!Number.isFinite(s)) return "—";
	if (s < .001) return `${(s * 1e6).toFixed(0)} µs`;
	if (s < 1) return `${(s * 1e3).toFixed(2)} ms`;
	return `${s.toFixed(2)} s`;
}
function fmtPct(x, digits = 0) {
	if (!Number.isFinite(x)) return "—";
	return `${(x * 100).toFixed(digits)}%`;
}
function dualVel(ms) {
	if (!Number.isFinite(ms)) return "—";
	return `${msToFps(ms).toFixed(0)} fps  ·  ${ms.toFixed(0)} m/s`;
}
function dualP(pa) {
	if (!Number.isFinite(pa)) return "—";
	return `${fmtPsi(pa)}  ·  ${fmtMPa(pa, 0)}`;
}
function dualE(j) {
	if (!Number.isFinite(j)) return "—";
	return `${fmtFtLb(j)}  ·  ${fmtJ(j, 0)}`;
}
var PARTS = [
	{
		key: "projectile",
		label: "Projectile KE",
		color: "bg-chart-velocity"
	},
	{
		key: "gasKinetic",
		label: "Gas KE",
		color: "bg-chart-energy/80"
	},
	{
		key: "thermal",
		label: "Gas thermal",
		color: "bg-primary/40"
	},
	{
		key: "heat",
		label: "Barrel heat",
		color: "bg-chart-heat"
	},
	{
		key: "friction",
		label: "Friction",
		color: "bg-border"
	},
	{
		key: "blowby",
		label: "Blow-by",
		color: "bg-destructive"
	},
	{
		key: "unburned",
		label: "Unburned",
		color: "bg-muted-foreground/40"
	}
];
function EnergyBar() {
	const e = useLab((s) => s.result).summary.energy;
	const total = e.chemical || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pb-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
					children: "Energy partition"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[10px] tabular-nums text-muted-foreground",
					children: [fmtJ(e.chemical, 0), " chemical"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-2 overflow-hidden rounded-full bg-secondary",
				children: PARTS.map((p) => {
					const v = e[p.key];
					if (v < .5) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: p.color,
						style: { width: `${Math.max(.4, v / total * 100)}%` },
						title: `${p.label} ${fmtJ(v, 1)}`
					}, p.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-x-3 gap-y-1",
				children: PARTS.map((p) => {
					const v = e[p.key];
					if (v < .5) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 font-mono text-[10px] tabular-nums text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${p.color}` }),
							p.label,
							" ",
							fmtPct(v / total, 0)
						]
					}, p.key);
				})
			})
		]
	});
}
function EventLog() {
	const events = useLab((s) => s.result?.events ?? []);
	if (events.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
			children: "Timeline"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-1",
			children: events.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-baseline gap-3 font-mono text-[11px] tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-16 text-muted-foreground",
						children: fmtUs(e.t)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-14 text-muted-foreground",
						children: fmtInches(e.x, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: e.note
					})
				]
			}, `${e.kind}-${e.t}-${i}`))
		})]
	});
}
function cssVar(name, fallback) {
	if (typeof window === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function pressureColor(psi, alpha = 1) {
	const t = Math.max(0, Math.min(1, psi / 28e3));
	return `rgba(${Math.round(80 + 160 * t)},${Math.round(140 - 90 * t)},${Math.round(170 - 100 * t)},${alpha})`;
}
function barrelLayout(config, w, h) {
	const padL = 56;
	const padR = 36;
	const y = h * .52;
	const usable = Math.max(40, w - padL - padR);
	const x0 = padL;
	const x1 = padL + usable;
	const px = (m) => x0 + m / config.barrelLength * usable;
	return {
		padL,
		padR,
		y,
		x0,
		x1,
		px,
		boreR: Math.max(5, Math.min(11, h * .035)),
		usable
	};
}
function draw(ctx, w, h, config, sample, selectedId, result) {
	ctx.clearRect(0, 0, w, h);
	const fg = cssVar("--color-foreground", "#ecece8");
	const muted = cssVar("--color-muted-foreground", "#8b8e94");
	const { y, x0, x1, px, boreR } = barrelLayout(config, w, h);
	const wall = boreR + 7;
	const x = sample?.x ?? 0;
	const steel = "#1a1e24";
	const steelHi = "#2c323b";
	ctx.save();
	ctx.font = "500 10px 'IBM Plex Mono', monospace";
	ctx.fillStyle = muted;
	ctx.fillText("BREECH", x0 - 2, 16);
	ctx.textAlign = "right";
	ctx.fillText("MUZZLE", x1 + 2, 16);
	ctx.textAlign = "left";
	ctx.fillText(`${mToInches(config.barrelLength).toFixed(1)} in travel`, x0, h - 10);
	for (const c of config.charges) {
		if (c.kind !== "sequential") continue;
		drawChamber(ctx, config, c, sample, selectedId, y, px, boreR, wall);
	}
	const body = new Path2D();
	body.moveTo(x0 - 18, y - wall - 2);
	body.lineTo(x0 - 4, y - wall - 2);
	body.lineTo(x0, y - wall);
	body.lineTo(x1, y - wall);
	body.lineTo(x1 + 10, y - wall + 2);
	body.lineTo(x1 + 10, y + wall - 2);
	body.lineTo(x1, y + wall);
	body.lineTo(x0, y + wall);
	body.lineTo(x0 - 4, y + wall + 2);
	body.lineTo(x0 - 18, y + wall + 2);
	body.closePath();
	ctx.fillStyle = steel;
	ctx.fill(body);
	ctx.strokeStyle = steelHi;
	ctx.lineWidth = 1;
	ctx.stroke(body);
	ctx.fillStyle = "#0a0b0d";
	ctx.fillRect(x0 - 12, y - boreR, x1 - x0 + 18, boreR * 2);
	ctx.fillStyle = "#0a0b0d";
	ctx.beginPath();
	ctx.roundRect(x0 - 28, y - boreR - 1, 20, boreR * 2 + 2, 2);
	ctx.fill();
	const xProj = px(Math.min(x, config.barrelLength));
	if (sample) {
		const grad = ctx.createLinearGradient(x0 - 20, y, xProj, y);
		grad.addColorStop(0, pressureColor(paToPsi(sample.pBreech), .85));
		grad.addColorStop(1, pressureColor(paToPsi(sample.pBase), .55));
		ctx.fillStyle = grad;
		ctx.fillRect(x0 - 20, y - boreR + 1, Math.max(1, xProj - (x0 - 20)), boreR * 2 - 2);
		ctx.globalAlpha = .25;
		for (let i = 0; i < 6; i++) {
			const gx = x0 + (xProj - x0) * i / 6;
			ctx.fillStyle = "#fff";
			ctx.fillRect(gx, y - boreR + 1, 1, boreR * 2 - 2);
		}
		ctx.globalAlpha = 1;
	}
	ctx.strokeStyle = "rgba(255,255,255,0.04)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(x0, y - 2);
	ctx.lineTo(x1, y - 2);
	ctx.moveTo(x0, y + 2);
	ctx.lineTo(x1, y + 2);
	ctx.stroke();
	drawBullet(ctx, xProj, y, boreR, config.projectileLength, px);
	ctx.font = "500 9px 'IBM Plex Mono', monospace";
	for (const c of config.charges) {
		if (c.kind !== "sequential" || !c.enabled) continue;
		const cx = px(c.position);
		ctx.fillStyle = c.id === selectedId ? fg : muted;
		ctx.textAlign = "center";
		ctx.fillText(`${mToInches(c.position).toFixed(1)}"`, cx, y + wall + 16);
	}
	ctx.textAlign = "left";
	if (result && result.summary.peakPressureTravel > 0) {
		const xm = px(result.summary.peakPressureTravel);
		ctx.strokeStyle = cssVar("--color-chart-pressure", "#c45c4a");
		ctx.setLineDash([2, 3]);
		ctx.beginPath();
		ctx.moveTo(xm, y - wall - 8);
		ctx.lineTo(xm, y + wall + 8);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.fillStyle = cssVar("--color-chart-pressure", "#c45c4a");
		ctx.font = "500 9px 'IBM Plex Mono', monospace";
		ctx.fillText("Pmax", xm + 4, y - wall - 10);
	}
	ctx.restore();
}
function drawChamber(ctx, config, c, sample, selectedId, y, px, boreR, wall) {
	const cx = px(c.position);
	const dir = c.side;
	const ang = c.angle * Math.PI / 180;
	const len = 46;
	const x2 = cx - Math.cos(ang) * len;
	const y2 = y + dir * (wall + Math.sin(ang) * len);
	const idx = config.charges.findIndex((q) => q.id === c.id);
	const cs = sample?.charges[idx];
	const burning = Boolean(cs?.ignited && (cs.z ?? 0) < .999 && c.enabled);
	const done = Boolean(cs && cs.z >= .999);
	const selected = c.id === selectedId;
	ctx.save();
	ctx.lineWidth = selected ? 2 : 1.25;
	ctx.strokeStyle = selected ? cssVar("--color-foreground", "#ecece8") : "#3a404a";
	ctx.beginPath();
	ctx.moveTo(cx, y + dir * (boreR + 1));
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.translate(x2, y2);
	ctx.rotate(Math.atan2(y2 - y, x2 - cx) + Math.PI);
	ctx.fillStyle = burning ? pressureColor(paToPsi(cs?.pSide ?? 1e5), .9) : done ? "#2a4a40" : "#2a241c";
	ctx.fillRect(-4, -6, 22, 12);
	ctx.strokeStyle = selected ? "#ecece8" : "#5a5044";
	ctx.strokeRect(-4, -6, 22, 12);
	ctx.fillStyle = "#c9c2b2";
	ctx.fillRect(16, -6, 3, 12);
	if (burning) {
		ctx.fillStyle = "rgba(255,220,180,0.7)";
		ctx.beginPath();
		ctx.arc(-6, 0, 5, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
	if (!c.enabled) {
		ctx.save();
		ctx.strokeStyle = "#c45c4a";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x2 - 6, y2 - 6);
		ctx.lineTo(x2 + 6, y2 + 6);
		ctx.stroke();
		ctx.restore();
	}
}
function drawBullet(ctx, xProj, y, boreR, bulletLen, px) {
	const len = Math.max(10, px(bulletLen) - px(0));
	ctx.save();
	ctx.translate(xProj, y);
	ctx.fillStyle = "#b8a07a";
	ctx.beginPath();
	ctx.moveTo(0, -boreR + 1);
	ctx.lineTo(len * .55, -boreR + 1);
	ctx.lineTo(len, -boreR * .35);
	ctx.lineTo(len, boreR * .35);
	ctx.lineTo(len * .55, boreR - 1);
	ctx.lineTo(0, boreR - 1);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#8a7352";
	ctx.fillRect(-3, -boreR + 1, 3, boreR * 2 - 2);
	ctx.restore();
}
function GunView() {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const config = useLab((s) => s.config);
	const result = useLab((s) => s.result);
	const playhead = useLab((s) => s.playhead);
	const selectedChargeId = useLab((s) => s.selectedChargeId);
	const selectCharge = useLab((s) => s.selectCharge);
	const sizeRef = (0, import_react.useRef)({
		w: 0,
		h: 0,
		dpr: 1
	});
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		let raf = 0;
		const paint = () => {
			const rect = wrap.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = Math.max(1, Math.floor(rect.width));
			const h = Math.max(1, Math.floor(rect.height));
			const prev = sizeRef.current;
			if (prev.w !== w || prev.h !== h || prev.dpr !== dpr) {
				sizeRef.current = {
					w,
					h,
					dpr
				};
				canvas.width = Math.floor(w * dpr);
				canvas.height = Math.floor(h * dpr);
				canvas.style.width = `${w}px`;
				canvas.style.height = `${h}px`;
			}
			const ctx = canvas.getContext("2d");
			if (!ctx || w < 8 || h < 8) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const sample = result && result.samples.length ? interpolateSample(result.samples, playhead) : null;
			draw(ctx, w, h, config, sample, selectedChargeId, result);
		};
		paint();
		raf = requestAnimationFrame(paint);
		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(paint);
		});
		ro.observe(wrap);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	}, [
		config,
		result,
		playhead,
		selectedChargeId
	]);
	function onClick(e) {
		const wrap = wrapRef.current;
		if (!wrap) return;
		const rect = wrap.getBoundingClientRect();
		const { px } = barrelLayout(config, rect.width, rect.height);
		const clickX = e.clientX - rect.left;
		let best = null;
		let bestD = 28;
		for (const c of config.charges) {
			const cx = px(c.position);
			const d = Math.abs(cx - clickX);
			if (d < bestD) {
				bestD = d;
				best = c;
			}
		}
		if (best) selectCharge(best.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "relative h-[220px] w-full md:h-[260px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "size-full cursor-pointer",
			onClick,
			role: "img",
			"aria-label": "Cutaway of the sequential-charge barrel"
		})
	});
}
function Playback() {
	const result = useLab((s) => s.result);
	const playhead = useLab((s) => s.playhead);
	const playing = useLab((s) => s.playing);
	const speed = useLab((s) => s.speed);
	const setPlayhead = useLab((s) => s.setPlayhead);
	const setPlaying = useLab((s) => s.setPlaying);
	const setSpeed = useLab((s) => s.setSpeed);
	const tMax = result?.samples.at(-1)?.t ?? .002;
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const next = useLab.getState().playhead + dt / speed;
			if (next >= tMax) {
				setPlayhead(tMax);
				setPlaying(false);
				return;
			}
			setPlayhead(next);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [
		playing,
		speed,
		tMax,
		setPlayhead,
		setPlaying
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.code === "Space") {
				e.preventDefault();
				const s = useLab.getState();
				if (s.playhead >= tMax - 1e-6) s.setPlayhead(0);
				s.setPlaying(!s.playing);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [tMax]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 px-4 pb-3 md:flex-row md:items-center md:gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "secondary",
						"aria-label": playing ? "Pause" : "Play",
						onClick: () => {
							if (playhead >= tMax - 1e-6) setPlayhead(0);
							setPlaying(!playing);
						},
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						"aria-label": "Reset playhead",
						onClick: () => {
							setPlaying(false);
							setPlayhead(0);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 min-w-[7.5rem] font-mono text-xs tabular-nums text-muted-foreground",
						children: [
							fmtUs(playhead),
							" / ",
							fmtUs(tMax)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				className: "flex-1",
				min: 0,
				max: tMax,
				step: tMax / 400,
				value: [playhead],
				onValueChange: ([v]) => {
					setPlaying(false);
					setPlayhead(v ?? 0);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden md:inline",
					children: "Slow-mo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md bg-secondary px-2 font-mono text-xs text-foreground shadow-[var(--shadow-border)]",
					value: speed,
					onChange: (e) => setSpeed(Number(e.target.value)),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 200,
							children: "200×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 500,
							children: "500×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 1e3,
							children: "1000×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 2e3,
							children: "2000×"
						})
					]
				})]
			})
		]
	});
}
function Cell({ label, value, hint, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 rounded-xl bg-secondary/60 px-3 py-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-1 truncate font-mono text-sm tabular-nums ${warn ? "text-destructive" : "text-foreground"}`,
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 truncate font-mono text-[10px] text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
function Readout() {
	const result = useLab((s) => s.result);
	const baseline = useLab((s) => s.baseline);
	const s = result.summary;
	const b = baseline.summary;
	const dv = b && Number.isFinite(s.muzzleVelocity) ? msToFps(s.muzzleVelocity) - msToFps(b.muzzleVelocity) : 0;
	const over = s.saamiRatio > 1.02;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-2 px-4 md:grid-cols-3 lg:grid-cols-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				label: "Muzzle velocity",
				value: dualVel(s.muzzleVelocity),
				hint: dv !== 0 ? `${dv >= 0 ? "+" : ""}${dv.toFixed(0)} fps vs base-only` : "Single-charge reference"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				label: "Muzzle energy",
				value: dualE(s.muzzleEnergy),
				hint: `η ${fmtPct(s.efficiency, 0)} of chemical`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				label: "Peak pressure",
				value: dualP(s.peakPressure),
				hint: `${fmtPct(s.saamiRatio, 0)} of .22 LR SAAMI MAP`,
				warn: over
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				label: "Time to muzzle",
				value: fmtUs(s.timeToMuzzle),
				hint: `Pmax at ${fmtUs(s.peakPressureTime)}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				label: "Unburned",
				value: fmtPct(s.unburnedFraction, 1),
				hint: s.burnComplete ? "All powder consumed" : "Vieille slowed at low P",
				warn: s.unburnedFraction > .08
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				label: "Hoop stress",
				value: `${(s.hoopStress / 1e6).toFixed(0)} MPa`,
				hint: "Thin-wall σ = P d / 2t",
				warn: s.hoopStress > 35e7
			})
		]
	});
}
function TheoryPanel() {
	const open = useLab((s) => s.theoryOpen);
	const setTheoryOpen = useLab((s) => s.setTheoryOpen);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-background/70 p-3 md:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium tracking-tight",
					children: "What this model is doing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Lumped-parameter interior ballistics. Teaching-grade, not a load-development tool."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					onClick: () => setTheoryOpen(false),
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 text-sm leading-relaxed text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The historical V-3 (Hochdruckpumpe) was a long multi-chamber gun: a base charge started the projectile, then side charges fired as it passed each port, topping up the gas so pressure did not collapse as the bore volume grew. This lab is that idea scaled to a .22 Long Rifle bullet with .22 blanks as the sequential charges." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-foreground",
						children: [
							"Noble–Abel  P (V − α m − V_solid) = (γ − 1) E",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Vieille    r = β (P / 1 MPa)^n  dz = r dt / web",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Resal     E_chem = E_therm + KE_proj + KE_gas + Q + W_fric + E_blowby",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Lagrange   m_eff = m + m_g / 3  m_eff a = (P − P_res − P_atm) A"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Powder is fast single-base flake with impetus, covolume, and γ in the published NC small-arms range. β and web are calibrated so a 40 gr / 1.10 gr load in an 18.5 in barrel lands near 1,080 fps and 24 ksi — a standard-velocity .22 LR point. SAAMI MAP for .22 LR is 24,000 psi; that line is a warning, not a design limit for a purpose-built tube." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A sequential charge ignites when the bullet base reaches the port plus your offset. If the port is still ahead of the bullet, the side chamber is a closed bomb and gas chokes out as precursor blow-by. If the port is behind the bullet, the chamber volume joins the bore and the new gas does work. Late stations see a large free volume, Vieille slows, and powder can leave the muzzle unburned — the usual failure mode of a too-long multi-charge gun with fast pistol powder." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Space-mean pressure is what the equation of state returns. A Lagrange gradient splits breech and base pressure for the cutaway; for .22 LR the powder mass is small so that split is only a few percent, and it grows as you stack blanks." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This is not a blueprint. There is no ignition hardware, no chamber drawing, no construction sequence. Treat the numbers as a physics sketch: they are dimensionally consistent and calibrated at one well-known cartridge, then extrapolated to the sequential-charge idea." })
				]
			})]
		})
	});
}
function Warnings() {
	const warnings = useLab((s) => s.result?.warnings ?? []);
	if (warnings.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2 px-4 pb-3",
		children: warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `rounded-xl px-3 py-2.5 text-sm ${w.level === "danger" ? "bg-destructive/10 text-foreground" : w.level === "warn" ? "bg-chart-heat/10 text-foreground" : "bg-secondary text-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs font-medium",
				children: [w.level === "info" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: `size-3.5 ${w.level === "danger" ? "text-destructive" : "text-chart-heat"}` }), w.title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-muted-foreground",
				children: w.body
			})]
		}, w.id))
	});
}
function Sheet({ open, onOpenChange, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("fixed inset-x-0 bottom-0 z-50 flex max-h-[86vh] flex-col rounded-t-2xl bg-card p-4 shadow-[var(--shadow-border)]", "md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[380px] md:max-h-none md:rounded-none md:rounded-l-2xl", "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children
			})]
		})] })
	});
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration: 250,
		children
	});
}
function LabApp() {
	const hydrate = useLab((s) => s.hydrate);
	const setTheoryOpen = useLab((s) => s.setTheoryOpen);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3 max-lg:pr-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground",
						children: "Interior ballistics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-lg font-medium tracking-tight",
						children: "Cascade Bore"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setTheoryOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Model"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "secondary",
						className: "lg:hidden",
						onClick: () => setSheet(true),
						"aria-label": "Edit charges",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-[340px] shrink-0 overflow-y-auto border-r border-border p-4 lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsPanel, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GunView, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Playback, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnergyBar, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warnings, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartsPanel, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventLog, {})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TheoryPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: sheet,
				onOpenChange: setSheet,
				title: "Gun and charges",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsPanel, {})
			})
		]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabApp, {});
}
//#endregion
export { Home as component };
