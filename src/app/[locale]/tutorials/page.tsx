import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { tutorials } from "@/lib/data/content-data";
import { seoEngine } from "@/lib/seo-engine";

interface TutorialsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TutorialsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh
      ? "技术教程库 - V2Ray、Docker、React、Nginx实战指南"
      : "Technical Tutorials - V2Ray, Docker, React, Nginx Guides",
    description: isZh
      ? "全面的技术教程：V2Ray搭建、Docker部署、React优化、Nginx配置。每个教程都包含详细步骤和实战案例。"
      : "Comprehensive tutorials: V2Ray setup, Docker deployment, React optimization, Nginx configuration. Step-by-step guides with real examples.",
    keywords: "tutorials, V2Ray, Docker, React, Nginx, DevOps, frontend, guides",
    alternates: {
      canonical: `/${locale}/tutorials`,
      languages: {
        en: "/en/tutorials",
        zh: "/zh/tutorials",
      },
    },
  };
}

export default async function TutorialsPage({ params }: TutorialsPageProps) {
  const { locale } = await params;
  const isZh = locale === "zh";

  const categories = [
    { id: "all", name: isZh ? "全部" : "All", count: tutorials.length },
    { id: "devops", name: "DevOps", count: tutorials.filter((t) => t.category === "devops").length },
    { id: "frontend", name: isZh ? "前端开发" : "Frontend", count: tutorials.filter((t) => t.category === "frontend").length },
    { id: "security", name: isZh ? "网络安全" : "Security", count: tutorials.filter((t) => t.category === "network-security").length },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-yellow-100 text-yellow-700",
      advanced: "bg-red-100 text-red-700",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };

  const getDifficultyLabel = (difficulty: string) => {
    if (!isZh) return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const labels: Record<string, string> = {
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
    };
    return labels[difficulty] || difficulty;
  };

  const getCategoryLabel = (category: string) => {
    if (!isZh) return category;
    const labels: Record<string, string> = {
      devops: "DevOps",
      frontend: "前端开发",
      "network-security": "网络安全",
    };
    return labels[category] || category;
  };

  const seo = seoEngine.generateSEO("tutorial" as any, {
    keyword: isZh ? "技术教程" : "technical tutorials",
    action: isZh ? "学习最新技术" : "learn latest tech",
  });

  const schema = seoEngine.generateSchema(
    "tutorial" as any,
    {
      title: seo.title,
      description: seo.description,
      steps: tutorials.map((t) => ({ title: (t.title as any)[locale] || t.title.en, content: (t.description as any)[locale] || t.description.en })),
    },
    `/${locale}/tutorials`
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              📚 {isZh ? "实战技术教程" : "Hands-on Tutorials"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {isZh ? "技术教程库" : "Technical Tutorials"}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isZh
              ? "从零到精通，每个教程都包含详细步骤和实战案例"
              : "From zero to hero, each tutorial includes detailed steps and real-world examples"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-white/10 px-4 py-2 rounded-full">✓ {isZh ? "详细步骤" : "Detailed Steps"}</span>
            <span className="bg-white/10 px-4 py-2 rounded-full">✓ {isZh ? "实战案例" : "Real Examples"}</span>
            <span className="bg-white/10 px-4 py-2 rounded-full">✓ {isZh ? "故障排查" : "Troubleshooting"}</span>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat.id === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
              <span className="ml-2 opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <Link
              key={tutorial.id}
              href={`/${locale}/tutorials/${tutorial.slug}`}
              className="group card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative flex-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {tutorial.icon}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {getDifficultyLabel(tutorial.difficulty)}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tutorial.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {(tutorial.title as any)[locale] || tutorial.title.en}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{(tutorial.description as any)[locale] || tutorial.description.en}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{getCategoryLabel(tutorial.category)}</span>
                  <span className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                    {isZh ? "开始学习" : "Start"}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tutorial */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">✨ {isZh ? "精选教程" : "Featured"}</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{isZh ? "V2Ray 完整搭建指南" : "Complete V2Ray Setup Guide"}</h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                {isZh
                  ? "从零开始搭建自己的V2Ray代理服务器，包含服务器选购、V2Ray安装、客户端配置全流程。适合需要科学上网的用户。"
                  : "Build your own V2Ray proxy server from scratch, including VPS selection, V2Ray installation, and client configuration."}
              </p>
              <Link
                href={`/${locale}/tutorials/v2ray-setup`}
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                {isZh ? "开始学习" : "Start Learning"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="text-8xl md:text-9xl opacity-80">🛡️</div>
          </div>
        </div>
      </section>
    </>
  );
}
