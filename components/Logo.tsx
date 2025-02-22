import { cn } from "@/lib/utils";
import {
  SquareDashedMousePointer,
  Terminal,
  RotateCwSquare
} from "lucide-react";
import Link from "next/link";
import React from "react";

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
