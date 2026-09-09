import type { PropellantSpec } from "./types.ts";

/**
 * Fast single-base nitrocellulose flake, representative of factory .22 LR
 * powder and .22 blanks. Impetus / covolume / gamma sit in the published
 * range for NC small-arms propellants (Corner; STANAG 4367-class values).
 *
 * Vieille β and web are calibrated so a 40 gr / 1.10 gr load in an 18.5"
 * barrel produces ~1080 fps at ~21 ksi — a CCI-standard-velocity-class
 * interior-ballistics point. Sequential blanks reuse the same powder.
 */
export const RIMFIRE_FLAKE: PropellantSpec = {
  name: "Rimfire flake (fast NC)",
  impetus: 1.08e6,
  gamma: 1.23,
  covolume: 1.0e-3,
  density: 1600,
  flameTemp: 2820,
  burnExp: 0.8,
  burnBeta: 0.0056,
  web: 2.3e-5,
};

export function clonePropellant(p: PropellantSpec): PropellantSpec {
  return { ...p };
}

/** Chemical energy released by burning mass m of this powder, J. */
export function chemicalEnergy(p: PropellantSpec, mass: number): number {
  return (mass * p.impetus) / (p.gamma - 1);
}

/** Specific gas constant R = f / T_expl, J/(kg K). */
export function specificGasConstant(p: PropellantSpec): number {
  return p.impetus / p.flameTemp;
}
