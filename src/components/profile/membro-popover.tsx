"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Membro } from "@/lib/mock-data";

interface MembroPopoverProps {
  membro: Membro;
  children: React.ReactNode;
}

export function MembroPopover({ membro, children }: MembroPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
            {membro.nome.charAt(0)}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold leading-tight">{membro.nome}</p>
            <p className="text-xs text-muted-foreground">{membro.cargo}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {membro.role}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
