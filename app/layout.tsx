import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "../components/providers/AppProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

/**
 * Global metadata for the application.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "WebSweep",
  description: "Automated data collection for the web"
};

/**
 * RootLayout Component.
 *
 * This is the root layout component for the application. It wraps all pages with global providers,
 * including the ClerkProvider for authentication and AppProviders for additional application-wide context.
 * It also sets the global HTML structure with the correct language and font, and renders a Toaster
 * component for displaying toast notifications.
 *
 * @param {Readonly<{children: React.ReactNode}>} props - The component props.
 * @param {React.ReactNode} props.children - The child elements to render inside the layout.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/sign-in"}
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-sm !shadow-none"
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
        </body>
        <Toaster richColors />
      </html>
    </ClerkProvider>
  );
}
