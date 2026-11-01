import { createReactBlockSpec } from "@blocknote/react"

const CALLOUT_TONES = ["info", "warning", "success", "danger"] as const

export const calloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      icon: { default: "💡" },
      tone: {
        default: "info",
        values: CALLOUT_TONES,
      },
    },
    content: "inline",
  },
  {
    render: ({ block, contentRef }) => (
      <aside
        className="editor-callout"
        data-tone={block.props.tone}
        role="note"
      >
        <span className="editor-callout-icon" contentEditable={false}>
          {block.props.icon}
        </span>
        <div ref={contentRef} className="min-w-0 flex-1" />
      </aside>
    ),
    toExternalHTML: ({ block, contentRef }) => (
      <aside className="editor-callout" data-tone={block.props.tone}>
        <span className="editor-callout-icon">{block.props.icon}</span>
        <div ref={contentRef} />
      </aside>
    ),
  },
)()
