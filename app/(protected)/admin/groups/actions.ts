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
    parentId: readFormString(formData, "parentId") || undefined,
  }
}

function revalidateGroups(slug?: string) {
  updateTag(cacheTags.groups)
  revalidatePath("/admin/groups")
  revalidatePath("/admin", "layout")
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
}
