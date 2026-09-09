import { dualE, dualP, dualVel, fmtPct, fmtUs } from "@/lib/ballistics/format.ts";
import { msToFps } from "@/lib/ballistics/units.ts";
import { useLab } from "@/store/lab";

function Cell({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: string;
  hint?: string;
  warn?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-secondary/60 px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 truncate font-mono text-sm tabular-nums ${warn ? "text-destructive" : "text-foreground"}`}
      >
        {value}
      </div>
      {hint ? (
        <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  );
}

export function Readout() {
  const result = useLab((s) => s.result);
  const baseline = useLab((s) => s.baseline);
  const s = result.summary;
  const b = baseline.summary;
  const dv =
    b && Number.isFinite(s.muzzleVelocity)
      ? msToFps(s.muzzleVelocity) - msToFps(b.muzzleVelocity)
      : 0;
  const over = s.saamiRatio > 1.02;

  return (
    <div className="grid grid-cols-2 gap-2 px-4 md:grid-cols-3 lg:grid-cols-6">
      <Cell
        label="Muzzle velocity"
        value={dualVel(s.muzzleVelocity)}
        hint={dv !== 0 ? `${dv >= 0 ? "+" : ""}${dv.toFixed(0)} fps vs base-only` : "Single-charge reference"}
      />
      <Cell
        label="Muzzle energy"
        value={dualE(s.muzzleEnergy)}
        hint={`η ${fmtPct(s.efficiency, 0)} of chemical`}
      />
      <Cell
        label="Peak pressure"
        value={dualP(s.peakPressure)}
        hint={`${fmtPct(s.saamiRatio, 0)} of .22 LR SAAMI MAP`}
        warn={over}
      />
      <Cell
        label="Time to muzzle"
        value={fmtUs(s.timeToMuzzle)}
        hint={`Pmax at ${fmtUs(s.peakPressureTime)}`}
      />
      <Cell
        label="Unburned"
        value={fmtPct(s.unburnedFraction, 1)}
        hint={s.burnComplete ? "All powder consumed" : "Vieille slowed at low P"}
        warn={s.unburnedFraction > 0.08}
      />
      <Cell
        label="Hoop stress"
        value={`${(s.hoopStress / 1e6).toFixed(0)} MPa`}
        hint="Thin-wall σ = P d / 2t"
        warn={s.hoopStress > 350e6}
      />
    </div>
  );
}
