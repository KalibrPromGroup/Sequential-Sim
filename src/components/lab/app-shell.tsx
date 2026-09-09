"use client";

import { BookOpen, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { ChartsPanel } from "@/components/lab/charts-panel";
import { ControlsPanel } from "@/components/lab/controls-panel";
import { EnergyBar } from "@/components/lab/energy-bar";
import { EventLog } from "@/components/lab/event-log";
import { GunView } from "@/components/lab/gun-view";
import { Playback } from "@/components/lab/playback";
import { Readout } from "@/components/lab/readout";
import { TheoryPanel } from "@/components/lab/theory-panel";
import { Warnings } from "@/components/lab/warnings";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLab } from "@/store/lab";

export function LabApp() {
  const hydrate = useLab((s) => s.hydrate);
  const setTheoryOpen = useLab((s) => s.setTheoryOpen);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 max-lg:pr-20">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Interior ballistics
            </div>
            <h1 className="truncate text-lg font-medium tracking-tight">Cascade Bore</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTheoryOpen(true)}
            >
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline">Model</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="lg:hidden"
              onClick={() => setSheet(true)}
              aria-label="Edit charges"
            >
              <SlidersHorizontal className="size-3.5" />
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-[340px] shrink-0 overflow-y-auto border-r border-border p-4 lg:block">
            <ControlsPanel />
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <div className="border-b border-border bg-card">
              <GunView />
              <Playback />
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="py-4">
                <Readout />
              </div>
              <EnergyBar />
              <Warnings />
              <ChartsPanel />
              <EventLog />
            </div>
          </main>
        </div>
        <TheoryPanel />
        <Sheet open={sheet} onOpenChange={setSheet} title="Gun and charges">
          <ControlsPanel />
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
