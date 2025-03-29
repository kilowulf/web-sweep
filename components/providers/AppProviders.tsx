"use client";

import { ThemeProvider } from "next-themes";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextTopLoader from "nextjs-toploader";

/**
 * AppProviders Component.
 *
 * Wraps the application with global providers:
 * - QueryClientProvider: Manages server state with react-query.
 * - NextTopLoader: Displays a top-loading progress bar.
 * - ThemeProvider: Provides theme (light/dark mode) support via next-themes.
 * - ReactQueryDevtools: Enables react-query debugging tools.
 *
 * A new QueryClient instance is created only once using useState.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components to render within the providers.
 * @returns {JSX.Element} The application wrapped with the necessary providers.
 */
export default function AppProviders({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
