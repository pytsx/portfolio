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
  ],
  columns: [
    { key: "distribution", label: "Proporção", options: options("equal", "sidebar-left", "sidebar-right") },
    { key: "gap", label: "Espaço", options: options("sm", "md", "lg") },
    { key: "mobile", label: "Mobile", options: options("stack", "scroll") },
  ],
  hero: [
    { key: "eyebrow", label: "Etiqueta" }, { key: "title", label: "Título" }, { key: "description", label: "Descrição" },
    { key: "primaryLabel", label: "Botão principal" }, { key: "primaryHref", label: "Link principal" },
    { key: "secondaryLabel", label: "Botão secundário" }, { key: "secondaryHref", label: "Link secundário" },
    { key: "alignment", label: "Alinhamento", options: options("left", "center") },
    { key: "appearance", label: "Aparência", options: options("default", "muted", "gradient") },
  ],
  featureGrid: [
    { key: "title", label: "Título" }, { key: "description", label: "Descrição" },
    { key: "firstTitle", label: "Destaque 1" }, { key: "firstDescription", label: "Descrição 1" },
    { key: "secondTitle", label: "Destaque 2" }, { key: "secondDescription", label: "Descrição 2" },
    { key: "thirdTitle", label: "Destaque 3" }, { key: "thirdDescription", label: "Descrição 3" },
  ],
  callToAction: [
    { key: "title", label: "Título" }, { key: "description", label: "Descrição" },
    { key: "label", label: "Botão" }, { key: "href", label: "Link" },
    { key: "appearance", label: "Aparência", options: options("default", "inverted", "gradient") },
  ],
}
