import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://nectar-engine.vercel.app", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://nectar-engine.vercel.app/security", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://nectar-engine.vercel.app/dating-discovery", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://nectar-engine.vercel.app/generator", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://nectar-engine.vercel.app/compliance", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://nectar-engine.vercel.app/faq", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://nectar-engine.vercel.app/contact", lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
