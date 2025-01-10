"use client";
import { ParamProps } from "@/types/appNodes";
import React from "react";

export default function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}
