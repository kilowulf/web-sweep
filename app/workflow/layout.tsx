import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React from "react";

/**
 * Layout Component.
 *
 * Serves as the main layout wrapper for application pages.
 * It renders the page content passed as children, followed by a footer.
 * The footer includes a logo and a mode toggle button, separated from the content by a visual separator.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The main content to be rendered within the layout.
 * @returns {JSX.Element} The rendered layout with footer.
 */
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
}
