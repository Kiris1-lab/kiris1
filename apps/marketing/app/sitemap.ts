import type { MetadataRoute } from "next";

const ROUTES = [
  "/",
  "/product",
  "/pricing",
  "/security",
  "/integrations",
  "/customers",
  "/blog",
  "/trust",
  "/contact-sales",
  "/signup",
  "/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiris.ai";
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
