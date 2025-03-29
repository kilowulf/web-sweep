import { cn } from "@/lib/utils";
import {
  SquareDashedMousePointer,
  Terminal,
  RotateCwSquare
} from "lucide-react";
import Link from "next/link";
import React from "react";

/**
 * Logo Component.
 *
 * Renders a clickable logo that navigates to the home page.
 * The logo consists of an icon with a gradient background and styled text.
 * The icon and text colors are defined with gradient and dark/light mode styles.
 *
 * @param {LogoProps} props - Component properties.
 * @param {string} [props.fontSize="text-2xl"] - Optional font size class for the logo text.
 * @param {number} [props.iconSize=20] - Optional size for the logo icon.
 * @returns {JSX.Element} The rendered logo component.
 */

export default function Logo({
  fontSize = "text-2xl",
  iconSize = 20
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href="/"
      className={cn("text-2xl font-extrabold flex items-center gap-2")}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        <RotateCwSquare
          size={iconSize}
          fontSize={fontSize}
          className="stroke-white font-bold text-3xl"
        />
      </div>
      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Web
        </span>
        <span className="text-stone-700 dark:text-stone-300">Sweep</span>
      </div>
    </Link>
  );
}
