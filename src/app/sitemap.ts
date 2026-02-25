import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.xcodezg.com";
  const locales = ["en", "zh"];

  // 静态页面
  const staticPages = [
    "",
    "/vps",
    "/ai-tools",
    "/tutorials",
    "/comparisons",
    "/resources",
  ];

  // VPS 评测页面
  const vpsReviews = [
    "vultr",
    "digitalocean",
    "linode",
    "aws-lightsail",
    "hetzner",
  ];

  // 对比页面
  const comparisons = [
    "vultr-vs-digitalocean",
    "vultr-vs-linode",
    "chatgpt-vs-claude",
  ];

  // 教程页面
  const tutorials = [
    "v2ray-setup",
    "docker-deployment",
    "react-optimization",
    "nginx-configuration",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // 静态页面
    staticPages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: page === "" ? 1 : 0.8,
      });
    });

    // VPS 评测页面
    vpsReviews.forEach((slug) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/vps/${slug}-review`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    });

    // 对比页面
    comparisons.forEach((slug) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/comparisons/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    });

    // 教程页面
    tutorials.forEach((slug) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/tutorials/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    });
  });

  return sitemap;
}
