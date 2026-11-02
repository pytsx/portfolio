import type { EditorDocument } from "../editor-types"

type FeatureGridContent = {
  title?: string; description?: string
  firstTitle?: string; firstDescription?: string
  secondTitle?: string; secondDescription?: string
  thirdTitle?: string; thirdDescription?: string
}

type CallToActionContent = {
  title?: string; description?: string; label?: string; href?: string; appearance?: string
}

function featureCard(title: string, description: string): EditorDocument[number] {
  return {
    type: "column",
    children: [{
      type: "card",
      props: { surface: "card", padding: "md", radius: "md", border: "subtle", shadow: "sm" },
      children: [{
        type: "stack",
        props: { direction: "column", gap: "sm", justify: "start", align: "stretch", wrap: false },
        children: [
          { type: "heading", props: { level: 3 }, content: title },
          { type: "paragraph", content: description },
        ],
      }],
    }],
  } as EditorDocument[number]
}

/** Preset only: every piece of content remains an ordinary inline-editable block. */
export function createFeatureGridTemplate(content: FeatureGridContent = {}): EditorDocument[number] {
  return {
    type: "section",
    props: { width: "wide", surface: "transparent", padding: "lg", radius: "none", contentAlignment: "left", verticalAlignment: "start", minHeight: "auto" },
    children: [{
      type: "stack",
      props: { direction: "column", gap: "lg", justify: "start", align: "stretch", wrap: false },
      children: [
        {
          type: "stack",
          props: { direction: "column", gap: "sm", justify: "start", align: "stretch", wrap: false },
          children: [
            { type: "heading", props: { level: 2 }, content: content.title ?? "O que torna este trabalho especial" },
            { type: "paragraph", content: content.description ?? "Apresente os diferenciais que sustentam a sua proposta." },
          ],
        },
        {
          type: "columns",
          props: { distribution: "equal", gap: "md", mobile: "stack", align: "stretch" },
          children: [
            featureCard(content.firstTitle ?? "Estratégia", content.firstDescription ?? "Decisões guiadas por contexto e objetivo."),
            featureCard(content.secondTitle ?? "Design", content.secondDescription ?? "Interfaces claras, expressivas e acessíveis."),
            featureCard(content.thirdTitle ?? "Tecnologia", content.thirdDescription ?? "Implementação sólida e preparada para evoluir."),
          ],
        },
      ],
    }],
  } as EditorDocument[number]
}

/** Preset only: title, description and action are native editable children. */
export function createCallToActionTemplate(content: CallToActionContent = {}): EditorDocument[number] {
  const surface = content.appearance === "inverted" ? "contrast" : content.appearance === "default" ? "muted" : "gradient"
  return {
    type: "section",
    props: { width: "wide", surface, padding: "lg", radius: "lg", contentAlignment: "left", verticalAlignment: "center", minHeight: "auto" },
    children: [{
      type: "columns",
      props: { distribution: "sidebar-right", gap: "lg", mobile: "stack", align: "center" },
      children: [
        {
          type: "column",
          children: [{
            type: "stack",
            props: { direction: "column", gap: "sm", justify: "start", align: "stretch", wrap: false },
            children: [
              { type: "heading", props: { level: 2 }, content: content.title ?? "Vamos construir algo juntos?" },
              { type: "paragraph", content: content.description ?? "Entre em contato para conversar sobre o próximo projeto." },
            ],
          }],
        },
        {
          type: "column",
          children: [{ type: "button", props: { href: content.href ?? "/contato", variant: "primary" }, content: content.label ?? "Entrar em contato" }],
        },
      ],
    }],
  } as EditorDocument[number]
}
