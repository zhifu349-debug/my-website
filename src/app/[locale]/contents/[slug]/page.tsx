import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import { CMSContent } from "@/lib/cms-types";

interface ContentDetailProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ContentDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    return { title: "Not Found" };
  }
  
  const { locale, slug } = resolvedParams;

  try {
    // 获取内容数据 - 使用模拟数据
    const contents: any[] = [];
    const content = undefined;

    if (content) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.xcodezg.com";
      return {
        title: content.seo.title[locale as keyof typeof content.seo.title] || content.title[locale as keyof typeof content.title],
        description: content.seo.description[locale as keyof typeof content.seo.description],
        keywords: content.seo.keywords[locale as keyof typeof content.seo.keywords],
        alternates: {
          canonical: `${siteUrl}/${locale}/contents/${slug}`,
          languages: {
            en: `${siteUrl}/en/contents/${slug}`,
            zh: `${siteUrl}/zh/contents/${slug}`,
          },
        },
      };
    }
  } catch (error) {
    console.error('Error fetching content:', error);
  }

  return {
    title: locale === "zh" ? "内容详情" : "Content Detail",
    description: locale === "zh" ? "查看内容详情" : "View content details",
  };
}

export default async function ContentDetailPage({ params }: ContentDetailProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    notFound();
  }
  
  const { locale, slug } = resolvedParams;

  // 获取内容数据 - 使用模拟数据
  const contents: any[] = [];
  const content = undefined;

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link 
            href={`/${locale}/contents`} 
            className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {locale === "zh" ? "返回内容列表" : "Back to Content List"}
          </Link>
          <Link 
            href={`/${locale}/admin`} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            {locale === "zh" ? "管理内容" : "Manage Content"}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        {content.featuredImage && (
          <div className="absolute inset-0">
            <img
              src={content.featuredImage}
              alt={content.title[locale as keyof typeof content.title]}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-20">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              {content.type}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {content.title[locale as keyof typeof content.title]}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mb-8 leading-relaxed">
            {content.seo.description[locale as keyof typeof content.seo.description]}
          </p>
          <div className="flex flex-wrap gap-4 items-center text-white/80 text-sm">
            <span>
              {locale === "zh" ? "作者" : "Author"}: {content.author}
            </span>
            <span>•</span>
            <span>
              {locale === "zh" ? "发布时间" : "Published"}: {content.publishedAt ? new Date(content.publishedAt).toLocaleDateString() : new Date(content.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>
              {locale === "zh" ? "更新时间" : "Updated"}: {new Date(content.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          {/* Introduction */}
          {content.content[locale as keyof typeof content.content]?.intro && (
            <div className="mb-12">
              <p className="text-xl text-gray-700 leading-relaxed">
                {content.content[locale as keyof typeof content.content]?.intro}
              </p>
            </div>
          )}

          {/* Content Sections */}
          {content.content[locale as keyof typeof content.content]?.sections && content.content[locale as keyof typeof content.content]?.sections.length > 0 && (
            <div className="space-y-12">
              {content.content[locale as keyof typeof content.content]?.sections.map((section, index) => (
                <div key={section.id}>
                  {section.type === "text" && (
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  )}
                  {section.type === "image" && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img
                        src={typeof section.content === "string" ? section.content : ''}
                        alt={`Section ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  {section.type === "video" && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <iframe
                        src={typeof section.content === "string" ? section.content : ''}
                        title={`Video ${index + 1}`}
                        className="w-full h-96"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  {section.type === "list" && (
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {typeof section.content === "string" && section.content.split('\n').map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Related Content */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              {locale === "zh" ? "相关内容" : "Related Content"}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 这里可以添加相关内容推荐 */}
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">
                  {locale === "zh" ? "相关内容推荐功能开发中" : "Related content recommendation feature coming soon"}
                </p>
              </div>
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">
                  {locale === "zh" ? "相关内容推荐功能开发中" : "Related content recommendation feature coming soon"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Edit Button */}
      <div className="fixed bottom-8 right-8">
        <Link
          href={`/${locale}/admin?edit=${content.id}`}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {locale === "zh" ? "编辑内容" : "Edit Content"}
        </Link>
      </div>
    </div>
  );
}
