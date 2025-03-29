import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

/**
 * This function is a layout component for the application. It wraps the children components
 * within a centered and vertically aligned container.
 *
 * @param children - The React components to be rendered within the layout.
 *
 * @returns A React component that renders the layout with the provided children.
 */
export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Logo />
      {children}
    </div>
  );
}

