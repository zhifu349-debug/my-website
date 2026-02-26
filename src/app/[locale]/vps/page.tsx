import { Metadata } from "next";
import { seoEngine } from "@/lib/seo-engine";
import RecommendationTemplate from "@/components/templates/RecommendationTemplate";
import PageEditorButton from "@/components/editor/PageEditorButton";
import { type Locale } from "@/lib/i18n-config";
import { vpsProviders, commonFAQs } from "@/lib/data/content-data";
import Comments from "@/components/Comments";

interface VPSPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: VPSPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: "Best VPS Hosting 2026 - Top 5 Providers Reviewed & Compared",
    zh: "最佳VPS主机2026 - 前5名服务商深度评测与对比",
  };

  const descriptions = {
    en: "Our experts tested 20+ VPS providers. See the top 5 best VPS hosting services for 2026 with pricing, features, and real performance data.",
    zh: "我们的专家测试了20多家VPS提供商。查看2026年最佳VPS主机服务前5名，包含价格、功能和真实性能数据。",
  };

  const seo = seoEngine.generateSEO("recommendation" as any, {
    keyword: locale === "zh" ? "最佳vps" : "best vps",
    category: locale === "zh" ? "VPS主机" : "VPS Hosting",
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${locale}/vps`,
  });

  return {
    title: titles[locale as Locale],
    description: descriptions[locale as Locale],
    keywords: [...seo.keywords, "VPS", "cloud hosting", "virtual server", "2026"],
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
  const isZh = locale === "zh";

  const titles = {
    en: "Best VPS Hosting 2026",
    zh: "最佳VPS主机 2026",
  };

  const subtitles = {
    en: "Expert-tested VPS providers with real performance data. Find the perfect virtual server for your needs.",
    zh: "经过专家测试的VPS提供商，提供真实性能数据。找到适合你需求的完美虚拟服务器。",
  };

  const painPoints = isZh ? [
    "共享主机速度慢，网站经常卡顿",
    "流量增长后服务器频繁宕机",
    "VPS配置复杂，不知如何下手",
    "隐藏费用多，账单超出预算",
    "遇到问题时找不到技术支持",
  ] : [
    "Shared hosting too slow, website constantly lags",
    "Server crashes when traffic grows",
    "VPS setup is complex and confusing",
    "Hidden fees make bills unpredictable",
    "Can't get help when problems arise",
  ];

  const useCases = isZh ? [
    "托管个人博客或作品集网站",
    "运行开发测试环境",
    "部署生产级应用程序",
    "搭建科学上网代理服务",
    "运行游戏服务器或Discord机器人",
  ] : [
    "Host personal blog or portfolio",
    "Run development and testing environments",
    "Deploy production applications",
    "Set up proxy services",
    "Run game servers or Discord bots",
  ];

  const vpsData = {
    id: "vps-recommendations",
    slug: "best-vps-2026",
    keyword: isZh ? "最佳vps" : "best vps",
    intent: "comparison",
    title: titles,
    subtitle: subtitles,
    solutions: vpsProviders.map(provider => ({
      id: provider.id,
      name: provider.name,
      slug: provider.slug,
      price: provider.price,
      rating: provider.rating,
      description: provider.description,
      pros: provider.pros,
      cons: provider.cons,
      features: provider.features,
      affiliateUrl: provider.affiliateUrl,
      bestFor: provider.bestFor,
    })),
    painPoints,
    useCases,
    selectionGuide: {
      beginners: isZh 
        ? "选择 DigitalOcean - 拥有最详细的文档和新手友好的界面，社区教程也最丰富" 
        : "Choose DigitalOcean - best documentation and beginner-friendly interface with rich community tutorials",
      advanced: isZh
        ? "选择 Linode - 提供更多控制权和更好的性能，适合技术用户，支持团队也非常专业"
        : "Choose Linode - more control and better performance for technical users with professional support",
      specialNeeds: isZh
        ? "选择 Vultr - 32个全球数据中心，NVMe存储，适合需要全球部署或对性能要求高的用户"
        : "Choose Vultr - 32 global locations with NVMe storage, perfect for global deployment or high performance needs",
    },
    faqs: commonFAQs.vps.map(faq => ({
      question: faq.question[locale as keyof typeof faq.question] || faq.question.en,
      answer: faq.answer[locale as keyof typeof faq.answer] || faq.answer.en,
    })),
  };

  const seo = seoEngine.generateSEO("recommendation" as any, {
    keyword: isZh ? "最佳vps" : "best vps",
    category: isZh ? "VPS主机" : "VPS Hosting",
  });

  const schema = seoEngine.generateSchema(
    "recommendation" as any,
    {
      title: seo.title,
      description: seo.description,
      solutions: vpsData.solutions,
    },
    `/${locale}/vps`,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageEditorButton locale={locale as Locale} pageId="vps" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              🏆 {isZh ? "2026年2月最新测试" : "Updated February 2026"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {titles[locale as Locale]}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {subtitles[locale as Locale]}
          </p>
          
          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "测试20+服务商" : "20+ Providers Tested"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "真实性能数据" : "Real Performance Data"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "每月更新" : "Monthly Updates"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Recommendation Template */}
      <RecommendationTemplate
        data={vpsData}
        locale={locale as Locale}
      />

      {/* 评论区 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Comments path={`/${locale}/vps`} locale={locale as "en" | "zh"} />
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
