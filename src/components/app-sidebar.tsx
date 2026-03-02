"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  User,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  LayoutDashboard,
  ShoppingCart,
  Store,
  User,
  Package,
} as const;

export type IconName = keyof typeof ICONS;

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

interface AppSidebarProps {
  title: string;
  navItems: NavItem[];
  homeHref: string;
}

export function AppSidebar({ title, navItems, homeHref }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-card text-card-foreground shrink-0">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={homeHref} className="text-lg font-semibold">
          {title}
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
