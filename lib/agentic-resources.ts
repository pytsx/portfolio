import "server-only"

import { publicSiteSettings } from "@/lib/site-settings"
import { absoluteUrl, siteOrigin } from "@/lib/public/url"

type AgenticCatalogEntry = {
  identifier: string
  displayName: string
  type: string
  url: string
  description: string
  representativeQueries: string[]
  capabilities: string[]
}

function singleLine(value: string, fallback: string) {
  const normalized = value.replace(/\s+/g, " ").trim()
  return normalized || fallback
}

export async function getLlmsText() {
  const settings = await publicSiteSettings.get()
  const name = singleLine(settings.name, "Portfólio")
  const description = singleLine(settings.description, "Portfólio e publicações.")

  return `# ${name}

> ${description}

Este é um portfólio público organizado em páginas e grupos de conteúdo. Consulte os links abaixo para descobrir o site e os recursos disponíveis para agentes.

## Recursos principais

- [Página inicial](${absoluteUrl("/")})
- [Mapa do site](${absoluteUrl("/sitemap.xml")}): páginas públicas disponíveis.
- [Catálogo de recursos para agentes](${absoluteUrl("/ai-catalog.json")}): manifesto JSON das capacidades publicadas.
- [Robots.txt](${absoluteUrl("/robots.txt")}): regras de rastreamento.

## Opcional

- [Catálogo no caminho well-known](${absoluteUrl("/.well-known/ai-catalog.json")}): alias para descoberta compatível com ARD.
`
}

export async function getAiCatalog() {
  const settings = await publicSiteSettings.get()
  const name = singleLine(settings.name, "Portfólio")
  const description = singleLine(settings.description, "Portfólio e publicações.")
  const origin = siteOrigin()
  const entries: AgenticCatalogEntry[] = [
    {
      identifier: `urn:air:${new URL(origin).hostname}:website`,
      displayName: name,
      type: "text/html",
      url: `${origin}/`,
      description,
      representativeQueries: [
        "Quais conteúdos estão publicados neste portfólio?",
        "Quais projetos e publicações estão disponíveis?",
      ],
      capabilities: ["public-website", "portfolio-content"],
    },
    {
      identifier: `urn:air:${new URL(origin).hostname}:llms-txt`,
      displayName: `${name} - informações para agentes`,
      type: "text/markdown",
      url: absoluteUrl("/llms.txt"),
      description: "Resumo navegável do site e links para seus recursos públicos.",
      representativeQueries: [
        "Onde encontro um resumo deste site para um agente de IA?",
        "Quais são os recursos públicos deste site?",
      ],
      capabilities: ["site-discovery", "agent-guidance"],
    },
  ]

  return {
    "@context": "https://agenticresourcediscovery.org/context/v1",
    entries,
  }
}
