import type { ReactNode } from "react"

export type StructureBoxProperties = {
  surface: "transparent" | "card" | "muted" | "contrast" | "gradient"
  padding: "none" | "sm" | "md" | "lg" | "xl"
  radius: "none" | "sm" | "md" | "lg"
  border: "none" | "subtle" | "strong"
  shadow: "none" | "sm" | "md"
  minHeight: "auto" | "sm" | "md" | "lg" | "screen"
  contentAlignment: "left" | "center" | "right"
  verticalAlignment: "start" | "center" | "end"
}

type StructureFlowProperties = {
  gap: "none" | "sm" | "md" | "lg" | "xl"
  align: "start" | "center" | "end" | "stretch"
}

export type PageSectionProperties = StructureBoxProperties & {
  width: "narrow" | "standard" | "wide" | "full"
  anchor: string
  effect: "none" | "fade" | "slide"
}

export type PageColumnsProperties = StructureBoxProperties & StructureFlowProperties & {
  distribution: "equal" | "sidebar-left" | "sidebar-right"
  mobile: "stack" | "scroll"
}

export type PageStackProperties = StructureBoxProperties & StructureFlowProperties & {
  direction: "column" | "row"
  justify: "start" | "center" | "end" | "between"
  wrap: boolean
}

export type PageCardProperties = StructureBoxProperties
export type PageColumnProperties = StructureBoxProperties

function structureAttributes(properties: StructureBoxProperties, editor: boolean) {
  return {
    "data-structure-frame": "true",
    "data-surface": properties.surface,
    "data-padding": properties.padding,
    "data-radius": properties.radius,
    "data-border": properties.border,
    "data-shadow": properties.shadow,
    "data-min-height": properties.minHeight,
    "data-content-alignment": properties.contentAlignment,
    "data-vertical-alignment": properties.verticalAlignment,
    "data-editor-frame": editor || undefined,
  }
}

export function PageSection({ properties, children, editor = false }: { properties: PageSectionProperties; children: ReactNode; editor?: boolean }) {
  return <section id={properties.anchor || undefined} className="page-layout-structure page-layout-section" data-effect={properties.effect} data-width={properties.width} {...structureAttributes(properties, editor)}><div>{children}</div></section>
}

export function PageColumns({ properties, children, editor = false }: { properties: PageColumnsProperties; children: ReactNode; editor?: boolean }) {
  return <div className="page-layout-structure page-layout-columns" data-distribution={properties.distribution} data-gap={properties.gap} data-mobile={properties.mobile} data-align={properties.align} {...structureAttributes(properties, editor)}>{children}</div>
}

export function PageStack({ properties, children, editor = false }: { properties: PageStackProperties; children: ReactNode; editor?: boolean }) {
  return <div className="page-layout-structure page-layout-stack" data-direction={properties.direction} data-gap={properties.gap} data-justify={properties.justify} data-align={properties.align} data-wrap={properties.wrap || undefined} {...structureAttributes(properties, editor)}>{children}</div>
}

export function PageCard({ properties, children, editor = false }: { properties: PageCardProperties; children: ReactNode; editor?: boolean }) {
  return <article className="page-layout-structure page-layout-card" {...structureAttributes(properties, editor)}>{children}</article>
}

export function PageColumn({ properties, children, editor = false }: { properties: PageColumnProperties; children: ReactNode; editor?: boolean }) {
  return <div className="page-layout-structure page-layout-column" {...structureAttributes(properties, editor)}>{children}</div>
}
