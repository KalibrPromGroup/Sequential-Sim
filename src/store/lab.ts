import { create } from "zustand";
import {
  interpolateSample,
  simulate,
  simulateBaseline,
} from "@/lib/ballistics/engine.ts";
import {
  addSequentialCharge,
  cloneConfig,
  distributeStations,
  PRESETS,
  presetV3Compact,
  removeCharge as dropCharge,
} from "@/lib/ballistics/presets.ts";
import type { GunConfig, Sample, SimResult } from "@/lib/ballistics/types.ts";

const STORAGE_KEY = "cascade-bore-v1";

function runPair(config: GunConfig): { result: SimResult; baseline: SimResult } {
  return { result: simulate(config), baseline: simulateBaseline(config) };
}

const defaultConfig = presetV3Compact();
const defaultPair = runPair(defaultConfig);

function loadSavedConfig(): GunConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GunConfig;
    if (!parsed?.charges?.length || !parsed.barrelLength) return null;
    return parsed;
  } catch {
    return null;
  }
}

type LabState = {
  config: GunConfig;
  result: SimResult;
  baseline: SimResult;
  playhead: number;
  playing: boolean;
  speed: number;
  selectedChargeId: string;
  advanced: boolean;
  theoryOpen: boolean;
  presetId: string;
  setConfig: (config: GunConfig) => void;
  patchConfig: (partial: Partial<GunConfig>) => void;
  patchCharge: (id: string, partial: Partial<GunConfig["charges"][number]>) => void;
  loadPreset: (id: string) => void;
  addCharge: () => void;
  removeCharge: (id: string) => void;
  distribute: (mode: "even" | "v3" | "front") => void;
  setPlayhead: (t: number) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  selectCharge: (id: string) => void;
  toggleAdvanced: () => void;
  setTheoryOpen: (open: boolean) => void;
  hydrate: () => void;
  sampleAt: () => Sample | null;
};

export const useLab = create<LabState>((set, get) => {
  const persist = (config: GunConfig) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* ignore quota */
    }
  };

  const apply = (config: GunConfig, extra?: Partial<LabState>) => {
    const pair = runPair(config);
    persist(config);
    set({
      config,
      result: pair.result,
      baseline: pair.baseline,
      playhead: 0,
      playing: false,
      ...extra,
    });
  };

  return {
    config: defaultConfig,
    result: defaultPair.result,
    baseline: defaultPair.baseline,
    playhead: 0,
    playing: false,
    speed: 500,
    selectedChargeId: "base",
    advanced: false,
    theoryOpen: false,
    presetId: "v3",
    setConfig: (config) => apply(cloneConfig(config)),
    patchConfig: (partial) => apply({ ...get().config, ...partial }),
    patchCharge: (id, partial) => {
      const config = {
        ...get().config,
        charges: get().config.charges.map((c) =>
          c.id === id ? { ...c, ...partial } : c,
        ),
      };
      apply(config);
    },
    loadPreset: (id) => {
      const preset = PRESETS.find((p) => p.id === id);
      if (!preset) return;
      apply(preset.make(), { presetId: id, selectedChargeId: "base" });
    },
    addCharge: () => apply(addSequentialCharge(get().config)),
    removeCharge: (id) => {
      apply(dropCharge(get().config, id), { selectedChargeId: "base" });
    },
    distribute: (mode) => apply(distributeStations(get().config, mode)),
    setPlayhead: (t) => set({ playhead: t }),
    setPlaying: (playing) => set({ playing }),
    setSpeed: (speed) => set({ speed }),
    selectCharge: (id) => set({ selectedChargeId: id }),
    toggleAdvanced: () => set({ advanced: !get().advanced }),
    setTheoryOpen: (theoryOpen) => set({ theoryOpen }),
    hydrate: () => {
      const saved = loadSavedConfig();
      if (!saved) return;
      apply(saved);
    },
    sampleAt: () => {
      const { result, playhead } = get();
      if (!result.samples.length) return null;
      return interpolateSample(result.samples, playhead);
    },
  };
});
