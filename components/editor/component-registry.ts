/** Shared by schema, insertion controls, inspector and public rendering. */
export const heroDefinition = {
  title: "Hero editável",
  description: "Título rico, texto, botões e imagem em blocos independentes",
  propSchema: {
    appearance: { default: "gradient", values: ["default", "muted", "gradient"] as const },
    alignment: { default: "left", values: ["left", "center"] as const },
    spacing: { default: "lg", values: ["sm", "md", "lg"] as const },
    radius: { default: "lg", values: ["none", "md", "lg"] as const },
  },
  children: { allow: "blocks", exclude: ["heroLayout", "section", "columns"] as const },
} as const

export const buttonDefinition = {
  title: "Botão",
  propSchema: {
    href: { default: "/" },
    variant: { default: "primary", values: ["primary", "secondary"] as const },
  },
} as const

export const propertyLabels: Record<string, string> = {
  appearance: "Aparência", alignment: "Alinhamento", spacing: "Espaçamento", radius: "Bordas",
  href: "Destino", variant: "Variante", textAlignment: "Alinhamento do texto", textColor: "Cor do texto",
  backgroundColor: "Cor de fundo", level: "Nível do título", url: "URL", caption: "Legenda",
  name: "Nome", previewWidth: "Largura da imagem", checked: "Concluído", language: "Linguagem",
}

export function heroPreset() {
  return {
    type: "heroLayout" as const,
    children: [
      { type: "heading" as const, props: { level: 1 as const }, content: "Uma página feita para causar impacto" },
      { type: "paragraph" as const, content: "Escreva sua apresentação aqui. Selecione o texto para formatar." },
      { type: "button" as const, content: "Começar", props: { href: "/" } },
      { type: "image" as const },
    ],
  }
}
