import DesktopSidebar from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import React from "react";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { SignedIn, UserButton } from "@clerk/nextjs";

/**
 * Layout Component.
 *
 * This component serves as the main layout for the application.
 * It renders a sidebar, header with breadcrumb navigation, theme mode toggle,
 * and a user button (visible only when signed in). The children passed to this
 * layout will be rendered below the header.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render within the layout.
 * @returns {JSX.Element} The complete layout component.
 */
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop view */}
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          {/* Breadcrumb header for navigation */}
          <BreadcrumbHeader />
          <div className="gap-1 flex items-center">
            {/* Toggle to switch between light and dark mode */}
            <ModeToggle />
            {/* Display user button only when signed in */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        {/* Horizontal separator */}
        <Separator />
        <div className="overflow-auto">
          {/* Main content container */}
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
