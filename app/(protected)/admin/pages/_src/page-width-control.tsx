"use client"

import { AlignHorizontalSpaceAround, Maximize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type PageWidth } from "@/lib/pages/page-width"

const WIDTH_OPTIONS: Array<{
  value: PageWidth
  label: string
  description: string
}> = [
  { value: "narrow", label: "Estreita", description: "768 px" },
  { value: "standard", label: "Padrão", description: "1024 px" },
  { value: "wide", label: "Ampla", description: "1280 px" },
  { value: "full", label: "Tela inteira", description: "Sem limite" },
]

type PageWidthControlProps = {
  value: PageWidth
  onValueChange: (value: PageWidth) => void
}

export function PageWidthControl({ value, onValueChange }: PageWidthControlProps) {
  const currentOption = WIDTH_OPTIONS.find((option) => option.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type="button" variant="outline" size="sm" />}>
        {value === "full" ? <Maximize2 /> : <AlignHorizontalSpaceAround />}
        <span className="hidden sm:inline">{currentOption?.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) => onValueChange(nextValue as PageWidth)}
        >
          <DropdownMenuLabel>Largura da página</DropdownMenuLabel>
          {WIDTH_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <span className="grid">
                <span>{option.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
