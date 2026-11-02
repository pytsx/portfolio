import { getLlmsText } from "@/lib/agentic-resources"

export async function GET() {
  return new Response(await getLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
