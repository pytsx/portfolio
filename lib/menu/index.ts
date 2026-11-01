import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { collection, getDocs, query, type DocumentData, where } from "firebase/firestore"

import { cacheTags } from "@/lib/cache-tags"
import { readDate, readString } from "@/lib/entities/document"
import type { EntityReader } from "@/lib/entities/repository"
import { EntityValidationError } from "@/lib/entities/errors"
import { requireSafeHref } from "@/lib/entities/url"
import { db } from "@/lib/firebase/firebase"

const MENU_COLLECTION = "menus"

export type MenuLink = {
  id: string
  type: "link"
  label: string
  href: string
}

export type MenuDropdownLink = {
  id: string
  label: string
  href: string
  description: string
}

export type MenuDropdown = {
  id: string
  type: "dropdown"
  label: string
  items: MenuDropdownLink[]
}

export type MenuEntry = MenuLink | MenuDropdown

export type Menu = {
  id: string
  name: string
  enabled: boolean
  items: MenuEntry[]
  createdAt?: Date
  updatedAt?: Date
}

export type MenuInput = Omit<Menu, "id" | "createdAt" | "updatedAt">

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function requireText(value: unknown, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new EntityValidationError(`${fieldName} é obrigatório.`)
  }

  return value.trim()
}

function requireHref(value: unknown) {
  const href = requireText(value, "Endereço")
  return requireSafeHref(href)
}

function parseDropdownLink(value: unknown): MenuDropdownLink {
  if (!isRecord(value)) {
    throw new EntityValidationError("Item do dropdown inválido.")
  }

  return {
    id: requireText(value.id, "Identificador"),
    label: requireText(value.label, "Título"),
    href: requireHref(value.href),
    description: typeof value.description === "string" ? value.description.trim() : "",
  }
}

function parseMenuEntry(value: unknown): MenuEntry {
  if (!isRecord(value)) {
    throw new EntityValidationError("Item de menu inválido.")
  }

  const id = requireText(value.id, "Identificador")
  const label = requireText(value.label, "Título")

  if (value.type === "link") {
    return { id, label, type: "link", href: requireHref(value.href) }
  }

  if (value.type === "dropdown") {
    if (!Array.isArray(value.items) || value.items.length === 0) {
      throw new EntityValidationError(`O dropdown "${label}" precisa ter ao menos um item.`)
    }

    return {
      id,
      label,
      type: "dropdown",
      items: value.items.map(parseDropdownLink),
    }
  }

  throw new EntityValidationError("Tipo de item de menu inválido.")
}

export function parseMenuEntries(value: unknown): MenuEntry[] {
  if (!Array.isArray(value)) {
    throw new EntityValidationError("A lista de itens do menu é inválida.")
  }

  return value.map(parseMenuEntry)
}

export function menuFromDocument(id: string, data: DocumentData): Menu {
  return {
    id,
    name: readString(data, "name", "Menu principal"),
    enabled: data.enabled === true,
    items: parseMenuEntries(data.items ?? []),
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  }
}

async function listEnabledMenus() {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.menus)

  const snapshot = await getDocs(
    query(collection(db, MENU_COLLECTION), where("enabled", "==", true)),
  )
  return snapshot.docs.map((document) =>
    menuFromDocument(document.id, document.data()),
  )
}

export const menus: EntityReader<Menu> = {
  list: listEnabledMenus,
  async get(id) {
    const menuList = await listEnabledMenus()
    return menuList.find((menu) => menu.id === id) ?? null
  },
}

export { MENU_COLLECTION }
