import { EntityValidationError } from "./errors"

export function requireSafeHref(value: string, fieldName = "Endereço") {
  const href = value.trim()

  if (
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !href.includes("\\")
  ) {
    return href
  }

  try {
    const url = new URL(href)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Protocolo não permitido")
    }
    return url.toString()
  } catch {
    throw new EntityValidationError(`${fieldName} inválido ou inseguro.`)
  }
}
