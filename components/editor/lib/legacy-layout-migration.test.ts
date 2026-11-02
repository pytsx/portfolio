import { describe, expect, it } from "vitest"

import type { EditorDocument } from "../editor-types"
import { duplicateWithoutIds, migrateLegacyEditorValue } from "./legacy-layout-migration"

function types(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((block) => {
    if (!block || typeof block !== "object" || !("type" in block)) return []
    const item = block as { type: string; children?: unknown }
    return [item.type, ...types(item.children)]
  })
}

describe("legacy layout migration", () => {
  it("turns a static Hero into composable layout primitives", () => {
    const migrated = migrateLegacyEditorValue([{
      id: "hero-1",
      type: "hero",
      props: {
        eyebrow: "Estúdio",
        title: "Produtos digitais",
        description: "Experiências rápidas.",
        primaryLabel: "Conversar",
        primaryHref: "/contato",
        alignment: "center",
      },
    }])

    expect(types(migrated)).toEqual(expect.arrayContaining(["section", "stack", "heading", "paragraph", "button"]))
    expect(types(migrated)).not.toEqual(expect.arrayContaining(["hero", "heroLayout"]))
  })

  it("turns an editable Hero wrapper into a section and keeps its children", () => {
    const migrated = migrateLegacyEditorValue([{
      type: "heroLayout",
      props: { alignment: "center", appearance: "muted" },
      children: [{ type: "heading", content: "Título" }],
    }]) as EditorDocument

    expect(migrated[0]?.type).toBe("section")
    expect(migrated[0]?.children?.[0]?.type).toBe("heading")
  })

  it("duplicates nested blocks without preserving identifiers", () => {
    const copy = duplicateWithoutIds({
      id: "section-1", type: "section",
      children: [{ id: "text-1", type: "paragraph", content: "Texto" }],
    } as EditorDocument[number])

    expect(copy.id).toBeUndefined()
    expect(copy.children?.[0]?.id).toBeUndefined()
  })

  it("turns legacy web sections into editable compositions", () => {
    const migrated = migrateLegacyEditorValue([
      { type: "featureGrid", props: { title: "Diferenciais", firstTitle: "Estratégia" } },
      { type: "callToAction", props: { title: "Vamos conversar", label: "Contato", href: "/contato" } },
    ])

    expect(types(migrated)).toEqual(expect.arrayContaining(["section", "columns", "card", "heading", "paragraph", "button"]))
    expect(types(migrated)).not.toEqual(expect.arrayContaining(["featureGrid", "callToAction"]))
  })
})
