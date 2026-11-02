"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"

import { parseEditorDocument } from "@/components/editor/lib/document"
import { cacheTags } from "@/lib/cache-tags"
import { getMutationError, type MutationState } from "@/lib/entities/action-state"
import { readFormJson, readFormString } from "@/lib/entities/form"
import { groupRepository } from "@/lib/groups/server"

function readGroupForm(formData: FormData) {
  return {
    title: readFormString(formData, "title"),
    slug: readFormString(formData, "slug"),
    content: parseEditorDocument(readFormJson(formData, "content")),
    visibility: readFormString(formData, "visibility") === "private"
      ? "private" as const
      : "public" as const,
    isHome: formData.get("isHome") === "on",
    parentId: readFormString(formData, "parentId") || undefined,
  }
}

function revalidateGroups(slug?: string) {
  updateTag(cacheTags.groups)
  updateTag(cacheTags.pages)
  revalidatePath("/admin/groups")
  revalidatePath("/admin", "layout")
  revalidatePath("/")
  if (slug) revalidatePath(`/${slug}`)
}

export async function createGroup(
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    const group = await groupRepository.create(readGroupForm(formData))
    revalidateGroups(group.slug)
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível criar o grupo.") }
  }
  redirect("/admin/groups")
}

export async function updateGroup(
  id: string,
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    const group = await groupRepository.update(id, readGroupForm(formData))
    revalidateGroups(group.slug)
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível salvar o grupo.") }
  }
  redirect("/admin/groups")
}

export async function deleteGroup(formData: FormData) {
  await groupRepository.delete(readFormString(formData, "id"))
  revalidateGroups()
  redirect("/admin/groups")
}

export async function migrateLegacyGroups() {
  await groupRepository.migrateLegacyVisibility()
  revalidateGroups()
}

export async function migratePublicIndexes() {
  const { pageRepository } = await import("@/lib/pages/server")
  await Promise.all([groupRepository.migratePublicIndex(), pageRepository.migratePublicIndex()])
  revalidateGroups()
}
