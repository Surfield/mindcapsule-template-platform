"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DollarSign, FileText, Users, TrendingUp, Handshake } from "lucide-react";

type Role = "admin" | "user" | "tutor";

const navItems = [
  {
    title: "Payment Sheet",
    href: "/dashboard/payment-sheet",
    icon: DollarSign,
    roles: ["admin", "user"] as Role[],
  },
  {
    title: "Recap",
    href: "/dashboard/recap",
    icon: FileText,
    roles: ["admin", "user"] as Role[],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    roles: ["admin", "user", "tutor"] as Role[],
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: TrendingUp,
    roles: ["admin"] as Role[],
  },
  {
    title: "Sponsorships",
    href: "/dashboard/sponsorships",
    icon: Handshake,
    roles: ["admin"] as Role[],
  },
];

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role = "tutor" }: SidebarProps) {
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
