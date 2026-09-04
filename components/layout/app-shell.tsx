"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
} from "@ui5/webcomponents-react";
import { useAppStore } from "@/stores/app-store";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/products", label: "Products", icon: "product" },
  { href: "/bom", label: "Super BOM", icon: "shipping-status" },
  { href: "/configurator/vehicle-001", label: "Configurator", icon: "action-settings" },
  { href: "/features", label: "Features", icon: "business-objects-experience" },
  { href: "/variants", label: "Variants", icon: "process" },
  { href: "/rules", label: "Rules", icon: "settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigationExpanded = useAppStore((state) => state.navigationExpanded);
  const toggleNavigation = useAppStore((state) => state.toggleNavigation);

  return (
    <div className={`app-shell ${navigationExpanded ? "nav-expanded" : "nav-collapsed"}`}>
      <header className="shell-header">
        <ShellBar primaryTitle="Super BOM Configurator" secondaryTitle="Product Configuration Workspace">
          <Button
            slot="startButton"
            icon="menu2"
            tooltip={navigationExpanded ? "收起导航" : "展开导航"}
            accessibleName={navigationExpanded ? "收起导航" : "展开导航"}
            onClick={toggleNavigation}
          />
          <Avatar slot="profile" initials="SC" colorScheme="Accent6" accessibleName="当前用户" />
        </ShellBar>
      </header>
      <aside className="shell-navigation" aria-label="主导航">
        <SideNavigation collapsed={!navigationExpanded} accessibleName="主导航">
          {navigationItems.map((item) => (
            <SideNavigationItem
              key={item.href}
              text={item.label}
              icon={item.icon}
              selected={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              onClick={() => router.push(item.href)}
            />
          ))}
        </SideNavigation>
        <nav className="accessible-route-links" aria-label="页面链接">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} tabIndex={-1} aria-hidden="true">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="shell-content">{children}</main>
    </div>
  );
}