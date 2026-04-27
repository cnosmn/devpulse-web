"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Code, 
  History, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Genel Bakış",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Projeler",
    href: "/dashboard/projects",
    icon: Code,
  },
  {
    title: "Aktivite",
    href: "/dashboard/activity",
    icon: History,
  },
  {
    title: "Analizler",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Ayarlar",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            DP
          </div>
          {!isCollapsed && <span className="text-xl tracking-tight">DevPulse</span>}
        </Link>
      </div>

      <div className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Daralt</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
