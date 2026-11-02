import { defaultProps } from "@blocknote/core"

export const commonBlockProps = defaultProps

/** Schema fragments inherited by blocks in the same family. */
export const structureBoxProps = {
  surface: { default: "transparent", values: ["transparent", "card", "muted", "contrast", "gradient"] as const },
  padding: { default: "none", values: ["none", "sm", "md", "lg", "xl"] as const },
  radius: { default: "none", values: ["none", "sm", "md", "lg"] as const },
  border: { default: "none", values: ["none", "subtle", "strong"] as const },
  shadow: { default: "none", values: ["none", "sm", "md"] as const },
  minHeight: { default: "auto", values: ["auto", "sm", "md", "lg", "screen"] as const },
  contentAlignment: { default: "left", values: ["left", "center", "right"] as const },
  verticalAlignment: { default: "start", values: ["start", "center", "end"] as const },
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
    ...structureBoxProps,
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
    ...structureBoxProps,
    surface: { ...structureBoxProps.surface, default: "card" },
    radius: { ...structureBoxProps.radius, default: "md" },
    padding: { ...structureBoxProps.padding, default: "md" },
    border: { ...structureBoxProps.border, default: "subtle" },
    shadow: { ...structureBoxProps.shadow, default: "sm" },
  },
} as const

export const sectionDefinition = {
  title: "Seção",
  propSchema: {
    ...commonBlockProps,
    ...structureBoxProps,
    padding: { ...structureBoxProps.padding, default: "lg" },
    width: { default: "wide", values: ["narrow", "standard", "wide", "full"] as const },
    anchor: { default: "" },
    effect: { default: "none", values: ["none", "fade", "slide"] as const },
  },
} as const

export const columnsDefinition = {
  title: "Colunas",
  propSchema: {
    ...commonBlockProps,
    ...structureBoxProps,
    ...structureFlowProps,
    distribution: { default: "equal", values: ["equal", "sidebar-left", "sidebar-right"] as const },
    mobile: { default: "stack", values: ["stack", "scroll"] as const },
  },
} as const
