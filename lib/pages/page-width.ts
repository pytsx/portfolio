export const PAGE_WIDTHS = ["narrow", "standard", "wide", "full"] as const

export type PageWidth = (typeof PAGE_WIDTHS)[number]

export const DEFAULT_PAGE_WIDTH: PageWidth = "wide"

export function parsePageWidth(value: unknown): PageWidth {
  return PAGE_WIDTHS.includes(value as PageWidth)
    ? value as PageWidth
    : DEFAULT_PAGE_WIDTH
}
