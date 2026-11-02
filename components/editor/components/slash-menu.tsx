import {
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core/extensions"
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react"
import { AlignJustify, Columns3, FileStack, FileVideoCamera, Lightbulb, PanelsTopLeft, Send, SquareDashed } from "lucide-react"

import type { editorSchema } from "../editor-schema"
import { buttonDefinition, cardDefinition, stackDefinition } from "../component-registry"
import { createCallToActionTemplate, createFeatureGridTemplate } from "../blocks/web-page-blocks"

type EditorInstance = typeof editorSchema.BlockNoteEditor

export function EditorSlashMenu({ editor }: { editor: EditorInstance }) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(editor),
            {
              title: buttonDefinition.title, aliases: ["button", "link"], group: "Página web",
              icon: <Send className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, { type: "button", content: "Saiba mais" }),
            },
            {
              title: "Seção",
              subtext: "Agrupe blocos com largura, fundo e espaçamento",
              aliases: ["seção", "section", "container", "layout"],
              group: "Estrutura",
              icon: <SquareDashed className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, {
                type: "section",
                children: [{ type: "paragraph" }],
              }),
            },
            {
              title: stackDefinition.title,
              subtext: stackDefinition.description,
              aliases: ["pilha", "stack", "flex", "grupo", "alinhar"],
              group: "Estrutura",
              icon: <AlignJustify className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, {
                type: "stack",
                children: [{ type: "paragraph" }],
              }),
            },
            {
              title: cardDefinition.title,
              subtext: cardDefinition.description,
              aliases: ["card", "cartão", "caixa", "container"],
              group: "Estrutura",
              icon: <PanelsTopLeft className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, {
                type: "card",
                children: [{ type: "paragraph" }],
              }),
            },
            {
              title: "Duas colunas",
              subtext: "Organize blocos lado a lado",
              aliases: ["colunas", "columns", "grid", "duas"],
              group: "Estrutura",
              icon: <Columns3 className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, {
                type: "columns",
                children: [
                  { type: "column", children: [{ type: "paragraph" }] },
                  { type: "column", children: [{ type: "paragraph" }] },
                ],
              }),
            },
            {
              title: "Três colunas",
              subtext: "Crie uma grade responsiva de três áreas",
              aliases: ["colunas", "columns", "grid", "três"],
              group: "Estrutura",
              icon: <Columns3 className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, {
                type: "columns",
                children: [
                  { type: "column", children: [{ type: "paragraph" }] },
                  { type: "column", children: [{ type: "paragraph" }] },
                  { type: "column", children: [{ type: "paragraph" }] },
                ],
              }),
            },
            {
              title: "Grade de destaques",
              subtext: "Apresente três diferenciais em cartões",
              aliases: ["destaques", "features", "cards", "grade"],
              group: "Página web",
              icon: <PanelsTopLeft className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, createFeatureGridTemplate()),
            },
            {
              title: "Chamada para ação",
              subtext: "Direcione a pessoa para o próximo passo",
              aliases: ["cta", "ação", "botão", "contato"],
              group: "Página web",
              icon: <Send className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, createCallToActionTemplate()),
            },
            {
              title: "Callout",
              subtext: "Destaque uma informação importante",
              aliases: ["aviso", "destaque", "alerta", "callout"],
              group: "Avançados",
              icon: <Lightbulb className="size-4" />,
              onItemClick: () =>
                insertOrUpdateBlockForSlashMenu(editor, {
                  type: "callout",
                }),
            },
            {
              title: "Coleção de páginas",
              subtext: "Liste páginas de um grupo dinamicamente",
              aliases: ["coleção", "collection", "lista", "páginas"],
              group: "Avançados",
              icon: <FileStack className="size-4" />,
              onItemClick: () =>
                insertOrUpdateBlockForSlashMenu(editor, {
                  type: "pageCollection",
                }),
            },
            {
              title: "YouTube",
              subtext: "Incorpore um vídeo por URL",
              aliases: ["youtube", "vídeo", "video", "embed"],
              group: "Mídia",
              icon: <FileVideoCamera className="size-4" />,
              onItemClick: () =>
                insertOrUpdateBlockForSlashMenu(editor, {
                  type: "youtube",
                }),
            },
          ],
          query,
        )
      }
    />
  )
}
