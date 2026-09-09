import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PRESETS } from "@/lib/ballistics/presets.ts";
import { kgToGrains, mToInches, paToPsi } from "@/lib/ballistics/units.ts";
import { grainsToKg, inchesToM, psiToPa } from "@/lib/ballistics/units.ts";
import { useLab } from "@/store/lab";

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {value.toFixed(step < 1 ? 2 : 0)} {suffix}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v ?? value)}
      />
    </div>
  );
}

export function ControlsPanel() {
  const config = useLab((s) => s.config);
  const selectedChargeId = useLab((s) => s.selectedChargeId);
  const advanced = useLab((s) => s.advanced);
  const presetId = useLab((s) => s.presetId);
  const patchConfig = useLab((s) => s.patchConfig);
  const patchCharge = useLab((s) => s.patchCharge);
  const loadPreset = useLab((s) => s.loadPreset);
  const addCharge = useLab((s) => s.addCharge);
  const removeCharge = useLab((s) => s.removeCharge);
  const distribute = useLab((s) => s.distribute);
  const selectCharge = useLab((s) => s.selectCharge);
  const toggleAdvanced = useLab((s) => s.toggleAdvanced);

  const selected = config.charges.find((c) => c.id === selectedChargeId) ?? config.charges[0];
  const seqCount = config.charges.filter((c) => c.kind === "sequential").length;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <section className="space-y-2">
        <Label>Layout preset</Label>
        <select
          className="h-11 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)]"
          value={presetId}
          onChange={(e) => loadPreset(e.target.value)}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.make().name}
            </option>
          ))}
        </select>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {PRESETS.find((p) => p.id === presetId)?.blurb}
        </p>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Barrel
        </h2>
        <Field
          label="Travel length"
          value={mToInches(config.barrelLength)}
          min={6}
          max={48}
          step={0.5}
          suffix="in"
          onChange={(v) => patchConfig({ barrelLength: inchesToM(v) })}
        />
        <Field
          label="Projectile mass"
          value={kgToGrains(config.projectileMass)}
          min={20}
          max={60}
          step={1}
          suffix="gr"
          onChange={(v) => patchConfig({ projectileMass: grainsToKg(v) })}
        />
        <Field
          label="Wall thickness"
          value={config.wallThickness * 1000}
          min={2}
          max={10}
          step={0.25}
          suffix="mm"
          onChange={(v) => patchConfig({ wallThickness: v / 1000 })}
        />
        {advanced ? (
          <>
            <Field
              label="Start pressure"
              value={paToPsi(config.startPressure)}
              min={200}
              max={3000}
              step={50}
              suffix="psi"
              onChange={(v) => patchConfig({ startPressure: psiToPa(v) })}
            />
            <Field
              label="Heat transfer"
              value={config.heatTransfer / 1e4}
              min={1}
              max={20}
              step={0.5}
              suffix="×10⁴ W/m²K"
              onChange={(v) => patchConfig({ heatTransfer: v * 1e4 })}
            />
          </>
        ) : null}
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Charges
          </h2>
          <Button
            size="sm"
            variant="secondary"
            onClick={addCharge}
            disabled={seqCount >= 12}
          >
            <Plus className="size-3.5" />
            Add blank
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          {config.charges.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCharge(c.id)}
              className={`flex h-11 items-center justify-between rounded-lg px-3 text-left text-sm transition-colors ${
                c.id === selectedChargeId ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <span>{c.label}</span>
              <span className="font-mono text-[11px] tabular-nums">
                {c.kind === "base" ? "chamber" : `${mToInches(c.position).toFixed(1)} in`}
                {" · "}
                {kgToGrains(c.mass).toFixed(2)} gr
              </span>
            </button>
          ))}
        </div>
        {seqCount > 1 ? (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => distribute("v3")}>
              V-3 spacing
            </Button>
            <Button size="sm" variant="ghost" onClick={() => distribute("even")}>
              Even
            </Button>
            <Button size="sm" variant="ghost" onClick={() => distribute("front")}>
              Front-load
            </Button>
          </div>
        ) : null}
      </section>

      {selected ? (
        <>
          <Separator />
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {selected.label}
              </h2>
              {selected.kind === "sequential" ? (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remove charge"
                  onClick={() => removeCharge(selected.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
            {selected.kind === "sequential" ? (
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enabled</Label>
                <Switch
                  id="enabled"
                  checked={selected.enabled}
                  onCheckedChange={(v) => patchCharge(selected.id, { enabled: v })}
                />
              </div>
            ) : null}
            <Field
              label="Powder mass"
              value={kgToGrains(selected.mass)}
              min={0.3}
              max={3.5}
              step={0.05}
              suffix="gr"
              onChange={(v) => patchCharge(selected.id, { mass: grainsToKg(v) })}
            />
            {selected.kind === "sequential" ? (
              <>
                <Field
                  label="Port station"
                  value={mToInches(selected.position)}
                  min={0.4}
                  max={Math.max(1, mToInches(config.barrelLength) - 0.5)}
                  step={0.1}
                  suffix="in"
                  onChange={(v) => patchCharge(selected.id, { position: inchesToM(v) })}
                />
                <Field
                  label="Ignition offset"
                  value={selected.triggerOffset * 1000}
                  min={-80}
                  max={40}
                  step={1}
                  suffix="mm"
                  onChange={(v) => patchCharge(selected.id, { triggerOffset: v / 1000 })}
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Negative offset fires before the bullet base uncovers the port (blow-by risk).
                  Zero is flash-at-port, the V-3 default.
                </p>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Base charge is a .22 Long Rifle round in the chamber. Sequential stations are .22
                blanks tapping the bore like the V-3 / Hochdruckpumpe.
              </p>
            )}
            {advanced ? (
              <>
                <Field
                  label="Half-web"
                  value={selected.propellant.web * 1e6}
                  min={8}
                  max={60}
                  step={1}
                  suffix="µm"
                  onChange={(v) =>
                    patchCharge(selected.id, {
                      propellant: { ...selected.propellant, web: v * 1e-6 },
                    })
                  }
                />
                <Field
                  label="Vieille β"
                  value={selected.propellant.burnBeta * 1000}
                  min={1}
                  max={12}
                  step={0.2}
                  suffix="mm/s @ 1 MPa"
                  onChange={(v) =>
                    patchCharge(selected.id, {
                      propellant: { ...selected.propellant, burnBeta: v / 1000 },
                    })
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={selected.label}
                    onChange={(e) => patchCharge(selected.id, { label: e.target.value })}
                  />
                </div>
              </>
            ) : null}
          </section>
        </>
      ) : null}

      <Separator />
      <button
        type="button"
        onClick={toggleAdvanced}
        className="text-left text-xs text-muted-foreground hover:text-foreground"
      >
        {advanced ? "Hide advanced powder and start parameters" : "Show advanced powder parameters"}
      </button>
    </div>
  );
}
