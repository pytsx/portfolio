import { ImageResponse } from "next/og"
import { publicSiteSettings } from "@/lib/site-settings"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const settings = await publicSiteSettings.get()
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", color: "white", background: "linear-gradient(135deg, #09090b, #27272a)" }}><div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em" }}>{settings.name || "Portfólio"}</div><div style={{ marginTop: 28, fontSize: 32, color: "#d4d4d8" }}>{settings.description}</div></div>, size)
}
