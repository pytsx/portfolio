import type { EditorDocument } from "../editor-types"

type LegacyBlock = { id?: string; type: string; props?: Record<string, unknown>; content?: unknown; children?: unknown[] }

function text(value: unknown, fallback = "") { return typeof value === "string" ? value : fallback }
function isBlock(value: unknown): value is LegacyBlock { return typeof value === "object" && value !== null && "type" in value && typeof value.type === "string" }
function migrateChildren(children: unknown): EditorDocument { return Array.isArray(children) ? children.filter(isBlock).map(migrateLegacyLayoutBlock) : [] }

/** Converts removed Hero blocks into equivalent layouts assembled from editor primitives. */
export function migrateLegacyLayoutBlock(block: LegacyBlock): EditorDocument[number] {
  const props = block.props ?? {}

  if (block.type === "heroLayout") {
    return {
      id: block.id, type: "section",
      props: {
        width: "wide",
        surface: props.appearance === "muted" ? "muted" : props.appearance === "default" ? "transparent" : "gradient",
        spacing: props.spacing === "sm" ? "md" : props.spacing === "md" ? "lg" : "xl",
        radius: props.radius === "md" ? "md" : props.radius === "none" ? "none" : "lg",
        contentAlignment: props.alignment === "center" ? "center" : "left",
        verticalAlignment: "center", minHeight: "large",
      },
      children: migrateChildren(block.children),
    } as EditorDocument[number]
  }

  if (block.type === "hero") {
    const alignment = props.alignment === "center" ? "center" : "left"
    const actions = [
      props.primaryLabel ? { type: "button", content: text(props.primaryLabel), props: { href: text(props.primaryHref, "/"), variant: "primary" } } : null,
      props.secondaryLabel ? { type: "button", content: text(props.secondaryLabel), props: { href: text(props.secondaryHref, "/"), variant: "secondary" } } : null,
    ].filter(Boolean)
    const content = [
      props.eyebrow ? { type: "paragraph", content: text(props.eyebrow) } : null,
      { type: "heading", props: { level: 1 }, content: text(props.title, "Uma página feita para causar impacto") },
      props.description ? { type: "paragraph", content: text(props.description) } : null,
      actions.length ? { type: "stack", props: { direction: "row", gap: "sm", justify: alignment === "center" ? "center" : "start", align: "center", wrap: true }, children: actions } : null,
      ...migrateChildren(block.children),
    ].filter(Boolean)

    return {
      id: block.id, type: "section",
      props: {
        width: "wide",
        surface: props.appearance === "muted" ? "muted" : props.appearance === "default" ? "transparent" : "gradient",
        spacing: "xl", radius: "lg", contentAlignment: alignment,
        verticalAlignment: "center", minHeight: "large",
      },
      children: [{
        type: "stack",
        props: { direction: "column", gap: "md", justify: "center", align: alignment === "center" ? "center" : "stretch", wrap: false },
        children: content,
      }],
    } as EditorDocument[number]
  }

  return { ...block, children: block.children === undefined ? undefined : migrateChildren(block.children) } as EditorDocument[number]
}

export function migrateLegacyEditorValue(value: unknown): unknown {
  return Array.isArray(value) ? value.filter(isBlock).map(migrateLegacyLayoutBlock) : value
}

export function duplicateWithoutIds(block: EditorDocument[number]): EditorDocument[number] {
  const copy = { ...block }
  delete copy.id
  if (copy.children) copy.children = copy.children.map(duplicateWithoutIds)
  return copy
}
