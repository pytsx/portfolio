import type { DocumentData } from "firebase/firestore"

export function readDate(value: unknown): Date | undefined {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate(): Date }).toDate()
  }

  return value instanceof Date ? value : undefined
}

export function readString(data: DocumentData, key: string, fallback = "") {
  return typeof data[key] === "string" ? data[key] : fallback
}

export function readStringArray(data: DocumentData, key: string) {
  const value = data[key]
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

export function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
