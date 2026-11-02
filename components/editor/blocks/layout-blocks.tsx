import { createReactBlockSpec } from "@blocknote/react"

import { PageCard, PageColumn, PageColumns, PageSection, PageStack } from "../components/page-layouts"
import { cardDefinition, columnsDefinition, commonBlockProps, sectionDefinition, stackDefinition } from "../component-registry"

export const sectionBlock = createReactBlockSpec(
  {
    type: "section",
    propSchema: sectionDefinition.propSchema,
    content: "none",
    layoutOnly: true,
    children: { allow: "blocks", exclude: ["section"] as const },
  },
  {
    renderFrame: ({ block, slotRef }) => (
      <PageSection properties={block.props} editor>
        <div ref={slotRef} />
      </PageSection>
    ),
  },
)()

export const columnBlock = createReactBlockSpec(
  {
    type: "column",
    propSchema: commonBlockProps,
    content: "none",
    layoutOnly: true,
    placeable: "namedOnly",
    children: { allow: "blocks", exclude: ["columns"] as const },
  },
  {
    renderFrame: ({ slotRef }) => <PageColumn editor><div ref={slotRef} /></PageColumn>,
  },
)()

export const columnsBlock = createReactBlockSpec(
  {
    type: "columns",
    propSchema: columnsDefinition.propSchema,
    content: "none",
    layoutOnly: true,
    children: { allow: ["column"] as const, min: 2 },
  },
  {
    renderFrame: ({ block, slotRef }) => <PageColumns properties={block.props} editor><div ref={slotRef} /></PageColumns>,
  },
)()

export const stackBlock = createReactBlockSpec(
  {
    type: "stack", propSchema: stackDefinition.propSchema, content: "none",
    layoutOnly: true, children: { allow: "blocks", exclude: ["section"] as const },
  },
  { renderFrame: ({ block, slotRef }) => <PageStack properties={block.props} editor><div ref={slotRef} /></PageStack> },
)()

export const cardBlock = createReactBlockSpec(
  {
    type: "card", propSchema: cardDefinition.propSchema, content: "none",
    layoutOnly: true, children: { allow: "blocks", exclude: ["section", "columns"] as const },
  },
  { renderFrame: ({ block, slotRef }) => <PageCard properties={block.props} editor><div ref={slotRef} /></PageCard> },
)()
