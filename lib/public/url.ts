const DEFAULT_ORIGIN = "http://localhost:3000"

export function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ?? process.env.VERCEL_URL?.trim()
  return new URL(configured || (vercel ? `https://${vercel}` : DEFAULT_ORIGIN)).origin
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteOrigin()}/`).toString()
}
