import Link from "next/link";
import type { Metadata } from "next";
import { resources } from "@/lib/data/content-data";

interface ResourcesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ResourcesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh
      ? "精品资源库 - VPS精通、Docker课程、React设计模式"
      : "Premium Resources - VPS Mastery, Docker Course, React Patterns",
    description: isZh
      ? "高质量技术资源：VPS精通指南、Docker与Kubernetes大师课、React设计模式手册。一次购买，终身更新。"
      : "High-quality tech resources: VPS mastery guide, Docker & Kubernetes course, React patterns handbook. Buy once, get lifetime updates.",
    keywords: "resources, guides, courses, ebooks, tutorials, premium content",
    alternates: {
      canonical: `/${locale}/resources`,
      languages: {
        en: "/en/resources",
        zh: "/zh/resources",
      },
    },
  };
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { locale } = await params;
  const isZh = locale === "zh";

  const categories = [
    { id: "all", name: isZh ? "全部" : "All" },
    { id: "guide", name: isZh ? "指南" : "Guides" },
    { id: "course", name: isZh ? "课程" : "Courses" },
    { id: "handbook", name: isZh ? "手册" : "Handbooks" },
    { id: "security", name: isZh ? "安全" : "Security" },
  ];

  const getCategoryLabel = (category: string) => {
    if (!isZh) return category.charAt(0).toUpperCase() + category.slice(1);
    const labels: Record<string, string> = {
      guide: "指南",
      course: "课程",
      handbook: "手册",
      security: "安全",
      optimization: "优化",
      devops: "DevOps",
    };
    return labels[category] || category;
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              📦 {isZh ? "精品付费资源" : "Premium Resources"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {isZh ? "学习资源库" : "Learning Resources"}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isZh
              ? "高质量的指南、课程和工具，一次购买终身拥有"
              : "High-quality guides, courses, and tools. Buy once, keep forever"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "终身更新" : "Lifetime Updates"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "30天退款保证" : "30-Day Money Back"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "社区支持" : "Community Support"}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat.id === "all"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">
                    {resource.id === "vps-mastery" && "📘"}
                    {resource.id === "docker-course" && "🎓"}
                    {resource.id === "react-patterns" && "📋"}
                    {resource.id === "api-security" && "🔐"}
                    {resource.id === "performance-guide" && "⚡"}
                    {resource.id === "cloud-deploy" && "☁️"}
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span className="font-bold text-sm">{resource.rating}</span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                  {getCategoryLabel(resource.category)}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {(resource.title as any)[locale] || resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  {(resource.description as any)[locale] || resource.description.en}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <ul className="space-y-1">
                    {resource.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                  <span>{resource.downloads.toLocaleString()} {isZh ? "购买" : "sales"}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isZh ? "终身访问" : "Lifetime access"}
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold gradient-text">${resource.price}</span>
                    <span className="text-gray-500 text-sm ml-1">{isZh ? "一次性" : "one-time"}</span>
                  </div>
                  <button className="btn bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    {isZh ? "查看详情" : "Details"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {isZh ? "为什么选择我们的资源？" : "Why Choose Our Resources?"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                🎯
              </div>
              <h3 className="font-bold mb-2 text-lg">{isZh ? "实用导向" : "Practical"}</h3>
              <p className="text-white/90 text-sm">
                {isZh ? "所有内容都来自真实项目经验，可直接应用到工作中" : "All content from real project experience, ready to apply to your work"}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                📈
              </div>
              <h3 className="font-bold mb-2 text-lg">{isZh ? "持续更新" : "Updated"}</h3>
              <p className="text-white/90 text-sm">
                {isZh ? "内容随技术发展持续更新，购买后永久免费获取新版本" : "Content updates with tech evolution, free lifetime updates after purchase"}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                💯
              </div>
              <h3 className="font-bold mb-2 text-lg">{isZh ? "质量保证" : "Quality"}</h3>
              <p className="text-white/90 text-sm">
                {isZh ? "每个资源都经过严格审核和实际测试，确保内容准确可用" : "Every resource is rigorously reviewed and tested to ensure accuracy"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm">{isZh ? "安全支付" : "Secure Payment"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm">{isZh ? "30天退款" : "30-Day Refund"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm">{isZh ? "7x24支持" : "24/7 Support"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
