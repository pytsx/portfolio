import { describe, expect, it } from "vitest"

import { editorSchema } from "./editor-schema"

describe("editor schema", () => {
  it("registers every required native and custom block", () => {
    expect(Object.keys(editorSchema.blockSchema)).toEqual(
      expect.arrayContaining([
        "paragraph",
        "heading",
        "bulletListItem",
        "numberedListItem",
        "checkListItem",
        "quote",
        "divider",
        "callout",
        "toggleListItem",
        "codeBlock",
        "table",
        "image",
        "video",
        "youtube",
        "pageCollection",
      ]),
    )
  })

  it("derives callout properties from the real schema", () => {
    expect(editorSchema.blockSchema.callout.propSchema.tone.values).toEqual([
      "info",
      "warning",
      "success",
      "danger",
    ])
  })
})
