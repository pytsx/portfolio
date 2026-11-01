import {
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core/extensions"
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react"
import { FileStack, FileVideoCamera, LayoutPanelTop, Lightbulb, PanelsTopLeft, Send } from "lucide-react"

import type { editorSchema } from "../editor-schema"

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
              title: "Hero",
              subtext: "Crie a abertura de uma página web",
              aliases: ["hero", "capa", "abertura", "landing"],
              group: "Página web",
              icon: <LayoutPanelTop className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, { type: "hero" }),
            },
            {
              title: "Grade de destaques",
              subtext: "Apresente três diferenciais em cartões",
              aliases: ["destaques", "features", "cards", "grade"],
              group: "Página web",
              icon: <PanelsTopLeft className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, { type: "featureGrid" }),
            },
            {
              title: "Chamada para ação",
              subtext: "Direcione a pessoa para o próximo passo",
              aliases: ["cta", "ação", "botão", "contato"],
              group: "Página web",
              icon: <Send className="size-4" />,
              onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, { type: "callToAction" }),
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
