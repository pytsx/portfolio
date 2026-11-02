type PropertyOption = { label: string; value: string }
type SchemaProperty = { default: unknown; type?: "string" | "number" | "boolean"; values?: readonly (string | number | boolean)[] }

export type PropertyField = {
  key: string
  label: string
  description?: string
  defaultValue: unknown
  kind: "text" | "number" | "boolean" | "select"
  options?: PropertyOption[]
}

export type PropertySection = {
  id: string
  label: string
  fields: PropertyField[]
}

const PROPERTY_META: Record<string, { label: string; description?: string }> = {
  textAlignment: { label: "Alinhamento", description: "Alinhamento do conteúdo textual" },
  textColor: { label: "Cor do texto" },
  backgroundColor: { label: "Cor de fundo" },
  width: { label: "Largura" },
  surface: { label: "Superfície" },
  spacing: { label: "Espaçamento externo" },
  padding: { label: "Preenchimento" },
  radius: { label: "Raio" },
  border: { label: "Contorno" },
  shadow: { label: "Sombra" },
  direction: { label: "Direção" },
  distribution: { label: "Distribuição" },
  gap: { label: "Espaço entre itens" },
  justify: { label: "Distribuir" },
  align: { label: "Alinhar itens" },
  wrap: { label: "Quebrar linha" },
  contentAlignment: { label: "Alinhamento do conteúdo" },
  verticalAlignment: { label: "Alinhamento vertical" },
  minHeight: { label: "Altura mínima" },
  mobile: { label: "Comportamento mobile" },
  level: { label: "Nível" },
  checked: { label: "Concluído" },
  language: { label: "Linguagem" },
  url: { label: "URL" },
  name: { label: "Nome" },
  caption: { label: "Legenda" },
  showPreview: { label: "Mostrar prévia" },
  previewWidth: { label: "Largura da prévia" },
  href: { label: "Destino" },
  variant: { label: "Variante" },
  groupId: { label: "Grupo" },
  query: { label: "Filtro de título" },
  limit: { label: "Limite" },
  layout: { label: "Layout" },
  displayMode: { label: "Modo de edição" },
  visibility: { label: "Visibilidade" },
  homeOnly: { label: "Somente principal" },
  anchor: { label: "Âncora" },
  effect: { label: "Efeito" },
  icon: { label: "Ícone" },
  tone: { label: "Tom" },
  start: { label: "Início da numeração" },
  isToggleable: { label: "Recolhível" },
}

const OPTION_LABELS: Record<string, string> = {
  none: "Nenhum", default: "Padrão", transparent: "Transparente", card: "Card",
  muted: "Suave", contrast: "Contraste", gradient: "Gradiente",
  left: "Esquerda", center: "Centro", right: "Direita", justify: "Justificado",
  start: "Início", end: "Fim", between: "Entre", stretch: "Esticar",
  column: "Vertical", row: "Horizontal", equal: "Iguais",
  "sidebar-left": "Lateral esquerda", "sidebar-right": "Lateral direita",
  stack: "Empilhar", scroll: "Rolagem", primary: "Primário", secondary: "Secundário",
  grid: "Grade", list: "Lista", database: "Banco de dados", preview: "Prévia",
  all: "Todas", public: "Públicas", private: "Privadas",
  info: "Informação", warning: "Aviso", success: "Sucesso", danger: "Perigo",
  narrow: "Estreita", standard: "Padrão", wide: "Larga", full: "Total",
  auto: "Automática", large: "Grande", screen: "Tela inteira",
  sm: "Pequeno", md: "Médio", lg: "Grande", xl: "Extra grande",
  gray: "Cinza", brown: "Marrom", red: "Vermelho", orange: "Laranja", yellow: "Amarelo",
  green: "Verde", blue: "Azul", purple: "Roxo", pink: "Rosa",
}

const PROPERTY_OPTION_VALUES: Record<string, readonly string[]> = {
  textColor: ["default", "gray", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink"],
  backgroundColor: ["default", "gray", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink"],
}

const SECTION_DEFINITIONS = [
  { id: "common", label: "Comum", keys: ["textAlignment", "textColor", "backgroundColor"] },
  { id: "structure", label: "Estrutura", keys: ["width", "surface", "spacing", "padding", "radius", "border", "shadow", "direction", "distribution", "gap", "justify", "align", "wrap", "contentAlignment", "verticalAlignment", "minHeight", "mobile"] },
  { id: "typography", label: "Tipografia e texto", keys: ["level", "checked", "language", "start", "isToggleable"] },
  { id: "media", label: "Mídia", keys: ["url", "name", "caption", "showPreview", "previewWidth"] },
  { id: "link", label: "Link", keys: ["href", "variant"] },
  { id: "data", label: "Dados", keys: ["groupId", "query", "limit", "layout", "displayMode", "visibility", "homeOnly"] },
  { id: "advanced", label: "Avançado", keys: ["anchor", "effect", "icon", "tone"] },
] as const

const BLOCK_FAMILIES: Record<string, string> = {
  section: "Estrutura", columns: "Estrutura", column: "Estrutura", stack: "Estrutura", card: "Estrutura",
  paragraph: "Texto", heading: "Texto", bulletListItem: "Texto", numberedListItem: "Texto", checkListItem: "Texto", quote: "Texto", codeBlock: "Texto", button: "Ação",
  image: "Mídia", video: "Mídia", audio: "Mídia", file: "Mídia", youtube: "Mídia",
  callout: "Conteúdo", pageCollection: "Dados",
}

function fieldFromSchema(key: string, definition: SchemaProperty): PropertyField {
  const meta = PROPERTY_META[key] ?? { label: key }
  const optionValues = definition.values ?? PROPERTY_OPTION_VALUES[key]
  const options = optionValues?.map((value) => ({
    value: String(value),
    label: OPTION_LABELS[String(value)] ?? String(value),
  }))
  return {
    key, label: meta.label, description: meta.description, defaultValue: definition.default,
    kind: options ? "select" : definition.type === "boolean" || typeof definition.default === "boolean" ? "boolean" : definition.type === "number" || typeof definition.default === "number" ? "number" : "text",
    options,
  }
}

export function getBlockFamily(blockType: string) {
  return BLOCK_FAMILIES[blockType] ?? "Bloco"
}

export function getInspectorSections(schema: Record<string, SchemaProperty>): PropertySection[] {
  const remaining = new Set(Object.keys(schema))
  const sections: PropertySection[] = SECTION_DEFINITIONS.flatMap((section) => {
    const fields = section.keys.filter((key) => remaining.delete(key)).map((key) => fieldFromSchema(key, schema[key]))
    return fields.length > 0 ? [{ id: section.id, label: section.label, fields }] : []
  })
  const specific = [...remaining].map((key) => fieldFromSchema(key, schema[key]))
  if (specific.length > 0) sections.push({ id: "specific", label: "Específico do bloco", fields: specific })
  return sections
}
