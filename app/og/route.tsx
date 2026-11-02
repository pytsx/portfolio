import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

import { publicSiteSettings } from "@/lib/site-settings"

export async function GET(request: NextRequest) {
  const settings = await publicSiteSettings.get()
  const title = request.nextUrl.searchParams.get("title")?.trim() || settings.name || "Portfólio"
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", color: "white", background: "linear-gradient(135deg, #09090b, #27272a)" }}>
      <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em" }}>{title}</div>
      <div style={{ marginTop: 28, fontSize: 32, color: "#d4d4d8" }}>{settings.description}</div>
    </div>,
    { width: 1200, height: 630 },
  )
}
