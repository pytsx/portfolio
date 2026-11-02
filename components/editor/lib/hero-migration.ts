import type { EditorDocument } from "../editor-types"

/** Explicit conversion preserves the original block ID and existing children. */
export function migrateHero(block: EditorDocument[number]): EditorDocument[number] {
  if (block.type !== "hero") return block
  const props = block.props ?? {}
  return {
    id: block.id, type: "heroLayout",
    props: { alignment: props.alignment ?? "left", appearance: props.appearance ?? "gradient" },
    children: [
      ...(props.eyebrow ? [{ type: "paragraph" as const, content: props.eyebrow }] : []),
      { type: "heading", props: { level: 1 }, content: props.title ?? "Uma página feita para causar impacto" },
      { type: "paragraph", content: props.description ?? "" },
      ...(props.primaryLabel ? [{ type: "button" as const, content: props.primaryLabel, props: { href: props.primaryHref ?? "/", variant: "primary" as const } }] : []),
      ...(props.secondaryLabel ? [{ type: "button" as const, content: props.secondaryLabel, props: { href: props.secondaryHref ?? "/", variant: "secondary" as const } }] : []),
      ...(block.children ?? []),
    ],
  }
}

export function duplicateWithoutIds(block: EditorDocument[number]): EditorDocument[number] {
  const copy = { ...block }
  delete copy.id
  if (copy.children) copy.children = copy.children.map(duplicateWithoutIds)
  return copy
}
