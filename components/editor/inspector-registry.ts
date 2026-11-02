type PropertyOption = { label: string; value: string }
export type PropertyField = {
  key: string
  label: string
  options?: PropertyOption[]
}

const options = (...values: string[]): PropertyOption[] => values.map((value) => ({
  label: value.replaceAll("-", " ").replace(/^./, (character) => character.toLocaleUpperCase("pt-BR")),
  value,
}))

export const inspectorFields: Record<string, PropertyField[]> = {
  section: [
    { key: "width", label: "Largura", options: options("narrow", "standard", "wide", "full") },
    { key: "surface", label: "Fundo", options: options("transparent", "muted", "contrast", "gradient") },
    { key: "spacing", label: "Espaçamento", options: options("sm", "md", "lg", "xl") },
    { key: "radius", label: "Bordas", options: options("none", "md", "lg") },
    { key: "effect", label: "Efeito", options: options("none", "fade", "slide") },
    { key: "anchor", label: "Âncora" },
    { key: "contentAlignment", label: "Conteúdo", options: options("left", "center", "right") },
    { key: "verticalAlignment", label: "Vertical", options: options("start", "center", "end") },
    { key: "minHeight", label: "Altura mínima", options: options("auto", "large", "screen") },
  ],
  columns: [
    { key: "distribution", label: "Proporção", options: options("equal", "sidebar-left", "sidebar-right") },
    { key: "gap", label: "Espaço", options: options("sm", "md", "lg") },
    { key: "mobile", label: "Mobile", options: options("stack", "scroll") },
    { key: "align", label: "Alinhamento", options: options("start", "center", "end", "stretch") },
  ],
  card: [
    { key: "surface", label: "Fundo", options: options("transparent", "card", "muted", "contrast") },
    { key: "padding", label: "Preenchimento", options: options("sm", "md", "lg") },
    { key: "radius", label: "Bordas", options: options("none", "sm", "md", "lg") },
    { key: "border", label: "Contorno", options: options("none", "subtle") },
    { key: "shadow", label: "Sombra", options: options("none", "sm", "md") },
  ],
}
