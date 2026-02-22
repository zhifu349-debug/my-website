import { Metadata } from "next";
import { seoEngine } from "@/lib/seo-engine";
import RecommendationTemplate from "@/components/templates/RecommendationTemplate";
import PageEditorButton from "@/components/editor/PageEditorButton";
import { type Locale } from "@/lib/i18n-config";
import { CMSContent } from "@/lib/cms-types";

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

  // 获取VPS相关内容
  const res = await fetch(`http://localhost:3002/api/contents?type=recommendation`);
  const data = await res.json();
  const contents: CMSContent[] = data.success ? data.data : [];
  const vpsContents = contents.filter(content => 
    content.title.en.toLowerCase().includes('vps') || 
    content.title.zh.toLowerCase().includes('vps') ||
    content.title.en.toLowerCase().includes('hosting') ||
    content.title.zh.toLowerCase().includes('主机')
  );

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

  // 模拟数据作为后备
  const mockRecommendationPage = {
    title: titles,
    subtitle: subtitles,
    solutions: [
      {
        id: "1",
        name: "Vultr",
        description: {
          en: "Fast, reliable VPS hosting with global data centers",
          zh: "快速、可靠的VPS主机，全球数据中心",
        },
        rating: 4.8,
        price: "$5/month",
        features: ["SSD Storage", "1TB Bandwidth", "Full Root Access"],
        link: "https://www.vultr.com",
        logo: "https://neeko-copilot.bytedance.net/api/text2image?prompt=Vultr%20logo&size=200x200",
        isTopPick: true,
      },
      {
        id: "2",
        name: "DigitalOcean",
        description: {
          en: "Developer-friendly cloud hosting with simple pricing",
          zh: "开发者友好的云主机，价格简单明了",
        },
        rating: 4.7,
        price: "$6/month",
        features: ["SSD Storage", "1TB Bandwidth", "99.99% Uptime"],
        link: "https://www.digitalocean.com",
        logo: "https://neeko-copilot.bytedance.net/api/text2image?prompt=DigitalOcean%20logo&size=200x200",
        isTopPick: false,
      },
    ],
    faq: [
      {
        question: {
          en: "What is VPS hosting?",
          zh: "什么是VPS主机？",
        },
        answer: {
          en: "VPS hosting is a virtual private server that gives you dedicated resources on a shared physical server.",
          zh: "VPS主机是一种虚拟专用服务器，在共享的物理服务器上为您提供专用资源。",
        },
      },
    ],
  };

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
      
      {/* 动态内容列表 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {vpsContents.length > 0 ? (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              {locale === "zh" ? "VPS内容列表" : "VPS Content List"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vpsContents.map((content, index) => (
                <a
                  key={content.id}
                  href={`/${locale}/contents/${content.slug}`}
                  className="group card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {content.featuredImage && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img
                        src={content.featuredImage}
                        alt={content.title[locale as keyof typeof content.title]}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {content.title[locale as keyof typeof content.title]}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {content.content[locale as keyof typeof content.content]?.intro || content.seo.description[locale as keyof typeof content.seo.description]}
                    </p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-200">
                      {locale === "zh" ? "阅读更多" : "Read More"}
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {locale === "zh" ? "暂无VPS内容" : "No VPS Content Available"}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              {locale === "zh" ? "管理后台尚未发布任何VPS相关内容。" : "No VPS-related content has been published from the admin panel yet."}
            </p>
          </div>
        )}
      </section>
      
      {/* 推荐模板 */}
      <RecommendationTemplate
        data={mockRecommendationPage}
        locale={locale as Locale}
      />
    </>
  );
}
