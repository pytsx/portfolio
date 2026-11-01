"use client"

import { useActionState, useState } from "react"
import { Save } from "lucide-react"

import { Editor, type EditorCollectionData, type EditorDocument } from "@/components/editor"
import { Button } from "@/components/ui/button"
import { INITIAL_MUTATION_STATE, type MutationState } from "@/lib/entities/action-state"
import type { PageGroup } from "@/lib/groups"
import { getGroupDepth } from "@/lib/groups/tree"

type GroupComposerProps = {
  action(state: MutationState, data: FormData): Promise<MutationState>
  group?: PageGroup
  groups: PageGroup[]
  defaultParentId?: string
  collections: EditorCollectionData
}

export function GroupComposer({ action, group, groups, defaultParentId, collections }: GroupComposerProps) {
  const [content, setContent] = useState<EditorDocument>(group?.content ?? [])
  const [state, formAction, pending] = useActionState(action, INITIAL_MUTATION_STATE)

  return (
    <form action={formAction} className="min-h-[calc(100vh-4.5rem)]">
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <header className="sticky top-0 z-20 flex h-[69px] items-center justify-end border-b bg-background/85 px-4 backdrop-blur-xl sm:px-8">
        <Button type="submit" size="sm" disabled={pending}>
          <Save data-icon="inline-start" />
          {pending ? "Salvando..." : "Salvar grupo"}
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
          onChange={setContent}
          collections={collections}
          placeholder="Monte a listagem com blocos. Use /coleção para exibir páginas."
        />
      </main>
    </form>
  )
}
