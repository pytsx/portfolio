import type { ReactNode } from "react"
import { heroDefinition } from "../component-registry"

export function ComposedHero({ props, children }: { props: Record<string, unknown>; children: ReactNode }) {
  const defaults = heroDefinition.propSchema
  return <section className="composed-hero" data-appearance={props.appearance ?? defaults.appearance.default} data-alignment={props.alignment ?? defaults.alignment.default} data-spacing={props.spacing ?? defaults.spacing.default} data-radius={props.radius ?? defaults.radius.default}>{children}</section>
}
