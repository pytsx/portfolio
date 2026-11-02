import { defaultProps } from "@blocknote/core"

export const commonBlockProps = defaultProps

/** Schema fragments inherited by blocks in the same family. */
export const structureAppearanceProps = {
  surface: { default: "transparent", values: ["transparent", "card", "muted", "contrast", "gradient"] as const },
  radius: { default: "none", values: ["none", "sm", "md", "lg"] as const },
} as const

export const structureFlowProps = {
  gap: { default: "md", values: ["none", "sm", "md", "lg", "xl"] as const },
  align: { default: "stretch", values: ["start", "center", "end", "stretch"] as const },
} as const

export const linkProps = {
  href: { default: "/" },
  variant: { default: "primary", values: ["primary", "secondary"] as const },
} as const

export const buttonDefinition = {
  title: "Botão",
  propSchema: { ...commonBlockProps, ...linkProps },
} as const

export const stackDefinition = {
  title: "Pilha",
  description: "Agrupe e alinhe textos, botões, imagens e outros blocos",
  propSchema: {
    ...commonBlockProps,
    ...structureFlowProps,
    direction: { default: "column", values: ["column", "row"] as const },
    justify: { default: "start", values: ["start", "center", "end", "between"] as const },
    wrap: { default: true },
  },
} as const

export const cardDefinition = {
  title: "Card",
  description: "Container reutilizável para agrupar conteúdo",
  propSchema: {
    ...commonBlockProps,
    ...structureAppearanceProps,
    surface: { ...structureAppearanceProps.surface, default: "card" },
    radius: { ...structureAppearanceProps.radius, default: "md" },
    padding: { default: "md", values: ["sm", "md", "lg"] as const },
    border: { default: "subtle", values: ["none", "subtle"] as const },
    shadow: { default: "sm", values: ["none", "sm", "md"] as const },
  },
} as const

export const sectionDefinition = {
  title: "Seção",
  propSchema: {
    ...commonBlockProps,
    ...structureAppearanceProps,
    width: { default: "wide", values: ["narrow", "standard", "wide", "full"] as const },
    spacing: { default: "lg", values: ["sm", "md", "lg", "xl"] as const },
    anchor: { default: "" },
    effect: { default: "none", values: ["none", "fade", "slide"] as const },
    contentAlignment: { default: "left", values: ["left", "center", "right"] as const },
    verticalAlignment: { default: "start", values: ["start", "center", "end"] as const },
    minHeight: { default: "auto", values: ["auto", "large", "screen"] as const },
  },
} as const

export const columnsDefinition = {
  title: "Colunas",
  propSchema: {
    ...commonBlockProps,
    ...structureFlowProps,
    distribution: { default: "equal", values: ["equal", "sidebar-left", "sidebar-right"] as const },
    mobile: { default: "stack", values: ["stack", "scroll"] as const },
  },
} as const
