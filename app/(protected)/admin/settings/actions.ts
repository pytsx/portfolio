"use server"

import { revalidatePath, updateTag } from "next/cache"

import { cacheTags } from "@/lib/cache-tags"
import { getMutationError, type MutationState } from "@/lib/entities/action-state"
import { readFormString } from "@/lib/entities/form"
import { updateSiteSettings } from "@/lib/site-settings/server"

export async function saveSiteSettings(
  _state: MutationState,
  formData: FormData,
): Promise<MutationState> {
  try {
    await updateSiteSettings({
      name: readFormString(formData, "name"),
      description: readFormString(formData, "description"),
      logo: readFormString(formData, "logo"),
    })
  } catch (error) {
    return { error: getMutationError(error, "Não foi possível salvar as configurações.") }
  }

  updateTag(cacheTags.siteSettings)
  revalidatePath("/", "layout")
  revalidatePath("/admin/settings")
  return {}
}
