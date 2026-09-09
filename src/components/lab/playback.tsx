import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { fmtUs } from "@/lib/ballistics/format.ts";
import { useLab } from "@/store/lab";

export function Playback() {
  const result = useLab((s) => s.result);
  const playhead = useLab((s) => s.playhead);
  const playing = useLab((s) => s.playing);
  const speed = useLab((s) => s.speed);
  const setPlayhead = useLab((s) => s.setPlayhead);
  const setPlaying = useLab((s) => s.setPlaying);
  const setSpeed = useLab((s) => s.setSpeed);

  const tMax = result?.samples.at(-1)?.t ?? 0.002;

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const next = useLab.getState().playhead + dt / speed;
      if (next >= tMax) {
        setPlayhead(tMax);
        setPlaying(false);
        return;
      }
      setPlayhead(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, tMax, setPlayhead, setPlaying]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        const s = useLab.getState();
        if (s.playhead >= tMax - 1e-6) s.setPlayhead(0);
        s.setPlaying(!s.playing);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tMax]);

  return (
    <div className="flex flex-col gap-2 px-4 pb-3 md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="secondary"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => {
            if (playhead >= tMax - 1e-6) setPlayhead(0);
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Reset playhead"
          onClick={() => {
            setPlaying(false);
            setPlayhead(0);
          }}
        >
          <RotateCcw className="size-4" />
        </Button>
        <span className="ml-2 min-w-[7.5rem] font-mono text-xs tabular-nums text-muted-foreground">
          {fmtUs(playhead)} / {fmtUs(tMax)}
        </span>
      </div>
      <Slider
        className="flex-1"
        min={0}
        max={tMax}
        step={tMax / 400}
        value={[playhead]}
        onValueChange={([v]) => {
          setPlaying(false);
          setPlayhead(v ?? 0);
        }}
      />
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="hidden md:inline">Slow-mo</span>
        <select
          className="h-11 rounded-md bg-secondary px-2 font-mono text-xs text-foreground shadow-[var(--shadow-border)]"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value={200}>200×</option>
          <option value={500}>500×</option>
          <option value={1000}>1000×</option>
          <option value={2000}>2000×</option>
        </select>
      </label>
    </div>
  );
}
