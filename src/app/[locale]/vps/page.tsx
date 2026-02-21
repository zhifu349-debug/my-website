import { Metadata } from "next";
import { seoEngine } from "@/lib/seo-engine";
import { mockRecommendationPage } from "@/lib/data/mock-data";
import RecommendationTemplate from "@/components/templates/RecommendationTemplate";
import PageEditorButton from "@/components/editor/PageEditorButton";
import { type Locale } from "@/lib/i18n-config";

interface VPSPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: VPSPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Best VPS Hosting 2026 - Top Providers Reviewed",
    zh: "最佳VPS主机2026 - 顶级服务商评测",
  };

  const descriptions = {
    en: "Our experts tested and ranked top VPS providers to help you choose the best option",
    zh: "我们的专家测试并排名了顶级VPS服务商，帮助您选择最佳方案",
  };

  const seo = seoEngine.generateSEO("recommendation" as any, {
    keyword: locale === "zh" ? "最佳vps" : "best vps",
    category: locale === "zh" ? "VPS主机" : "VPS Hosting",
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${locale}/vps`,
  });

  return {
    title: titles[locale as Locale],
    description: descriptions[locale as Locale],
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical,
      languages: {
        en: "/en/vps",
        zh: "/zh/vps",
      },
    },
  };
}

export default async function VPSPage({ params }: VPSPageProps) {
  const { locale } = await params;

  const titles = {
    en: "Best VPS Hosting 2026",
    zh: "最佳VPS主机 2026",
  };

  const subtitles = {
    en: "Our experts tested and ranked top VPS providers to help you choose the best option",
    zh: "我们的专家测试并排名了顶级VPS服务商，帮助您选择最佳方案",
  };

  const seo = seoEngine.generateSEO("recommendation" as any, {
    keyword: locale === "zh" ? "最佳vps" : "best vps",
    category: locale === "zh" ? "VPS主机" : "VPS Hosting",
  });

  const schema = seoEngine.generateSchema(
    "recommendation" as any,
    {
      title: seo.title,
      description: seo.description,
      solutions: mockRecommendationPage.solutions,
    },
    "/vps",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageEditorButton locale={locale as Locale} pageId="vps" />
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              🏆 {locale === "zh" ? "2026年更新" : "Updated for 2026"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {titles[locale as Locale]}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {subtitles[locale as Locale]}
          </p>
        </div>
      </div>
      <RecommendationTemplate
        data={mockRecommendationPage}
        locale={locale as Locale}
      />
    </>
  );
}
