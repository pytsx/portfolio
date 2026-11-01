import { createReactBlockSpec } from "@blocknote/react"

import {
  CallToActionSection,
  FeatureGridSection,
  HeroSection,
  type CallToActionSectionProps,
  type FeatureGridSectionProps,
  type HeroSectionProps,
} from "../components/web-page-sections"

type EditableBlock = { props: Record<string, string> }

type EditableBlockEditor = {
  isEditable: boolean
  updateBlock(block: EditableBlock, update: { props: Record<string, string> }): void
}

type WebBlockProperties = Record<string, string>

function WebBlockFields({
  block,
  editor,
  fields,
}: {
  block: EditableBlock
  editor: EditableBlockEditor
  fields: Array<{ label: string; name: string; type?: "select" | "text" }>
}) {
  if (!editor.isEditable) return null

  function updateProperty(name: string, value: string) {
    editor.updateBlock(block, { props: { [name]: value } })
  }

  return (
    <div className="editor-web-block-fields" contentEditable={false}>
      {fields.map((field) => (
        <label key={field.name}>
          <span>{field.label}</span>
          {field.type === "select" ? (
            <select value={block.props[field.name] ?? ""} onChange={(event) => updateProperty(field.name, event.currentTarget.value)}>
              {field.name === "alignment" ? <><option value="left">À esquerda</option><option value="center">Centralizado</option></> : null}
              {field.name === "appearance" ? <><option value="default">Padrão</option><option value="muted">Suave</option><option value="gradient">Gradiente</option><option value="inverted">Invertido</option></> : null}
            </select>
          ) : (
            <input value={block.props[field.name] ?? ""} onChange={(event) => updateProperty(field.name, event.currentTarget.value)} />
          )}
        </label>
      ))}
    </div>
  )
}

function asHeroProps(props: WebBlockProperties): HeroSectionProps {
  return {
    eyebrow: props.eyebrow ?? "",
    title: props.title ?? "",
    description: props.description ?? "",
    primaryLabel: props.primaryLabel ?? "",
    primaryHref: props.primaryHref ?? "",
    secondaryLabel: props.secondaryLabel ?? "",
    secondaryHref: props.secondaryHref ?? "",
    alignment: props.alignment === "center" ? "center" : "left",
    appearance: props.appearance === "gradient" ? "gradient" : props.appearance === "muted" ? "muted" : "default",
    preview: true,
  }
}

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

const HERO_FIELDS = [
  { name: "eyebrow", label: "Etiqueta" }, { name: "title", label: "Título" }, { name: "description", label: "Descrição" },
  { name: "primaryLabel", label: "Botão principal" }, { name: "primaryHref", label: "Link principal" }, { name: "secondaryLabel", label: "Botão secundário" }, { name: "secondaryHref", label: "Link secundário" },
  { name: "alignment", label: "Alinhamento", type: "select" as const }, { name: "appearance", label: "Aparência", type: "select" as const },
]

const FEATURE_FIELDS = [
  { name: "title", label: "Título" }, { name: "description", label: "Descrição" },
  { name: "firstTitle", label: "Destaque 1" }, { name: "firstDescription", label: "Descrição 1" },
  { name: "secondTitle", label: "Destaque 2" }, { name: "secondDescription", label: "Descrição 2" },
  { name: "thirdTitle", label: "Destaque 3" }, { name: "thirdDescription", label: "Descrição 3" },
]

const CTA_FIELDS = [
  { name: "title", label: "Título" }, { name: "description", label: "Descrição" }, { name: "label", label: "Botão" }, { name: "href", label: "Link" },
  { name: "appearance", label: "Aparência", type: "select" as const },
]

export const heroBlock = createReactBlockSpec(
  { type: "hero", propSchema: { eyebrow: { default: "Portfólio" }, title: { default: "Uma página feita para causar impacto" }, description: { default: "Transforme ideias em uma presença digital clara e memorável." }, primaryLabel: { default: "Começar" }, primaryHref: { default: "/" }, secondaryLabel: { default: "Saiba mais" }, secondaryHref: { default: "#" }, alignment: { default: "left", values: ["left", "center"] as const }, appearance: { default: "gradient", values: ["default", "muted", "gradient"] as const } }, content: "none" },
  { render: ({ block, editor }) => <div className="editor-web-block"><HeroSection {...asHeroProps(block.props)} /><WebBlockFields block={block as unknown as EditableBlock} editor={editor as unknown as EditableBlockEditor} fields={HERO_FIELDS} /></div> },
)()

export const featureGridBlock = createReactBlockSpec(
  { type: "featureGrid", propSchema: { title: { default: "O que torna este trabalho especial" }, description: { default: "Apresente os diferenciais que sustentam a sua proposta." }, firstTitle: { default: "Estratégia" }, firstDescription: { default: "Decisões guiadas por contexto e objetivo." }, secondTitle: { default: "Design" }, secondDescription: { default: "Interfaces claras, expressivas e acessíveis." }, thirdTitle: { default: "Tecnologia" }, thirdDescription: { default: "Implementação sólida e preparada para evoluir." } }, content: "none" },
  { render: ({ block, editor }) => <div className="editor-web-block"><FeatureGridSection {...asFeatureGridProps(block.props)} /><WebBlockFields block={block as unknown as EditableBlock} editor={editor as unknown as EditableBlockEditor} fields={FEATURE_FIELDS} /></div> },
)()

export const callToActionBlock = createReactBlockSpec(
  { type: "callToAction", propSchema: { title: { default: "Vamos construir algo juntos?" }, description: { default: "Entre em contato para conversar sobre o próximo projeto." }, label: { default: "Entrar em contato" }, href: { default: "/contato" }, appearance: { default: "gradient", values: ["default", "inverted", "gradient"] as const } }, content: "none" },
  { render: ({ block, editor }) => <div className="editor-web-block"><CallToActionSection {...asCallToActionProps(block.props)} /><WebBlockFields block={block as unknown as EditableBlock} editor={editor as unknown as EditableBlockEditor} fields={CTA_FIELDS} /></div> },
)()
