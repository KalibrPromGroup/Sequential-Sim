import {
  jToFtLb,
  kgToGrains,
  m3ToCm3,
  mToInches,
  msToFps,
  paToPsi,
} from "./units.ts";

export function fmtFps(ms: number, digits = 0): string {
  if (!Number.isFinite(ms)) return "—";
  return `${msToFps(ms).toFixed(digits)} fps`;
}

export function fmtMs(ms: number, digits = 0): string {
  if (!Number.isFinite(ms)) return "—";
  return `${ms.toFixed(digits)} m/s`;
}

export function fmtPsi(pa: number, digits = 0): string {
  if (!Number.isFinite(pa)) return "—";
  const psi = paToPsi(pa);
  if (Math.abs(psi) >= 1000) return `${(psi / 1000).toFixed(1)} ksi`;
  return `${psi.toFixed(digits)} psi`;
}

export function fmtMPa(pa: number, digits = 0): string {
  if (!Number.isFinite(pa)) return "—";
  return `${(pa / 1e6).toFixed(digits)} MPa`;
}

export function fmtJ(j: number, digits = 1): string {
  if (!Number.isFinite(j)) return "—";
  return `${j.toFixed(digits)} J`;
}

export function fmtFtLb(j: number, digits = 0): string {
  if (!Number.isFinite(j)) return "—";
  return `${jToFtLb(j).toFixed(digits)} ft·lb`;
}

export function fmtGrains(kg: number, digits = 2): string {
  return `${kgToGrains(kg).toFixed(digits)} gr`;
}

export function fmtInches(m: number, digits = 2): string {
  return `${mToInches(m).toFixed(digits)} in`;
}

export function fmtMm(m: number, digits = 1): string {
  return `${(m * 1000).toFixed(digits)} mm`;
}

export function fmtCm3(m3: number, digits = 2): string {
  return `${m3ToCm3(m3).toFixed(digits)} cm³`;
}

export function fmtUs(s: number): string {
  if (!Number.isFinite(s)) return "—";
  if (s < 1e-3) return `${(s * 1e6).toFixed(0)} µs`;
  if (s < 1) return `${(s * 1e3).toFixed(2)} ms`;
  return `${s.toFixed(2)} s`;
}

export function fmtPct(x: number, digits = 0): string {
  if (!Number.isFinite(x)) return "—";
  return `${(x * 100).toFixed(digits)}%`;
}

export function dualVel(ms: number): string {
  if (!Number.isFinite(ms)) return "—";
  return `${msToFps(ms).toFixed(0)} fps  ·  ${ms.toFixed(0)} m/s`;
}

export function dualP(pa: number): string {
  if (!Number.isFinite(pa)) return "—";
  return `${fmtPsi(pa)}  ·  ${fmtMPa(pa, 0)}`;
}

export function dualE(j: number): string {
  if (!Number.isFinite(j)) return "—";
  return `${fmtFtLb(j)}  ·  ${fmtJ(j, 0)}`;
}
