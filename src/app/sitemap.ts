import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { cloudMap, labs } from "@/lib/content";
import type { CloudName } from "@/lib/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudcompass.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/practice`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const cloudRoutes: MetadataRoute.Sitemap = (Object.keys(cloudMap) as CloudName[]).map((cloud) => ({
    url: `${BASE_URL}/learn/${cloud}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const topicRoutes: MetadataRoute.Sitemap = (Object.keys(cloudMap) as CloudName[]).flatMap((cloud) =>
    cloudMap[cloud].modules.flatMap((mod) =>
      mod.topics.map((topic) => ({
        url: `${BASE_URL}/learn/${cloud}/${topic.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    )
  );

  const labRoutes: MetadataRoute.Sitemap = labs.map((lab) => ({
    url: `${BASE_URL}/practice/${lab.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...cloudRoutes, ...topicRoutes, ...labRoutes];
}
