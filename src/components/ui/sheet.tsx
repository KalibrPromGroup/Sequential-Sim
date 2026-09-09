import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[86vh] flex-col rounded-t-2xl bg-card p-4 shadow-[var(--shadow-border)]",
            "md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[380px] md:max-h-none md:rounded-none md:rounded-l-2xl",
            "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="text-sm font-medium">{title}</Dialog.Title>
            <Dialog.Close className="flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
