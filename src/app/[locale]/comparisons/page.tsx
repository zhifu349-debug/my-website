import Link from "next/link";
import type { Metadata } from "next";
import { comparisons } from "@/lib/data/content-data";
import Comments from "@/components/Comments";

interface ComparisonsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ComparisonsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh
      ? "产品对比评测 - Vultr vs DigitalOcean、ChatGPT vs Claude"
      : "Product Comparisons - Vultr vs DigitalOcean, ChatGPT vs Claude",
    description: isZh
      ? "深度的产品对比分析：Vultr vs DigitalOcean云主机对比，ChatGPT vs Claude AI助手对比。数据驱动的选购指南。"
      : "In-depth product comparisons: Vultr vs DigitalOcean cloud hosting, ChatGPT vs Claude AI assistant. Data-driven buying guide.",
    keywords: "comparison, vs, vultr vs digitalocean, chatgpt vs claude, product comparison",
    alternates: {
      canonical: `/${locale}/comparisons`,
      languages: {
        en: "/en/comparisons",
        zh: "/zh/comparisons",
      },
    },
  };
}

export default async function ComparisonsPage({
  params,
}: ComparisonsPageProps) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              ⚖️ {isZh ? "产品深度对比" : "In-Depth Comparisons"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {isZh ? "产品对比评测" : "Product Comparisons"}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isZh
              ? "详细的产品对比分析，帮助你做出最明智的选择"
              : "Detailed product analysis to help you make the best choice"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "性能实测" : "Performance Tests"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "价格对比" : "Price Comparison"}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              ✓ {isZh ? "场景推荐" : "Use Case Recommendations"}
            </span>
          </div>
        </div>
      </div>

      {/* Comparisons Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {comparisons.map((comparison) => (
            <Link
              key={comparison.id}
              href={`/${locale}/comparisons/${comparison.slug}`}
              className="group card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative">
                {/* VS Badge */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg">
                    {comparison.products[0] === "vultr"
                      ? "🚀"
                      : comparison.products[0] === "chatgpt"
                      ? "🤖"
                      : "💻"}
                  </div>
                  <div className="text-2xl font-bold text-gray-400 bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                    VS
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                    {comparison.products[1] === "digitalocean"
                      ? "☁️"
                      : comparison.products[1] === "claude"
                      ? "🧠"
                      : "⚙️"}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {isZh ? "深度对比" : "Detailed"}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-primary transition-colors">
                  {(comparison.title as any)[locale] || comparison.title.en}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-center">
                  {(comparison.summary as any)[locale] || comparison.summary.en}
                </p>

                {/* Comparison Points */}
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {comparison.comparisonTable.slice(0, 5).map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm"
                      >
                        {item.feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verdict Preview */}
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center line-clamp-2">
                    <span className="font-semibold">{isZh ? "结论：" : "Verdict: "}</span>
                    {(comparison.verdit as any)[locale] || comparison.verdit.en}
                  </p>
                </div>

                <button className="w-full btn bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                  {isZh ? "查看完整对比" : "View Full Comparison"}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comparison Guide */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center section-divider inline-block w-full">
            {isZh ? "如何选择适合你的产品" : "How to Choose the Right Product"}
          </h2>
          <div className="space-y-6 mt-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                  {isZh ? "明确你的需求" : "Define Your Requirements"}
                </h3>
                <p className="text-gray-600">
                  {isZh
                    ? "列出你的核心需求：性能、价格、支持、功能等。优先级排序有助于做出决策。"
                    : "List your core needs: performance, price, support, features. Prioritizing helps make decisions."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600 text-lg">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                  {isZh ? "阅读详细对比" : "Read Detailed Comparisons"}
                </h3>
                <p className="text-gray-600">
                  {isZh
                    ? "查看我们的深度对比文章，了解每个产品的优缺点和适用场景。"
                    : "Check our in-depth comparison articles to understand pros, cons, and use cases."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600 text-lg">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                  {isZh ? "免费试用" : "Try Before You Buy"}
                </h3>
                <p className="text-gray-600">
                  {isZh
                    ? "大多数产品都提供免费试用，亲身体验后再做决定。"
                    : "Most products offer free trials. Experience them firsthand before deciding."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 评论区 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <Comments path={`/${locale}/comparisons`} locale={locale as "en" | "zh"} />
      </section>
    </div>
  );
}
