"use client";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon
} from "lucide-react";
import React, { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { SheetTrigger, Sheet, SheetContent } from "./ui/sheet";
import UserAvailableCreditsBadge from "@/components/UserAvailableCreditsBadge";

/**
 * Route configuration for sidebar navigation.
 * Each route includes a URL fragment (href), display label, and an icon.
 */
const routes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheckIcon
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon
  }
];

/**
 * DesktopSidebar Component.
 *
 * Renders a sidebar for desktop view (md and up) with a logo, user credits badge,
 * and navigation links. It highlights the active route based on the current pathname.
 *
 * @returns {JSX.Element} The rendered desktop sidebar.
 */
export default function DesktopSidebar() {
  const pathname = usePathname();
  // Determine the active route by checking if the current pathname includes the route href.
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-separate p-4 border-b-[1px]">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/${route.href}`}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? "sidebarActiveItem"
                  : "sidebarItem"
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * MobileSidebar Component.
 *
 * Renders a collapsible sidebar for mobile view (below md).
 * It uses a Sheet component to display a menu that includes the logo and navigation links.
 * When a link is clicked, the sheet closes.
 *
 * @returns {JSX.Element} The rendered mobile sidebar.
 */
export function MobileSidebar() {
  // State to control the open/close status of the mobile sidebar sheet.
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  // Determine the active route for styling.
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[500px] space-y-4">
            <Logo />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={`/${route.href}`}
                  className={buttonVariants({
                    variant:
                      activeRoute.href === route.href
                        ? "sidebarActiveItem"
                        : "sidebarItem"
                  })}
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
