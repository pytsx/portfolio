"use client"

import { House } from "lucide-react"

type HomePageButtonProps = {
  pressed: boolean
  onPressedChange(pressed: boolean): void
}

export function HomePageButton({
  pressed,
  onPressedChange,
}: HomePageButtonProps) {
  return (
    <div
      className={pressed
        ? "rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 p-[3px]"
        : "rounded-xl border-2 border-muted bg-muted/50 p-[3px]"}
    >
      <button
        type="button"
        aria-pressed={pressed}
        onClick={() => onPressedChange(!pressed)}
        className="inline-flex h-8 items-center gap-1.5 rounded-[0.6rem] bg-background px-3 text-xs font-medium text-foreground"
      >
        <House className="size-3.5" /> Página principal
      </button>
    </div>
  )
}
