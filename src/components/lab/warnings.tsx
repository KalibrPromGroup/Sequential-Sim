import { AlertTriangle, Info } from "lucide-react";
import { useLab } from "@/store/lab";

export function Warnings() {
  const warnings = useLab((s) => s.result?.warnings ?? []);
  if (warnings.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 px-4 pb-3">
      {warnings.map((w) => (
        <div
          key={w.id}
          className={`rounded-xl px-3 py-2.5 text-sm ${
            w.level === "danger"
              ? "bg-destructive/10 text-foreground"
              : w.level === "warn"
                ? "bg-chart-heat/10 text-foreground"
                : "bg-secondary text-foreground"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            {w.level === "info" ? (
              <Info className="size-3.5 text-muted-foreground" />
            ) : (
              <AlertTriangle
                className={`size-3.5 ${w.level === "danger" ? "text-destructive" : "text-chart-heat"}`}
              />
            )}
            {w.title}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.body}</p>
        </div>
      ))}
    </div>
  );
}
