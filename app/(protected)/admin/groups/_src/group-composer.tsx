"use client"

import { useActionState, useCallback, useRef, useState } from "react"
import { Globe2, Lock, Save } from "lucide-react"

import { Editor, type EditorCollectionData, type EditorDocument } from "@/components/editor"
import { Button } from "@/components/ui/button"
import { INITIAL_MUTATION_STATE, type MutationState } from "@/lib/entities/action-state"
import type { PageGroup } from "@/lib/groups"
import { getGroupDepth } from "@/lib/groups/tree"
import { HomePageButton } from "../../pages/_src/home-page-button"
import { PageActions } from "../../pages/_src/page-actions"
import { deleteGroup } from "../actions"

type GroupComposerProps = {
  action(state: MutationState, data: FormData): Promise<MutationState>
  group?: PageGroup
  groups: PageGroup[]
  defaultParentId?: string
  collections: EditorCollectionData
}

export function GroupComposer({ action, group, groups, defaultParentId, collections }: GroupComposerProps) {
  const [content, setContent] = useState<EditorDocument>(group?.content ?? [])
  const documentRef = useRef(content)
  const updateDocument = useCallback((document: EditorDocument) => { documentRef.current = document }, [])
  const getDocument = useCallback(() => documentRef.current, [])
  function importDocument(document: EditorDocument) {
    documentRef.current = document
    setContent(document)
  }
  const [visibility, setVisibility] = useState(group?.visibility ?? "public")
  const [isHome, setIsHome] = useState(group?.isHome ?? false)
  const [state, formAction, pending] = useActionState(
    (previous: MutationState, data: FormData) => {
      data.set("content", JSON.stringify(documentRef.current))
      return action(previous, data)
    },
    INITIAL_MUTATION_STATE,
  )

  return (
    <form action={formAction} className="min-h-[calc(100vh-4.5rem)]">
      {isHome ? <input type="hidden" name="isHome" value="on" /> : null}
      <header className="sticky top-0 z-20 flex h-[69px] items-center justify-end gap-2 border-b bg-background/85 px-4 backdrop-blur-xl sm:px-8">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {visibility === "private" ? <Lock /> : <Globe2 />}
          <span className="sr-only">Visibilidade</span>
          <select
            name="visibility"
            value={visibility}
            onChange={(event) => setVisibility(event.currentTarget.value === "private" ? "private" : "public")}
            className="rounded-lg bg-transparent px-2 py-1.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="public">Público</option>
            <option value="private">Privado</option>
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
          fileName={group?.slug ?? "novo-grupo"}
          onImport={importDocument}
          entityId={group?.id}
          entityLabel="grupo"
          deleteAction={group ? deleteGroup : undefined}
        />
        <Button type="submit" size="sm" disabled={pending}>
          <Save data-icon="inline-start" />
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </header>
      <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-12 sm:py-20">
        <input
          name="title"
          defaultValue={group?.title}
          placeholder="Nome do grupo"
          aria-label="Nome do grupo"
          required
          autoFocus={!group}
          className="mb-3 w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 sm:text-6xl"
        />
        <div className="mb-10 flex text-sm text-muted-foreground">
          <span>/</span>
          <input
            name="slug"
            defaultValue={group?.slug}
            placeholder="blog"
            aria-label="Endereço do grupo"
            readOnly={Boolean(group)}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
        </div>
        <label className="mb-10 grid gap-2 text-sm text-muted-foreground">
          Grupo pai
          <select
            name="parentId"
            defaultValue={group?.parentId ?? defaultParentId ?? ""}
            className="rounded-xl border bg-background px-3 py-2 text-foreground"
          >
            <option value="">Raiz</option>
            {groups.filter((candidate) => candidate.id !== group?.id).map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {"— ".repeat(getGroupDepth(candidate, groups))}{candidate.title}
              </option>
            ))}
          </select>
        </label>
        {state.error ? <p role="alert" className="mb-6 text-sm text-destructive">{state.error}</p> : null}
        <Editor
          value={content}
          onChange={updateDocument}
          collections={collections}
          mode="builder"
          pageId={group?.id}
          pageTitle={group?.title}
          placeholder="Monte a listagem com blocos. Use /coleção para exibir páginas."
        />
      </main>
    </form>
  )
}
