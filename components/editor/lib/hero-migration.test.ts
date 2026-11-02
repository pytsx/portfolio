import { describe, expect, it } from "vitest"
import { migrateHero, duplicateWithoutIds } from "./hero-migration"
import { parseImportedEditorDocument, createEditorDocumentExport } from "./transfer"

describe("composed Hero", () => {
  it("preserves legacy text, destinations and identity during explicit conversion", () => {
    const result = migrateHero({ id: "hero-1", type: "hero", props: { title: "Título", description: "Texto", primaryLabel: "Contato", primaryHref: "/contato", secondaryLabel: "Projetos", secondaryHref: "/projetos" } })
    expect(result.id).toBe("hero-1")
    expect(result.type).toBe("heroLayout")
    expect(result.children).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "heading", content: "Título" }),
      expect.objectContaining({ type: "button", content: "Contato", props: { href: "/contato", variant: "primary" } }),
    ]))
    expect(parseImportedEditorDocument(JSON.parse(createEditorDocumentExport([result])))).toEqual([result])
  })
  it("duplicates a subtree without reusing any IDs or altering the source", () => {
    const original = { id: "parent", type: "heroLayout" as const, children: [{ id: "child", type: "paragraph" as const, content: "Texto" }] }
    const result = duplicateWithoutIds(original)
    expect(result.id).toBeUndefined()
    expect(result.children?.[0].id).toBeUndefined()
    expect(original.children[0].id).toBe("child")
  })
})
