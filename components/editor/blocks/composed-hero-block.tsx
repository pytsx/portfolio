import { createReactBlockSpec } from "@blocknote/react"
import { heroDefinition, buttonDefinition } from "../component-registry"
import { ComposedHero } from "../components/composed-hero"

export const composedHeroBlock = createReactBlockSpec({
  type: "heroLayout", propSchema: heroDefinition.propSchema, content: "none",
  layoutOnly: true, children: heroDefinition.children,
}, {
  renderFrame: ({ block, slotRef }) => <ComposedHero props={block.props}><div ref={slotRef} /></ComposedHero>,
})()

export const buttonBlock = createReactBlockSpec({
  type: "button", propSchema: buttonDefinition.propSchema, content: "inline",
}, {
  render: ({ block, contentRef }) => <div className="builder-button" data-variant={block.props.variant}><span ref={contentRef} /></div>,
})()
