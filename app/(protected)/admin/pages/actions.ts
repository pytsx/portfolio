"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"

import { parseEditorDocument } from "@/components/editor/lib/document"
import { cacheTags } from "@/lib/cache-tags"
import { getMutationError, type MutationState } from "@/lib/entities/action-state"
import { readFormBoolean, readFormJson, readFormString } from "@/lib/entities/form"
import { pageRepository } from "@/lib/pages/server"
import { parsePageWidth } from "@/lib/pages/page-width"

function readPageForm(formData: FormData) {
  return {
    title: readFormString(formData, "title"),
    slug: readFormString(formData, "slug"),
    content: parseEditorDocument(readFormJson(formData, "content")),
    visibility: readFormString(formData, "visibility") === "private"
      ? "private" as const
      : "public" as const,
    groupSlug: readFormString(formData, "groupSlug") || undefined,
    groupId: readFormString(formData, "groupId") || undefined,
    isHome: readFormBoolean(formData, "isHome"),
    width: parsePageWidth(readFormString(formData, "width")),
    description: readFormString(formData, "description") || undefined,
    coverImage: readFormString(formData, "coverImage") || undefined,
  }
}

function revalidatePageRoutes(page?: { slug: string; groupSlug?: string }) {
  updateTag(cacheTags.pages)
  revalidatePath("/admin/pages")
  revalidatePath("/")
  if (page) {
    revalidatePath(`/${page.groupSlug ? `${page.groupSlug}/` : ""}${page.slug}`)
  }
}

export async function createPage(
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    const page = await pageRepository.create(readPageForm(formData))
    revalidatePageRoutes(page)
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível criar a página.") }
  }

  redirect("/admin/pages")
}

export async function updatePage(
  id: string,
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    const page = await pageRepository.update(id, readPageForm(formData))
    revalidatePageRoutes(page)
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível salvar a página.") }
  }

  redirect("/admin/pages")
}

export async function deletePage(formData: FormData) {
  await pageRepository.delete(readFormString(formData, "id"))
  revalidatePageRoutes()
  redirect("/admin/pages")
}
