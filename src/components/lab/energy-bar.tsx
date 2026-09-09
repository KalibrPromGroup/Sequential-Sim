import { fmtJ, fmtPct } from "@/lib/ballistics/format.ts";
import { useLab } from "@/store/lab";

const PARTS = [
  { key: "projectile", label: "Projectile KE", color: "bg-chart-velocity" },
  { key: "gasKinetic", label: "Gas KE", color: "bg-chart-energy/80" },
  { key: "thermal", label: "Gas thermal", color: "bg-primary/40" },
  { key: "heat", label: "Barrel heat", color: "bg-chart-heat" },
  { key: "friction", label: "Friction", color: "bg-border" },
  { key: "blowby", label: "Blow-by", color: "bg-destructive" },
  { key: "unburned", label: "Unburned", color: "bg-muted-foreground/40" },
] as const;

export function EnergyBar() {
  const result = useLab((s) => s.result);
  const e = result.summary.energy;
  const total = e.chemical || 1;

  return (
    <div className="px-4 pb-3">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Energy partition
        </div>
        <div className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {fmtJ(e.chemical, 0)} chemical
        </div>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
        {PARTS.map((p) => {
          const v = e[p.key];
          if (v < 0.5) return null;
          return (
            <div
              key={p.key}
              className={p.color}
              style={{ width: `${Math.max(0.4, (v / total) * 100)}%` }}
              title={`${p.label} ${fmtJ(v, 1)}`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {PARTS.map((p) => {
          const v = e[p.key];
          if (v < 0.5) return null;
          return (
            <div key={p.key} className="flex items-center gap-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">
              <span className={`size-1.5 rounded-full ${p.color}`} />
              {p.label} {fmtPct(v / total, 0)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
