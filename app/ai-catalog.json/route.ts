import { getAiCatalog } from "@/lib/agentic-resources"

export async function GET() {
  return Response.json(await getAiCatalog(), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
