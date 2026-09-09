import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { simulate, simulateBaseline, totalChemicalEnergy } from "./engine.ts";
import {
  presetLate,
  presetMistimed,
  presetStandard22,
  presetV3Compact,
} from "./presets.ts";
import { msToFps, paToPsi } from "./units.ts";

describe("interior ballistics engine", () => {
  it("matches a standard-velocity .22 LR window", () => {
    const r = simulate(presetStandard22());
    const fps = msToFps(r.summary.muzzleVelocity);
    const ksi = paToPsi(r.summary.peakPressure) / 1000;
    assert.equal(r.status, "exited");
    assert.ok(fps > 980 && fps < 1250, `fps ${fps}`);
    assert.ok(ksi > 14 && ksi < 28, `peak ksi ${ksi}`);
    assert.ok(r.summary.unburnedFraction < 0.15, "mostly burned");
    assert.ok(r.summary.efficiency > 0.18 && r.summary.efficiency < 0.55);
  });

  it("conserves energy to a few percent", () => {
    const cfg = presetV3Compact();
    const r = simulate(cfg);
    const e = r.summary.energy;
    const accounted =
      e.projectile +
      e.gasKinetic +
      e.thermal +
      e.heat +
      e.friction +
      e.blowby +
      e.unburned;
    const chem = totalChemicalEnergy(cfg);
    const err = Math.abs(accounted - chem) / chem;
    assert.ok(err < 0.02, `energy residual ${err}`);
  });

  it("sequential charges raise muzzle velocity over the base-only gun", () => {
    const cfg = presetV3Compact();
    const seq = simulate(cfg);
    const base = simulateBaseline(cfg);
    assert.equal(seq.status, "exited");
    assert.equal(base.status, "exited");
    assert.ok(
      seq.summary.muzzleVelocity > base.summary.muzzleVelocity * 1.08,
      `seq ${seq.summary.muzzleVelocity} vs base ${base.summary.muzzleVelocity}`,
    );
  });

  it("early trigger produces blow-by", () => {
    const r = simulate(presetMistimed());
    assert.ok(r.summary.blowbyMass > 1e-6, "expected precursor mass");
    assert.ok(r.warnings.some((w) => w.id === "blowby"));
  });

  it("late stations leave unburned powder", () => {
    const r = simulate(presetLate());
    assert.ok(r.summary.unburnedFraction > 0.05);
  });

  it("travel is monotonic and non-negative", () => {
    const r = simulate(presetV3Compact());
    let prev = -1e-9;
    for (const s of r.samples) {
      assert.ok(s.x + 1e-9 >= prev);
      assert.ok(s.v >= -1e-6);
      prev = s.x;
    }
  });
});
