import type { MetadataRoute } from "next"
import { absoluteUrl, siteOrigin } from "@/lib/public/url"

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/signin", "/signup", "/signout"] }, sitemap: absoluteUrl("/sitemap.xml"), host: siteOrigin() }
}
