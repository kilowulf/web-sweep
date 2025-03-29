import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

/**
 * NotFoundPage Component.
 *
 * Renders a custom 404 error page that informs the user the requested page was not found.
 * The page includes a prominent "404" header, a brief message, and a link to navigate back to the dashboard.
 * It also includes a footer message suggesting the user contact support if they believe this is an error.
 *
 * @returns {JSX.Element} The rendered 404 error page.
 */
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Don&apos;t worry, even the best data sometimes gets lost in the
          internet.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={"/"}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        If you believe this is an error, contact our support team.
      </footer>
    </div>
  );
}
