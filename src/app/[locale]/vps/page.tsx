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

  // 获取VPS相关内容 - 使用模拟数据，跳过外部API
  const contents: CMSContent[] = [];
  const vpsContents = contents;

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
  const mockRecommendationPage: any = {
    id: "1",
    slug: "vps-recommendations",
    keyword: locale === "zh" ? "最佳vps" : "best vps",
    intent: "comparison",
    title: titles,
    subtitle: subtitles,
    metaTitle: titles.en,
    metaDescription: subtitles.en,
    solutions: [
      {
        id: "1",
        name: "Vultr",
        description: {
          en: "High-performance SSD cloud compute with 32 global locations. Perfect for developers and businesses needing scalable infrastructure.",
          zh: "高性能SSD云计算，32个全球数据中心。非常适合需要可扩展基础设施的开发者和企业。",
        },
        rating: 4.8,
        price: "$5/month",
        features: ["NVMe SSD Storage", "Native IPv6 Support", "Hourly Billing", "Full Root Access", "14 Global Locations"],
        link: "https://www.vultr.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vultr_Logo.svg/2560px-Vultr_Logo.svg.png",
        isTopPick: true,
      },
      {
        id: "2",
        name: "DigitalOcean",
        description: {
          en: "Developer-first cloud platform known for simplicity. Great documentation and one-click apps.",
          zh: "以简洁著称的开发者优先云平台。优秀的文档和一键应用。",
        },
        rating: 4.7,
        price: "$6/month",
        features: ["SSD Storage", "99.99% Uptime SLA", "Global CDN", "Automated Backups", "Team Collaboration"],
        link: "https://www.digitalocean.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/2560px-DigitalOcean_logo.svg.png",
        isTopPick: true,
      },
      {
        id: "3",
        name: "Linode",
        description: {
          en: "Trusted by developers since 2003. Excellent value with predictable pricing and premium hardware.",
          zh: "自2003年起受开发者信赖。优质硬件和可预测的价格，性价比极高。",
        },
        rating: 4.6,
        price: "$5/month",
        features: ["NVMe Storage", "Dedicated CPU Options", "Object Storage", "NodeBalancers", "40+ Global Regions"],
        link: "https://www.linode.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Linode_Logo.svg/2560px-Linode_Logo.svg.png",
        isTopPick: false,
      },
      {
        id: "4",
        name: "AWS Lightsail",
        description: {
          en: "Simple virtual servers from Amazon Web Services. Easy to use for beginners with AWS ecosystem integration.",
          zh: "亚马逊云服务提供的简单虚拟服务器易于使用，与AWS生态系统集成。",
        },
        rating: 4.5,
        price: "$5/month",
        features: ["AWS Integration", "Static IP Support", "Snapshots", "Managed Databases", "Global Infrastructure"],
        link: "https://aws.amazon.com/lightsail",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png",
        isTopPick: false,
      },
      {
        id: "5",
        name: "Hetzner Cloud",
        description: {
          en: "German engineering at its finest. Extremely competitive pricing with excellent performance.",
          zh: "德国工程典范。极具竞争力的价格和出色的性能。",
        },
        rating: 4.6,
        price: "€4.50/month",
        features: ["NVMe Storage", "EU Data Centers", "Dedicated CPU", "Excellent Value", "Flexible Scaling"],
        link: "https://hetzner.cloud",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Hetzner_Online GmbH Logo.svg/2560px-Hetzner_Online_GmbH_Logo.svg.png",
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
          en: "VPS (Virtual Private Server) hosting provides dedicated resources on a shared physical server. You get isolated environment with root access, better performance than shared hosting.",
          zh: "VPS（虚拟专用服务器）主机在共享物理服务器上提供专用资源。您可以获得隔离的环境和root权限，比共享主机更好的性能。",
        },
      },
      {
        question: {
          en: "How much VPS do I need?",
          zh: "我需要多大的VPS？",
        },
        answer: {
          en: "For a basic website, 1GB RAM with 1 CPU is sufficient. For heavier applications or e-commerce sites, 2-4GB RAM recommended. High-traffic sites may need 8GB+.",
          zh: "对于基本网站，1GB RAM和1个CPU足够了。对于较重的应用或电商网站，建议2-4GB RAM。高流量网站可能需要8GB以上。",
        },
      },
      {
        question: {
          en: "Can I upgrade my VPS later?",
          zh: "以后可以升级VPS吗？",
        },
        answer: {
          en: "Yes, most providers allow vertical scaling. You can upgrade CPU, RAM, and storage without migrating to a new server.",
          zh: "是的，大多数提供商允许垂直扩展。您可以在不迁移到新服务器的情况下升级CPU、RAM和存储。",
        },
      },
      {
        question: {
          en: "VPS vs Shared Hosting - which is better?",
          zh: "VPS vs 共享主机 - 哪个更好？",
        },
        answer: {
          en: "VPS offers better performance, reliability, and control. Choose VPS if you need consistent performance, custom software, or expect traffic growth.",
          zh: "VPS提供更好的性能、可靠性和控制权。如果您需要稳定的性能、自定义软件或预期流量增长，请选择VPS。",
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

export const dynamic = 'force-dynamic';
