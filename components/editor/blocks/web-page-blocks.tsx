import { createReactBlockSpec } from "@blocknote/react"

import {
  CallToActionSection,
  FeatureGridSection,
  type CallToActionSectionProps,
  type FeatureGridSectionProps,
} from "../components/web-page-sections"

type WebBlockProperties = Record<string, string>

function asFeatureGridProps(props: WebBlockProperties): FeatureGridSectionProps {
  return {
    title: props.title ?? "",
    description: props.description ?? "",
    firstTitle: props.firstTitle ?? "",
    firstDescription: props.firstDescription ?? "",
    secondTitle: props.secondTitle ?? "",
    secondDescription: props.secondDescription ?? "",
    thirdTitle: props.thirdTitle ?? "",
    thirdDescription: props.thirdDescription ?? "",
    preview: true,
  }
}

function asCallToActionProps(props: WebBlockProperties): CallToActionSectionProps {
  return {
    title: props.title ?? "",
    description: props.description ?? "",
    label: props.label ?? "",
    href: props.href ?? "",
    appearance: props.appearance === "gradient" ? "gradient" : props.appearance === "inverted" ? "inverted" : "default",
    preview: true,
  }
}

export const featureGridBlock = createReactBlockSpec(
  { type: "featureGrid", propSchema: { title: { default: "O que torna este trabalho especial" }, description: { default: "Apresente os diferenciais que sustentam a sua proposta." }, firstTitle: { default: "Estratégia" }, firstDescription: { default: "Decisões guiadas por contexto e objetivo." }, secondTitle: { default: "Design" }, secondDescription: { default: "Interfaces claras, expressivas e acessíveis." }, thirdTitle: { default: "Tecnologia" }, thirdDescription: { default: "Implementação sólida e preparada para evoluir." } }, content: "none" },
  { render: ({ block }) => <div className="editor-web-block"><FeatureGridSection {...asFeatureGridProps(block.props)} /></div> },
)()

export const callToActionBlock = createReactBlockSpec(
  { type: "callToAction", propSchema: { title: { default: "Vamos construir algo juntos?" }, description: { default: "Entre em contato para conversar sobre o próximo projeto." }, label: { default: "Entrar em contato" }, href: { default: "/contato" }, appearance: { default: "gradient", values: ["default", "inverted", "gradient"] as const } }, content: "none" },
  { render: ({ block }) => <div className="editor-web-block"><CallToActionSection {...asCallToActionProps(block.props)} /></div> },
)()
