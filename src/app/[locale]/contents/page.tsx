import { Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import { translations } from "@/lib/i18n-config";
import { CMSContent } from "@/lib/cms-types";

interface ContentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContentsPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "zh" ? "所有内容" : "All Content",
    description: locale === "zh" ? "查看所有网站内容" : "View all website content",
    alternates: {
      canonical: `/${locale}/contents`,
      languages: {
        en: "/en/contents",
        zh: "/zh/contents",
      },
    },
  };
}

export default async function ContentsPage({ params }: ContentsPageProps) {
  const { locale } = await params;
  const translations_data = translations[locale as Locale] || translations.en;

  // 获取所有发布的内容
  const contents: any[] = [];

  // 按类型分组
  const contentsByType: Record<string, CMSContent[]> = {};
  contents.forEach(content => {
    if (!contentsByType[content.type]) {
      contentsByType[content.type] = [];
    }
    contentsByType[content.type].push(content);
  });

  // 类型名称映射
  const typeNames = {
    recommendation: { en: "Recommendations", zh: "推荐" },
    review: { en: "Reviews", zh: "评测" },
    comparison: { en: "Comparisons", zh: "对比" },
    tutorial: { en: "Tutorials", zh: "教程" },
    resource: { en: "Resources", zh: "资源" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
              📚 {contents.length} {locale === "zh" ? "篇内容" : "Articles"}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 animate-fade-in">
            {locale === "zh" ? "所有内容" : "All Content"}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {locale === "zh" ? "浏览我们的所有内容，包括推荐、评测、对比和教程" : "Browse all our content including recommendations, reviews, comparisons, and tutorials"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${locale}/admin`} 
              className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {locale === "zh" ? "管理内容" : "Manage Content"}
            </Link>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {Object.entries(contentsByType).map(([type, typeContents]) => (
          <div key={type} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
                {typeNames[type as keyof typeof typeNames]?.[locale as keyof typeof typeNames.recommendation] || type}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {locale === "zh" ? `查看我们的${typeNames[type as keyof typeof typeNames]?.zh || type}内容` : `View our ${typeNames[type as keyof typeof typeNames]?.en || type} content`}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeContents.map((content, index) => (
                <Link
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
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* 无内容时的提示 */}
        {contents.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {locale === "zh" ? "暂无内容" : "No Content Available"}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              {locale === "zh" ? "管理后台尚未发布任何内容。" : "No content has been published from the admin panel yet."}
            </p>
            <Link 
              href={`/${locale}/admin`} 
              className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {locale === "zh" ? "去发布内容" : "Go Publish Content"}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
