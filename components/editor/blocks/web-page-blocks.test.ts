import { describe, expect, it } from "vitest"

import type { EditorDocument } from "../editor-types"
import { createCallToActionTemplate, createFeatureGridTemplate } from "./web-page-blocks"

function flatten(block: EditorDocument[number]): EditorDocument {
  return [block, ...(block.children ?? []).flatMap(flatten)]
}

describe("web page templates", () => {
  it("builds a feature grid exclusively from reusable editable blocks", () => {
    const blocks = flatten(createFeatureGridTemplate())
    const types = blocks.map((block) => block.type)

    expect(types).toEqual(expect.arrayContaining(["section", "stack", "columns", "column", "card", "heading", "paragraph"]))
    expect(types).not.toContain("featureGrid")
    expect(blocks.filter((block) => block.type === "heading")).toHaveLength(4)
  })

  it("builds a call to action with native inline content and a reusable button", () => {
    const blocks = flatten(createCallToActionTemplate())
    const types = blocks.map((block) => block.type)

    expect(types).toEqual(expect.arrayContaining(["section", "columns", "stack", "heading", "paragraph", "button"]))
    expect(types).not.toContain("callToAction")
  })
})
