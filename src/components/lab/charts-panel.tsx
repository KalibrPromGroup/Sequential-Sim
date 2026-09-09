import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mToInches, msToFps, paToPsi } from "@/lib/ballistics/units.ts";
import { useLab } from "@/store/lab";

type Row = {
  xIn: number;
  tMs: number;
  pKsi: number;
  pBaseKsi: number;
  vFps: number;
  vBaseFps: number;
  proj: number;
  therm: number;
  heat: number;
  chem: number;
};

function ChartTip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string | number;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-popover px-2.5 py-1.5 text-xs shadow-[var(--shadow-border)]">
      <div className="mb-1 font-mono text-muted-foreground">
        {label} {unit}
      </div>
      {payload.map((p) => (
        <div key={p.name} className="font-mono tabular-nums" style={{ color: p.color }}>
          {p.name} {Number(p.value).toFixed(1)}
        </div>
      ))}
    </div>
  );
}

export function ChartsPanel() {
  const result = useLab((s) => s.result);
  const baseline = useLab((s) => s.baseline);

  const data = useMemo(() => {
    const n = result.samples.length;
    const step = Math.max(1, Math.floor(n / 160));
    const rows: Row[] = [];
    for (let i = 0; i < n; i += step) {
      const s = result.samples[i]!;
      const b = baseline.samples.find((q) => q.x >= s.x) ?? baseline.samples.at(-1);
      rows.push({
        xIn: mToInches(s.x),
        tMs: s.t * 1e3,
        pKsi: paToPsi(s.p) / 1000,
        pBaseKsi: b ? paToPsi(b.p) / 1000 : 0,
        vFps: msToFps(s.v),
        vBaseFps: b ? msToFps(b.v) : 0,
        proj: s.keProj,
        therm: s.eTherm,
        heat: s.heatLoss,
        chem: s.released,
      });
    }
    return rows;
  }, [result, baseline]);

  const axis = { fontSize: 10, fill: "var(--color-muted-foreground)", fontFamily: "IBM Plex Mono" };
  const grid = { stroke: "var(--color-border)", strokeDasharray: "2 4" };

  return (
    <Tabs defaultValue="pressure" className="px-4 pb-4">
      <TabsList>
        <TabsTrigger value="pressure">Pressure vs travel</TabsTrigger>
        <TabsTrigger value="velocity">Velocity vs travel</TabsTrigger>
        <TabsTrigger value="energy">Energy</TabsTrigger>
      </TabsList>
      <TabsContent value="pressure" className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="xIn" tick={axis} tickFormatter={(v) => `${Number(v).toFixed(0)}"`} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={axis} tickFormatter={(v) => `${v}`} width={36} />
            <Tooltip content={<ChartTip unit='in' />} />
            <Line
              type="monotone"
              dataKey="pBaseKsi"
              name="base-only ksi"
              stroke="var(--color-chart-base)"
              dot={false}
              strokeWidth={1.25}
              strokeDasharray="4 3"
            />
            <Line
              type="monotone"
              dataKey="pKsi"
              name="space-mean ksi"
              stroke="var(--color-chart-pressure)"
              dot={false}
              strokeWidth={1.75}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="velocity" className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="xIn" tick={axis} tickFormatter={(v) => `${Number(v).toFixed(0)}"`} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={axis} width={40} />
            <Tooltip content={<ChartTip unit='in' />} />
            <Line
              type="monotone"
              dataKey="vBaseFps"
              name="base-only fps"
              stroke="var(--color-chart-base)"
              dot={false}
              strokeWidth={1.25}
              strokeDasharray="4 3"
            />
            <Line
              type="monotone"
              dataKey="vFps"
              name="fps"
              stroke="var(--color-chart-velocity)"
              dot={false}
              strokeWidth={1.75}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="energy" className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="tMs" tick={axis} tickFormatter={(v) => `${Number(v).toFixed(1)}`} />
            <YAxis tick={axis} width={36} />
            <Tooltip content={<ChartTip unit="ms" />} />
            <Area
              type="monotone"
              dataKey="proj"
              name="projectile J"
              stackId="1"
              stroke="var(--color-chart-velocity)"
              fill="var(--color-chart-velocity)"
              fillOpacity={0.35}
            />
            <Area
              type="monotone"
              dataKey="therm"
              name="thermal J"
              stackId="1"
              stroke="var(--color-chart-energy)"
              fill="var(--color-chart-energy)"
              fillOpacity={0.25}
            />
            <Area
              type="monotone"
              dataKey="heat"
              name="heat loss J"
              stackId="1"
              stroke="var(--color-chart-heat)"
              fill="var(--color-chart-heat)"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}
