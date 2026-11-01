"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"

import { getMutationError, type MutationState } from "@/lib/entities/action-state"
import { cacheTags } from "@/lib/cache-tags"
import {
  readFormBoolean,
  readFormJson,
  readFormString,
} from "@/lib/entities/form"
import { parseMenuEntries } from "@/lib/menu"
import { menuRepository } from "@/lib/menu/server"

function readMenuForm(formData: FormData) {
  return {
    name: readFormString(formData, "name"),
    enabled: readFormBoolean(formData, "enabled"),
    items: parseMenuEntries(readFormJson(formData, "items")),
  }
}

function revalidateMenu() {
  updateTag(cacheTags.menus)
  revalidatePath("/", "layout")
  revalidatePath("/admin/menu")
}

export async function createMenuItem(
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    await menuRepository.create(readMenuForm(formData))
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível criar o menu.") }
  }

  revalidateMenu()
  redirect("/admin/menu")
}

export async function updateMenuItem(
  id: string,
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    await menuRepository.update(id, readMenuForm(formData))
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível atualizar o menu.") }
  }

  revalidateMenu()
  redirect("/admin/menu")
}

export async function deleteMenuItem(formData: FormData) {
  await menuRepository.delete(readFormString(formData, "id"))
  revalidateMenu()
}
