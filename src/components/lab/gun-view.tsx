import { useEffect, useRef, type MouseEvent } from "react";
import { interpolateSample } from "@/lib/ballistics/engine.ts";
import { mToInches, paToPsi } from "@/lib/ballistics/units.ts";
import type { Charge, GunConfig, Sample, SimResult } from "@/lib/ballistics/types.ts";
import { useLab } from "@/store/lab";

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function pressureColor(psi: number, alpha = 1): string {
  const t = Math.max(0, Math.min(1, psi / 28000));
  const r = Math.round(80 + 160 * t);
  const g = Math.round(140 - 90 * t);
  const b = Math.round(170 - 100 * t);
  return `rgba(${r},${g},${b},${alpha})`;
}

function barrelLayout(config: GunConfig, w: number, h: number) {
  const padL = 56;
  const padR = 36;
  const y = h * 0.52;
  const usable = Math.max(40, w - padL - padR);
  const x0 = padL;
  const x1 = padL + usable;
  const px = (m: number) => x0 + (m / config.barrelLength) * usable;
  const boreR = Math.max(5, Math.min(11, h * 0.035));
  return { padL, padR, y, x0, x1, px, boreR, usable };
}

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: GunConfig,
  sample: Sample | null,
  selectedId: string,
  result: SimResult | null,
) {
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
    grad.addColorStop(0, pressureColor(paToPsi(sample.pBreech), 0.85));
    grad.addColorStop(1, pressureColor(paToPsi(sample.pBase), 0.55));
    ctx.fillStyle = grad;
    ctx.fillRect(x0 - 20, y - boreR + 1, Math.max(1, xProj - (x0 - 20)), boreR * 2 - 2);
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 6; i++) {
      const gx = x0 + ((xProj - x0) * i) / 6;
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

function drawChamber(
  ctx: CanvasRenderingContext2D,
  config: GunConfig,
  c: Charge,
  sample: Sample | null,
  selectedId: string,
  y: number,
  px: (m: number) => number,
  boreR: number,
  wall: number,
) {
  const cx = px(c.position);
  const dir = c.side;
  const ang = (c.angle * Math.PI) / 180;
  const len = 46;
  const x2 = cx - Math.cos(ang) * len;
  const y2 = y + dir * (wall + Math.sin(ang) * len);
  const idx = config.charges.findIndex((q) => q.id === c.id);
  const cs = sample?.charges[idx];
  const burning = Boolean(cs?.ignited && (cs.z ?? 0) < 0.999 && c.enabled);
  const done = Boolean(cs && cs.z >= 0.999);
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
  const glow = burning ? pressureColor(paToPsi(cs?.pSide ?? 1e5), 0.9) : done ? "#2a4a40" : "#2a241c";
  ctx.fillStyle = glow;
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

function drawBullet(
  ctx: CanvasRenderingContext2D,
  xProj: number,
  y: number,
  boreR: number,
  bulletLen: number,
  px: (m: number) => number,
) {
  const len = Math.max(10, px(bulletLen) - px(0));
  ctx.save();
  ctx.translate(xProj, y);
  ctx.fillStyle = "#b8a07a";
  ctx.beginPath();
  ctx.moveTo(0, -boreR + 1);
  ctx.lineTo(len * 0.55, -boreR + 1);
  ctx.lineTo(len, -boreR * 0.35);
  ctx.lineTo(len, boreR * 0.35);
  ctx.lineTo(len * 0.55, boreR - 1);
  ctx.lineTo(0, boreR - 1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#8a7352";
  ctx.fillRect(-3, -boreR + 1, 3, boreR * 2 - 2);
  ctx.restore();
}

export function GunView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const config = useLab((s) => s.config);
  const result = useLab((s) => s.result);
  const playhead = useLab((s) => s.playhead);
  const selectedChargeId = useLab((s) => s.selectedChargeId);
  const selectCharge = useLab((s) => s.selectCharge);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
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
        sizeRef.current = { w, h, dpr };
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx || w < 8 || h < 8) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sample =
        result && result.samples.length
          ? interpolateSample(result.samples, playhead)
          : null;
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
  }, [config, result, playhead, selectedChargeId]);

  function onClick(e: MouseEvent<HTMLCanvasElement>) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const { px } = barrelLayout(config, rect.width, rect.height);
    const clickX = e.clientX - rect.left;
    let best: Charge | null = null;
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

  return (
    <div ref={wrapRef} className="relative h-[220px] w-full md:h-[260px]">
      <canvas
        ref={canvasRef}
        className="size-full cursor-pointer"
        onClick={onClick}
        role="img"
        aria-label="Cutaway of the sequential-charge barrel"
      />
    </div>
  );
}
