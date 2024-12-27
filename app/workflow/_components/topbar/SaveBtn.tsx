"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

//timestamp: 2:47:39
export default function SaveBtn() {
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => alert("todo")}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}
