"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"

import { getMutationError, type MutationState } from "@/lib/entities/action-state"
import { cacheTags } from "@/lib/cache-tags"
import { readFormBoolean, readFormString } from "@/lib/entities/form"
import { socialRepository } from "@/lib/socials/server"

function readSocialForm(formData: FormData) {
  return {
    name: readFormString(formData, "name"),
    href: readFormString(formData, "href"),
    visible: readFormBoolean(formData, "visible"),
  }
}

function revalidateSocials() {
  updateTag(cacheTags.socials)
  revalidatePath("/", "layout")
  revalidatePath("/admin/socials")
}

export async function createSocial(
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    await socialRepository.create(readSocialForm(formData))
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível criar a rede social.") }
  }
  revalidateSocials()
  redirect("/admin/socials")
}

export async function updateSocial(
  id: string,
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    await socialRepository.update(id, readSocialForm(formData))
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível salvar a rede social.") }
  }
  revalidateSocials()
  redirect("/admin/socials")
}

export async function deleteSocial(formData: FormData) {
  await socialRepository.delete(readFormString(formData, "id"))
  revalidateSocials()
}
