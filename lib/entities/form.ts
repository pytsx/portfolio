export function readFormString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export function readFormStringList(formData: FormData, key: string) {
  return readFormString(formData, key)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

export function readFormNumber(formData: FormData, key: string) {
  const value = Number(readFormString(formData, key))
  return Number.isFinite(value) ? value : 0
}

export function readFormBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on"
}

export function readFormJson(formData: FormData, key: string): unknown {
  const value = readFormString(formData, key)

  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}
