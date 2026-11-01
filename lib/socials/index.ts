import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { collection, getDocs, query, type DocumentData, where } from "firebase/firestore"

import { cacheTags } from "@/lib/cache-tags"
import { readDate, readString } from "@/lib/entities/document"
import { db } from "@/lib/firebase/firebase"

const SOCIALS_COLLECTION = "socials"

export type SocialLink = {
  id: string
  name: string
  href: string
  visible: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type SocialLinkInput = Pick<SocialLink, "name" | "href" | "visible">

export function socialFromDocument(id: string, data: DocumentData): SocialLink {
  return {
    id,
    name: readString(data, "name", "Rede social"),
    href: readString(data, "href"),
    visible: data.visible === true,
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  }
}

async function listVisibleSocials(): Promise<SocialLink[]> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.socials)

  const snapshot = await getDocs(
    query(collection(db, SOCIALS_COLLECTION), where("visible", "==", true)),
  )
  return snapshot.docs.map((document) => socialFromDocument(document.id, document.data()))
}

export const publicSocials = {
  list: listVisibleSocials,
}
