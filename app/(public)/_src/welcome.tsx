"use client"
import React from "react";
import { StaggeredText } from "@/components/ui/staggered-text"

export function Welcome({ name }: { name: string }) {
  return (
    <div className="sr-only">
      <StaggeredText
        className="text-6xl font-bold text-center"
        text={name}
        segmentBy="chars"
        delay={50}
        direction="bottom"
      />
    </div>
  )
}
