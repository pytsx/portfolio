import "server-only"

import { doc, serverTimestamp, setDoc } from "firebase/firestore"

import { getAuthenticatedContext } from "@/lib/auth/server"
import { EntityUnauthorizedError, EntityValidationError } from "@/lib/entities/errors"
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings"

const SETTINGS_COLLECTION = "site-settings"
const SETTINGS_DOCUMENT = "portfolio"

export async function updateSiteSettings(input: SiteSettings) {
  const context = await getAuthenticatedContext()
  if (!context) throw new EntityUnauthorizedError("Sua sessão expirou. Entre novamente.")

  const name = input.name.trim()
  if (!name) throw new EntityValidationError("Informe o nome do portfólio.")

  await setDoc(
    doc(context.db, SETTINGS_COLLECTION, SETTINGS_DOCUMENT),
    {
      name,
      description: input.description.trim() || DEFAULT_SITE_SETTINGS.description,
      logo: input.logo.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
