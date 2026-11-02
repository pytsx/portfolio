"use client"

import { useActionState, useState, useRef, useCallback } from "react"
import { Globe2, Lock, Save } from "lucide-react"

import { Editor, type EditorDocument } from "@/components/editor"
import { Button } from "@/components/ui/button"
import {
  INITIAL_MUTATION_STATE,
  type MutationState,
} from "@/lib/entities/action-state"
import type { ContentPage } from "@/lib/pages"
import type { PageGroup } from "@/lib/groups"
import { getGroupDepth } from "@/lib/groups/tree"
import { HomePageButton } from "./home-page-button"
import { PageActions } from "./page-actions"
import { deletePage } from "../actions"
import { parsePageWidth } from "@/lib/pages/page-width"
import { PageWidthControl } from "./page-width-control"

type PageMutation = (
  state: MutationState,
  formData: FormData,
) => Promise<MutationState>

type PageComposerProps = {
  action: PageMutation
  page?: ContentPage
  groups: PageGroup[]
  defaultGroupId?: string
}

export function PageComposer({ action, page, groups, defaultGroupId }: PageComposerProps) {
  const [content, setContent] = useState<EditorDocument>(page?.content ?? [])
  const documentRef = useRef(content)
  const updateDocument = useCallback((document: EditorDocument) => { documentRef.current = document }, [])
  const getDocument = useCallback(() => documentRef.current, [])
  function importDocument(document: EditorDocument) {
    documentRef.current = document
    setContent(document)
  }
  const [visibility, setVisibility] = useState(page?.visibility ?? "public")
  const [isHome, setIsHome] = useState(page?.isHome ?? false)
  const [pageWidth, setPageWidth] = useState(() => parsePageWidth(page?.width))
  const [state, formAction, pending] = useActionState(
    (previous: MutationState, data: FormData) => {
      data.set("content", JSON.stringify(documentRef.current))
      return action(previous, data)
    },
    INITIAL_MUTATION_STATE,
  )

  return (
    <form action={formAction} className="min-h-[calc(100vh-4.5rem)]">
      <input type="hidden" name="width" value={pageWidth} />
      {isHome ? <input type="hidden" name="isHome" value="on" /> : null}

      <header className="sticky top-0 z-20 flex h-[69px] items-center justify-end gap-2 border-b bg-background/85 px-4 backdrop-blur-xl sm:px-8">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {visibility === "private" ? <Lock /> : <Globe2 />}
          <span className="sr-only">Visibilidade</span>
          <select
            name="visibility"
            value={visibility}
            onChange={(event) =>
              setVisibility(
                event.currentTarget.value === "private" ? "private" : "public",
              )
            }
            className="rounded-lg bg-transparent px-2 py-1.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="public">Pública</option>
            <option value="private">Privada</option>
          </select>
        </label>
        <HomePageButton
          pressed={isHome}
          onPressedChange={(nextIsHome) => {
            setIsHome(nextIsHome)
            if (nextIsHome) setVisibility("public")
          }}
        />
        <PageActions
          content={content}
          getContent={getDocument}
          fileName={page?.slug ?? "nova-pagina"}
          onImport={importDocument}
          entityId={page?.id}
          deleteAction={page ? deletePage : undefined}
        />
        <PageWidthControl value={pageWidth} onValueChange={setPageWidth} />
        <Button type="submit" size="sm" disabled={pending}>
          <Save data-icon="inline-start" />
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </header>

      <main className="w-full py-10 sm:py-14">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-12">
          <input
          name="title"
          defaultValue={page?.title}
          placeholder="Sem título"
          aria-label="Título da página"
          autoFocus={!page}
          required
          className="mb-3 w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 sm:text-6xl"
        />
          <div className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
          <select
            name="groupId"
            defaultValue={page?.groupId ?? defaultGroupId ?? ""}
            disabled={Boolean(page)}
            aria-label="Grupo da página"
            className="max-w-40 bg-transparent outline-none"
          >
            <option value="">Raiz /</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {"— ".repeat(getGroupDepth(group, groups))}{group.title}
              </option>
            ))}
          </select>
          <input
            name="slug"
            defaultValue={page?.slug}
            placeholder="endereco-da-pagina"
            aria-label="Endereço da página"
            readOnly={Boolean(page)}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
          </div>

          <div className="mb-10 grid gap-3 sm:grid-cols-2">
            <input
              name="description"
              defaultValue={page?.description}
              placeholder="Descrição para buscadores e compartilhamento"
              aria-label="Descrição SEO"
              maxLength={200}
              className="rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <input
              name="coverImage"
              defaultValue={page?.coverImage}
              placeholder="URL da imagem de compartilhamento"
              aria-label="Imagem de compartilhamento"
              type="url"
              className="rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {state.error ? <p role="alert" className="mb-6 text-sm text-destructive">{state.error}</p> : null}
        </div>

        <Editor
          value={content}
          onChange={updateDocument}
          placeholder="Digite / para escolher um bloco"
          autoFocus={Boolean(page)}
          mode="builder"
          pageWidth={pageWidth}
          pageId={page?.id}
          pageTitle={page?.title}
        />
      </main>
    </form>
  )
}
