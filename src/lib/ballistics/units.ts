/** Unit conversions. The integrator is SI throughout. */

export const GRAIN = 6.479891e-5; // kg
export const INCH = 0.0254; // m
export const FPS = 0.3048; // m/s
export const PSI = 6894.757293168; // Pa
export const FTLB = 1.3558179483314; // J
export const GRAIN_H2O_CM3 = 0.06479891; // cm³ per grain of water

export function grainsToKg(gr: number): number {
  return gr * GRAIN;
}

export function kgToGrains(kg: number): number {
  return kg / GRAIN;
}

export function inchesToM(inches: number): number {
  return inches * INCH;
}

export function mToInches(m: number): number {
  return m / INCH;
}

export function fpsToMs(fps: number): number {
  return fps * FPS;
}

export function msToFps(ms: number): number {
  return ms / FPS;
}

export function psiToPa(psi: number): number {
  return psi * PSI;
}

export function paToPsi(pa: number): number {
  return pa / PSI;
}

export function jToFtLb(j: number): number {
  return j / FTLB;
}

export function cm3ToM3(cm3: number): number {
  return cm3 * 1e-6;
}

export function m3ToCm3(m3: number): number {
  return m3 * 1e6;
}

export const SAAMI_22LR_MAP_PSI = 24_000;
export const SAAMI_22LR_MAP_PA = psiToPa(SAAMI_22LR_MAP_PSI);

/** Typical 4130 barrel steel yield (normalized), Pa. */
export const STEEL_YIELD_PA = 415e6;
