import type { ReactNode } from "react"

export type PageSectionProperties = {
  width: "narrow" | "standard" | "wide" | "full"
  surface: "transparent" | "muted" | "contrast" | "gradient"
  spacing: "sm" | "md" | "lg" | "xl"
  radius: "none" | "md" | "lg"
  anchor: string
  effect: "none" | "fade" | "slide"
}

export type PageColumnsProperties = {
  distribution: "equal" | "sidebar-left" | "sidebar-right"
  gap: "sm" | "md" | "lg"
  mobile: "stack" | "scroll"
}

const WIDTH_CLASSES: Record<PageSectionProperties["width"], string> = {
  narrow: "max-w-3xl",
  standard: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
}

const SPACING_CLASSES: Record<PageSectionProperties["spacing"], string> = {
  sm: "py-6",
  md: "py-10",
  lg: "py-16",
  xl: "py-24",
}

const RADIUS_CLASSES: Record<PageSectionProperties["radius"], string> = {
  none: "rounded-none",
  md: "rounded-2xl",
  lg: "rounded-[2rem]",
}

const SURFACE_CLASSES: Record<PageSectionProperties["surface"], string> = {
  transparent: "bg-transparent",
  muted: "bg-muted/60",
  contrast: "bg-foreground text-background",
  gradient: "bg-gradient-to-br from-primary/15 via-background to-muted/40 ring-1 ring-primary/15",
}

export function PageSection({ properties, children, editor = false }: { properties: PageSectionProperties; children: ReactNode; editor?: boolean }) {
  return (
    <section
      id={properties.anchor || undefined}
      data-effect={properties.effect}
      data-radius={properties.radius}
      data-spacing={properties.spacing}
      data-surface={properties.surface}
      data-width={properties.width}
      data-editor-frame={editor || undefined}
      className={`page-layout-section mx-auto w-full px-5 sm:px-8 ${WIDTH_CLASSES[properties.width]} ${SPACING_CLASSES[properties.spacing]}`}
    >
      <div className={`${SURFACE_CLASSES[properties.surface]} ${RADIUS_CLASSES[properties.radius]} ${properties.surface === "transparent" ? "" : "px-5 py-8 sm:px-10 sm:py-12"}`}>
        {children}
      </div>
    </section>
  )
}

export function PageColumns({ properties, children, editor = false }: { properties: PageColumnsProperties; children: ReactNode; editor?: boolean }) {
  return (
    <div
      className="page-layout-columns"
      data-distribution={properties.distribution}
      data-gap={properties.gap}
      data-mobile={properties.mobile}
      data-editor-frame={editor || undefined}
    >
      {children}
    </div>
  )
}

export function PageColumn({ children, editor = false }: { children: ReactNode; editor?: boolean }) {
  return <div className="page-layout-column" data-editor-frame={editor || undefined}>{children}</div>
}
