import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import { translations } from "@/lib/i18n-config";
import type { Metadata } from "next";

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
        ? "AI工具推荐 - 最佳人工智能工具"
        : "Best AI Tools 2026 - Top AI Software Reviewed",
    description:
      locale === "zh"
        ? "发现最佳AI工具，包括ChatGPT、Midjourney等，帮助您提高效率"
        : "Discover the best AI tools including ChatGPT, Midjourney, and more to boost your productivity",
    keywords:
      "AI tools, ChatGPT, Midjourney, AI software, artificial intelligence",
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

  const tools = [
    {
      name: "ChatGPT",
      description:
        locale === "zh"
          ? "强大的AI对话助手，支持写作、编程和分析"
          : "Powerful AI assistant for writing, coding, and analysis",
      price: "$20/mo",
      rating: 4.8,
      href: "https://chat.openai.com",
      pros:
        locale === "zh"
          ? ["强大的自然语言处理", "支持多种任务", "持续更新", "API可用"]
          : [
              "Powerful NLP",
              "Multi-task support",
              "Regular updates",
              "API available",
            ],
      cons:
        locale === "zh"
          ? ["需要订阅", "有时响应慢", "知识截止"]
          : [
              "Subscription required",
              "Slow response sometimes",
              "Knowledge cutoff",
            ],
      gradient: "from-green-500 to-green-600",
      icon: "🤖",
    },
    {
      name: "Midjourney",
      description:
        locale === "zh"
          ? "领先的AI图像生成工具，创建惊艳的艺术作品"
          : "Leading AI image generation tool for creating stunning artwork",
      price: "$10-35/mo",
      rating: 4.6,
      href: "https://www.midjourney.com",
      pros:
        locale === "zh"
          ? ["高质量图像", "创意性强", "社区活跃", "持续改进"]
          : [
              "High quality images",
              "Very creative",
              "Active community",
              "Constantly improving",
            ],
      cons:
        locale === "zh"
          ? ["Discord操作", "学习曲线", "需要信用卡"]
          : ["Discord-based", "Learning curve", "Credit card required"],
      gradient: "from-purple-500 to-purple-600",
      icon: "🎨",
    },
    {
      name: "Claude",
      description:
        locale === "zh"
          ? "Anthropic开发的AI助手，擅长复杂推理"
          : "AI assistant by Anthropic, excels at complex reasoning",
      price: "$20/mo",
      rating: 4.7,
      href: "https://claude.ai",
      pros:
        locale === "zh"
          ? ["长上下文", "安全性高", "多语言支持", "快速响应"]
          : [
              "Long context",
              "High security",
              "Multi-language",
              "Fast response",
            ],
      cons:
        locale === "zh"
          ? ["功能相对较少", "无图像生成", "区域限制"]
          : ["Fewer features", "No image generation", "Regional restrictions"],
      gradient: "from-blue-500 to-blue-600",
      icon: "🧠",
    },
    {
      name: "Notion AI",
      description:
        locale === "zh"
          ? "集成AI的生产力工具，智能写作和整理"
          : "Productivity tool with integrated AI for smart writing and organization",
      price: "$8-15/mo",
      rating: 4.5,
      href: "https://www.notion.so",
      pros:
        locale === "zh"
          ? ["一体化工作区", "团队协作", "模板丰富", "离线可用"]
          : [
              "All-in-one workspace",
              "Team collaboration",
              "Rich templates",
              "Offline available",
            ],
      cons:
        locale === "zh"
          ? ["同步可能慢", "学习成本", "移动端体验一般"]
          : ["Slow sync", "Learning cost", "Average mobile experience"],
      gradient: "from-orange-500 to-orange-600",
      icon: "📝",
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              🚀 AI Tools Collection 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === "zh" ? "最佳AI工具推荐" : "Best AI Tools 2026"}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === "zh"
              ? "发现最强大的人工智能工具，提升您的工作效率"
              : "Discover the most powerful AI tools to boost your productivity"}
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={`/${locale}/ai-tools/${tool.name.toLowerCase()}`}
              className="group card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
              ></div>
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold gradient-text">
                      {tool.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {locale === "zh" ? "起" : "starting"}
                    </span>
                  </div>
                  {tool.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539 1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span className="font-bold text-gray-900">
                        {tool.rating}/5
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-bold text-green-700 mb-2 text-sm">
                      {locale === "zh" ? "优势" : "Pros"}
                    </h4>
                    <ul className="space-y-1">
                      {tool.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="text-green-500 mt-0.5">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-bold text-red-700 mb-2 text-sm">
                      {locale === "zh" ? "缺点" : "Cons"}
                    </h4>
                    <ul className="space-y-1">
                      {tool.cons.map((con, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="text-red-500 mt-0.5">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="w-full btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  {locale === "zh" ? "了解更多" : "Learn More"}
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

      <section className="max-w-4xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-blue-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            {locale === "zh" ? "如何选择AI工具" : "How to Choose AI Tools"}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
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
              {locale === "zh" ? "明确需求" : "Define Needs"}
            </h3>
            <p className="text-gray-600">
              {locale === "zh"
                ? "确定你需要什么类型的AI工具"
                : "Identify what type of AI tool you need"}
            </p>
          </div>
          <div className="text-center p-6">
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
              {locale === "zh" ? "考虑预算" : "Consider Budget"}
            </h3>
            <p className="text-gray-600">
              {locale === "zh"
                ? "选择适合你预算的工具"
                : "Choose tools that fit your budget"}
            </p>
          </div>
          <div className="text-center p-6">
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
              {locale === "zh" ? "试用免费版本" : "Try Free Versions"}
            </h3>
            <p className="text-gray-600">
              {locale === "zh"
                ? "大多数工具都有免费试用"
                : "Most tools offer free trials"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
