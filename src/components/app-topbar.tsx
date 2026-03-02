"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TopbarTab {
  label: string;
  value: string;
}

interface AppTopbarProps {
  tabs: TopbarTab[];
  paramKey?: string;
}

export function AppTopbar({ tabs, paramKey = "tab" }: AppTopbarProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get(paramKey) ?? tabs[0]?.value;

  return (
    <header className="flex h-12 items-center gap-1 border-b bg-background px-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramKey, tab.value);
        return (
          <Link
            key={tab.value}
            href={`?${params.toString()}`}
            className={cn(
              "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </header>
  );
}
