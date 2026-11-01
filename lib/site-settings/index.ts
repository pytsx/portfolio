import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { doc, getDoc } from "firebase/firestore"

import { cacheTags } from "@/lib/cache-tags"
import { db } from "@/lib/firebase/firebase"

export type SiteSettings = {
  name: string
  description: string
  logo: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: "",
  description: "Portfólio e publicações.",
  logo: "",
}

const SETTINGS_COLLECTION = "site-settings"
const SETTINGS_DOCUMENT = "portfolio"

async function getSiteSettings(): Promise<SiteSettings> {
  "use cache"
  cacheLife("hours")
  cacheTag(cacheTags.siteSettings)

  const snapshot = await getDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOCUMENT))
  if (!snapshot.exists()) return DEFAULT_SITE_SETTINGS

  const data = snapshot.data()
  return {
    name: typeof data.name === "string" && data.name.trim() ? data.name : DEFAULT_SITE_SETTINGS.name,
    description: typeof data.description === "string" ? data.description : DEFAULT_SITE_SETTINGS.description,
    logo: typeof data.logo === "string" ? data.logo : "",
  }
}

export const publicSiteSettings = {
  get: getSiteSettings,
}
