import {
  mockRecommendationPage,
  mockReviewPage,
  mockComparisonPage,
  mockTutorialPage,
  mockResourcePage,
} from "./data/mock-data";

// 生成所有静态页面路径
export function generateStaticPaths() {
  const paths: Record<string, any> = {
    "/": {
      page: "index",
    },
    "/vps": {
      page: "vps",
      data: mockRecommendationPage,
    },
    "/vps/vultr-review": {
      page: "vps-review",
      slug: "vultr-review",
      data: mockReviewPage,
    },
    "/comparisons/vultr-vs-digitalocean": {
      page: "comparison",
      slug: "vultr-vs-digitalocean",
      data: mockComparisonPage,
    },
    "/tutorials/v2ray-setup": {
      page: "tutorial",
      slug: "v2ray-setup",
      data: mockTutorialPage,
    },
    "/resources/vps-guide": {
      page: "resource",
      slug: "vps-guide",
      data: mockResourcePage,
    },
  };

  return paths;
}

// 获取页面数据
export function getPageData(pathname: string): any {
  const paths = generateStaticPaths();
  return paths[pathname as keyof typeof paths];
}

// 生成i18n路径
export function generateI18nPaths(locales: string[] = ["en", "zh"]): string[] {
  const paths = Object.keys(generateStaticPaths());
  const i18nPaths: string[] = [];

  locales.forEach((locale) => {
    paths.forEach((path) => {
      i18nPaths.push(`/${locale}${path}`);
    });
  });

  return i18nPaths;
}

// 生成SSG配置
export const ssgConfig = {
  paths: Object.keys(generateStaticPaths()),
  fallback: false, // 不使用fallback，完全静态生成
};
