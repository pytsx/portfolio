import { describe, expect, it } from "vitest"

import { commonBlockProps, columnsDefinition, sectionDefinition, stackDefinition, structureBoxProps, structureFlowProps } from "./component-registry"
import { editorSchema } from "./editor-schema"
import { getBlockFamily, getInspectorSections } from "./inspector-registry"

describe("property system", () => {
  it("inherits shared structure schemas instead of redefining properties", () => {
    expect(stackDefinition.propSchema.gap).toBe(structureFlowProps.gap)
    expect(stackDefinition.propSchema.align).toBe(structureFlowProps.align)
    expect(columnsDefinition.propSchema.gap).toBe(structureFlowProps.gap)
    expect(columnsDefinition.propSchema.align).toBe(structureFlowProps.align)
    expect(sectionDefinition.propSchema.surface).toBe(structureBoxProps.surface)
    expect(sectionDefinition.propSchema.radius).toBe(structureBoxProps.radius)
  })

  it("gives every custom block the shared common properties", () => {
    for (const blockType of ["button", "callout", "youtube", "pageCollection", "section", "columns", "column", "stack", "card"] as const) {
      const schema = editorSchema.blockSchema[blockType].propSchema
      expect(schema).toHaveProperty("backgroundColor")
      expect(schema).toHaveProperty("textColor")
      expect(schema).toHaveProperty("textAlignment")
    }
    expect(stackDefinition.propSchema.textAlignment).toBe(commonBlockProps.textAlignment)
  })

  it("gives every structure block the complete shared box capabilities", () => {
    for (const blockType of ["section", "columns", "column", "stack", "card"] as const) {
      const schema = editorSchema.blockSchema[blockType].propSchema
      for (const property of Object.keys(structureBoxProps)) expect(schema).toHaveProperty(property)
    }
  })

  it("groups every real schema property exactly once", () => {
    const schema = editorSchema.blockSchema.section.propSchema
    const sections = getInspectorSections(schema)
    const keys = sections.flatMap((section) => section.fields.map((field) => field.key))

    expect(new Set(keys).size).toBe(keys.length)
    expect(keys.sort()).toEqual(Object.keys(schema).sort())
    expect(sections.map((section) => section.label)).toEqual(expect.arrayContaining(["Estrutura", "Avançado"]))
  })

  it("aligns native blocks with common and specific property groups", () => {
    const sections = getInspectorSections(editorSchema.blockSchema.heading.propSchema, { editableContent: true })
    expect(sections.find((section) => section.id === "common")?.fields.map((field) => field.key)).toEqual(["textAlignment", "textColor", "backgroundColor"])
    expect(sections.find((section) => section.id === "typography")?.fields.map((field) => field.key)).toEqual(expect.arrayContaining(["level"]))
    expect(sections.find((section) => section.id === "typography")?.fields.map((field) => field.key)).toContain("$content")
    expect(getBlockFamily("heading")).toBe("Texto")
    expect(getBlockFamily("card")).toBe("Estrutura")
  })
})
