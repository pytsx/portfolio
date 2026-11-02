/** Shared by schema, insertion controls and inspector. */
export const buttonDefinition = {
  title: "Botão",
  propSchema: {
    href: { default: "/" },
    variant: { default: "primary", values: ["primary", "secondary"] as const },
  },
} as const

export const stackDefinition = {
  title: "Pilha",
  description: "Agrupe e alinhe textos, botões, imagens e outros blocos",
  propSchema: {
    direction: { default: "column", values: ["column", "row"] as const },
    gap: { default: "md", values: ["none", "sm", "md", "lg", "xl"] as const },
    justify: { default: "start", values: ["start", "center", "end", "between"] as const },
    align: { default: "stretch", values: ["start", "center", "end", "stretch"] as const },
    wrap: { default: true },
  },
} as const

export const propertyLabels: Record<string, string> = {
  appearance: "Aparência", alignment: "Alinhamento", spacing: "Espaçamento", radius: "Bordas",
  contentAlignment: "Alinhamento do conteúdo", verticalAlignment: "Alinhamento vertical", minHeight: "Altura mínima",
  direction: "Direção", gap: "Espaço", justify: "Distribuição", align: "Alinhamento", wrap: "Quebrar linha",
  href: "Destino", variant: "Variante", textAlignment: "Alinhamento do texto", textColor: "Cor do texto",
  backgroundColor: "Cor de fundo", level: "Nível do título", url: "URL", caption: "Legenda",
  name: "Nome", previewWidth: "Largura da imagem", checked: "Concluído", language: "Linguagem",
}
