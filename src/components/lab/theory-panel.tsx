import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLab } from "@/store/lab";

export function TheoryPanel() {
  const open = useLab((s) => s.theoryOpen);
  const setTheoryOpen = useLab((s) => s.setTheoryOpen);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-background/70 p-3 md:items-center">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium tracking-tight">What this model is doing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Lumped-parameter interior ballistics. Teaching-grade, not a load-development tool.
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => setTheoryOpen(false)} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The historical V-3 (Hochdruckpumpe) was a long multi-chamber gun: a base charge started
            the projectile, then side charges fired as it passed each port, topping up the gas so
            pressure did not collapse as the bore volume grew. This lab is that idea scaled to a
            .22 Long Rifle bullet with .22 blanks as the sequential charges.
          </p>
          <p className="font-mono text-xs text-foreground">
            Noble–Abel  P (V − α m − V_solid) = (γ − 1) E
            <br />
            Vieille    r = β (P / 1 MPa)^n  dz = r dt / web
            <br />
            Resal     E_chem = E_therm + KE_proj + KE_gas + Q + W_fric + E_blowby
            <br />
            Lagrange   m_eff = m + m_g / 3  m_eff a = (P − P_res − P_atm) A
          </p>
          <p>
            Powder is fast single-base flake with impetus, covolume, and γ in the published NC
            small-arms range. β and web are calibrated so a 40 gr / 1.10 gr load in an 18.5 in
            barrel lands near 1,080 fps and 24 ksi — a standard-velocity .22 LR point. SAAMI MAP
            for .22 LR is 24,000 psi; that line is a warning, not a design limit for a purpose-built
            tube.
          </p>
          <p>
            A sequential charge ignites when the bullet base reaches the port plus your offset. If
            the port is still ahead of the bullet, the side chamber is a closed bomb and gas chokes
            out as precursor blow-by. If the port is behind the bullet, the chamber volume joins the
            bore and the new gas does work. Late stations see a large free volume, Vieille slows,
            and powder can leave the muzzle unburned — the usual failure mode of a too-long
            multi-charge gun with fast pistol powder.
          </p>
          <p>
            Space-mean pressure is what the equation of state returns. A Lagrange gradient splits
            breech and base pressure for the cutaway; for .22 LR the powder mass is small so that
            split is only a few percent, and it grows as you stack blanks.
          </p>
          <p>
            This is not a blueprint. There is no ignition hardware, no chamber drawing, no
            construction sequence. Treat the numbers as a physics sketch: they are dimensionally
            consistent and calibrated at one well-known cartridge, then extrapolated to the
            sequential-charge idea.
          </p>
        </div>
      </div>
    </div>
  );
}
