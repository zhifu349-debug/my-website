import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SEO Content Monetization System",
    short_name: "SEO CMS",
    description: "SEO-driven content monetization platform",
    start_url: "/",
    display: "standalone",
    background_color: "#2563eb",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
