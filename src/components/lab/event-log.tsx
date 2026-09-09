import { fmtInches, fmtUs } from "@/lib/ballistics/format.ts";
import { useLab } from "@/store/lab";

export function EventLog() {
  const events = useLab((s) => s.result?.events ?? []);
  if (events.length === 0) return null;
  return (
    <div className="px-4 pb-4">
      <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Timeline
      </div>
      <ol className="flex flex-col gap-1">
        {events.map((e, i) => (
          <li
            key={`${e.kind}-${e.t}-${i}`}
            className="flex items-baseline gap-3 font-mono text-[11px] tabular-nums"
          >
            <span className="w-16 text-muted-foreground">{fmtUs(e.t)}</span>
            <span className="w-14 text-muted-foreground">{fmtInches(e.x, 1)}</span>
            <span className="text-foreground">{e.note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
