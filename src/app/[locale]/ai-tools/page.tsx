import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import { translations } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { aiTools } from "@/lib/data/content-data";
import { seoEngine } from "@/lib/seo-engine";

interface AIToolsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AIToolsPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "zh"
        ? "2026年最佳AI工具推荐 - ChatGPT、Claude、Midjourney深度评测"
        : "Best AI Tools 2026 - ChatGPT, Claude, Midjourney Reviewed",
    description:
      locale === "zh"
        ? "发现2026年最强大的AI工具，包括ChatGPT、Claude、Midjourney、GitHub Copilot的深度评测与对比，帮你找到最适合的AI助手"
        : "Discover the best AI tools of 2026. In-depth reviews of ChatGPT, Claude, Midjourney, and GitHub Copilot with real testing data.",
    keywords:
      "AI tools, ChatGPT, Midjourney, Claude, GitHub Copilot, Notion AI, artificial intelligence, 2026",
    alternates: {
      canonical: `/${locale}/ai-tools`,
      languages: {
        en: "/en/ai-tools",
        zh: "/zh/ai-tools",
      },
    },
  };
}

export default async function AIToolsPage({ params }: AIToolsPageProps) {
  const { locale } = await params;
  const isZh = locale === "zh";

  const seo = seoEngine.generateSEO("recommendation" as any, {
    keyword: isZh ? "最佳ai工具" : "best ai tools",
    category: isZh ? "AI工具" : "AI Tools",
  });

  const schema = seoEngine.generateSchema(
    "recommendation" as any,
    {
      title: seo.title,
      description: seo.description,
      solutions: aiTools,
    },
    `/${locale}/ai-tools`
  );

  const categories = [
    { id: "all", name: isZh ? "全部" : "All" },
    { id: "ai-writing", name: isZh ? "AI写作" : "AI Writing" },
    { id: "ai-image", name: isZh ? "AI图像" : "AI Image" },
    { id: "ai-coding", name: isZh ? "AI编程" : "AI Coding" },
    { id: "ai-productivity", name: isZh ? "AI生产力" : "AI Productivity" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              🤖 {isZh ? "2026年AI工具精选" : "Best AI Tools 2026"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {isZh ? "最佳AI工具推荐" : "Best AI Tools 2026"}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isZh
              ? "经过实测的AI工具评测，帮你找到最适合的人工智能助手"
              : "Real-world tested AI tools to find your perfect AI assistant"}
          </p>
          
          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "测试15+款工具" : "15+ Tools Tested"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "真实使用体验" : "Real Usage Experience"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "持续更新" : "Continuously Updated"}
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
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {aiTools.map((tool) => (
            <div
              key={tool.id}
              className="group card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {isZh
                    ? tool.category === "ai-writing"
                      ? "AI写作"
                      : tool.category === "ai-image"
                      ? "AI图像"
                      : tool.category === "ai-coding"
                      ? "AI编程"
                      : "AI生产力"
                    : tool.category.replace("ai-", "")}
                </span>
              </div>

              <div className="relative">
                {/* Icon & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                    {tool.id === "chatgpt" && "💬"}
                    {tool.id === "claude" && "🧠"}
                    {tool.id === "midjourney" && "🎨"}
                    {tool.id === "github-copilot" && "💻"}
                    {tool.id === "notion-ai" && "📝"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(tool.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">{tool.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {(tool.description as any)[locale] || tool.description.en}
                </p>

                {/* Best For */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.bestFor.map((use) => (
                    <span
                      key={use}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                    >
                      {use}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold gradient-text">
                      {tool.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {isZh ? "起" : "starting"}
                    </span>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-bold text-green-700 mb-2 text-sm">
                      {isZh ? "优势" : "Pros"}
                    </h4>
                    <ul className="space-y-1">
                      {tool.pros.slice(0, 3).map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-700"
                        >
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="line-clamp-2">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-bold text-red-700 mb-2 text-sm">
                      {isZh ? "缺点" : "Cons"}
                    </h4>
                    <ul className="space-y-1">
                      {tool.cons.slice(0, 3).map((con, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-700"
                        >
                          <span className="text-red-500 mt-0.5">✗</span>
                          <span className="line-clamp-2">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  {isZh ? "访问官网" : "Visit Website"}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Choose Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-blue-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            {isZh ? "如何选择AI工具" : "How to Choose AI Tools"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isZh
              ? "根据你的具体需求选择最适合的AI工具"
              : "Choose the right AI tool based on your specific needs"}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isZh ? "明确使用场景" : "Define Use Case"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isZh
                ? "写作、编程、图像生成还是数据分析？不同工具擅长不同领域"
                : "Writing, coding, image generation or data analysis? Different tools excel in different areas"}
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isZh ? "评估预算" : "Evaluate Budget"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isZh
                ? "从免费版到$20/月不等，选择符合你预算的方案"
                : "From free plans to $20/month, choose a plan that fits your budget"}
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isZh ? "试用再决定" : "Try Before Buying"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isZh
                ? "大多数AI工具都提供免费试用，先体验再订阅"
                : "Most AI tools offer free trials, experience before subscribing"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
