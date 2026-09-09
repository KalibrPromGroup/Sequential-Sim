import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "warn" | "danger" | "ok" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        tone === "default" && "bg-secondary text-muted-foreground",
        tone === "warn" && "bg-chart-heat/15 text-chart-heat",
        tone === "danger" && "bg-destructive/15 text-destructive",
        tone === "ok" && "bg-chart-velocity/15 text-chart-velocity",
        className,
      )}
      {...props}
    />
  );
}
