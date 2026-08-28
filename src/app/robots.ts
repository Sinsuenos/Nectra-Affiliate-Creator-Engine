import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://nectar-engine.vercel.app/sitemap.xml",
    host: "https://nectar-engine.vercel.app",
  };
}
