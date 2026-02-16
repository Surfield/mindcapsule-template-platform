"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, UserCog } from "lucide-react";

type Role = "admin" | "user";

const navItems = [
  {
    title: "MainScreen",
    href: "/dashboard/main",
    icon: Activity,
    roles: ["admin", "user"] as Role[],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UserCog,
    roles: ["admin"] as Role[],
  },
];

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role = "user" }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(role as Role)
  );

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span>Homework Helpers</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
