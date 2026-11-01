import { createReactBlockSpec } from "@blocknote/react"

import { PageColumn, PageColumns, PageSection } from "../components/page-layouts"

export const sectionBlock = createReactBlockSpec(
  {
    type: "section",
    propSchema: {
      width: { default: "wide", values: ["narrow", "standard", "wide", "full"] as const },
      surface: { default: "transparent", values: ["transparent", "muted", "contrast", "gradient"] as const },
      spacing: { default: "lg", values: ["sm", "md", "lg", "xl"] as const },
      radius: { default: "none", values: ["none", "md", "lg"] as const },
      anchor: { default: "" },
      effect: { default: "none", values: ["none", "fade", "slide"] as const },
    },
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
    propSchema: {},
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
    propSchema: {
      distribution: { default: "equal", values: ["equal", "sidebar-left", "sidebar-right"] as const },
      gap: { default: "md", values: ["sm", "md", "lg"] as const },
      mobile: { default: "stack", values: ["stack", "scroll"] as const },
    },
    content: "none",
    layoutOnly: true,
    children: { allow: ["column"] as const, min: 2 },
  },
  {
    renderFrame: ({ block, slotRef }) => <PageColumns properties={block.props} editor><div ref={slotRef} /></PageColumns>,
  },
)()
