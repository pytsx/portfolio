import { createReactBlockSpec } from "@blocknote/react"
import { buttonDefinition } from "../component-registry"

export const buttonBlock = createReactBlockSpec({
  type: "button", propSchema: buttonDefinition.propSchema, content: "inline",
}, {
  render: ({ block, contentRef }) => <div className="builder-button" data-variant={block.props.variant}><span ref={contentRef} /></div>,
})()
