import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import { translations } from "@/lib/i18n-config";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const translations_data = translations[locale as Locale] || translations.en;

  const categories = [
    {
      href: `/${locale}/vps`,
      title: translations_data.home.vps.title,
      description: translations_data.home.vps.description,
      icon: "🖥️",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      href: `/${locale}/ai-tools`,
      title: translations_data.home.aiTools.title,
      description: translations_data.home.aiTools.description,
      icon: "🤖",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      href: `/${locale}/tutorials`,
      title: translations_data.home.tutorials.title,
      description: translations_data.home.tutorials.description,
      icon: "📚",
      gradient: "from-green-500 to-green-600",
    },
    {
      href: `/${locale}/comparisons`,
      title: translations_data.home.comparisons.title,
      description: translations_data.home.comparisons.description,
      icon: "⚖️",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      href: `/${locale}/resources`,
      title: translations_data.home.resources.title,
      description: translations_data.home.resources.description,
      icon: "📦",
      gradient: "from-pink-500 to-pink-600",
    },
  ];

  // Featured content data - covering main categories: VPS, AI Tools, Tutorials
  const isEnglish = locale === "en";
  const featuredContent = isEnglish
    ? [
        {
          title: "Best VPS Hosting for Developers in 2026",
          description:
            "Comprehensive comparison of DigitalOcean, Vultr, and Linode. Find the perfect VPS for your projects.",
          category: "VPS",
          readTime: "12 min read",
          rating: 4.9,
          href: `/${locale}/vps`,
          gradient: "from-blue-500 to-blue-600",
        },
        {
          title: "ChatGPT vs Claude: AI Assistant Showdown",
          description:
            "Detailed comparison of the two leading AI assistants. Which one is right for your workflow?",
          category: "AI Tools",
          readTime: "8 min read",
          rating: 4.8,
          href: `/${locale}/ai-tools`,
          gradient: "from-purple-500 to-purple-600",
        },
        {
          title: "Complete Docker Deployment Guide",
          description:
            "Step-by-step tutorial for deploying applications with Docker. From beginner to production.",
          category: "Tutorial",
          readTime: "15 min read",
          rating: 4.9,
          href: `/${locale}/tutorials`,
          gradient: "from-green-500 to-green-600",
        },
      ]
    : [
        {
          title: "2026年开发者最佳VPS主机推荐",
          description:
            "DigitalOcean、Vultr和Linode的全面对比。为您的项目找到完美的VPS主机。",
          category: "VPS",
          readTime: "12分钟阅读",
          rating: 4.9,
          href: `/${locale}/vps`,
          gradient: "from-blue-500 to-blue-600",
        },
        {
          title: "ChatGPT vs Claude：AI助手对决",
          description:
            "两大领先AI助手的详细对比。哪个更适合您的工作流程？",
          category: "AI工具",
          readTime: "8分钟阅读",
          rating: 4.8,
          href: `/${locale}/ai-tools`,
          gradient: "from-purple-500 to-purple-600",
        },
        {
          title: "Docker容器部署完全指南",
          description:
            "使用Docker部署应用的分步教程。从入门到生产环境。",
          category: "教程",
          readTime: "15分钟阅读",
          rating: 4.9,
          href: `/${locale}/tutorials`,
          gradient: "from-green-500 to-green-600",
        },
      ];

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
              ✨ Expert Tech Reviews Since 2024
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 animate-fade-in">
            {translations_data.home.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {translations_data.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/vps`}
              className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            >
              {translations_data.cta.getStarted}
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 border border-gray-200 transition-all duration-300"
            >
              {translations_data.cta.learnMore}
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
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
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">50+</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">In-Depth Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">4.8</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">Since 2024</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">Building Trust</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">100%</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">Free Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            Explore Our Content
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a category to find the perfect tools and services for your
            needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className="group card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-200">
                  {translations_data.cta.tryNow}
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
      </section>

      {/* Featured Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white rounded-3xl my-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            ⭐ {isEnglish ? "Editor's Picks" : "编辑精选"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            {isEnglish ? "Featured Content" : "精选内容"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEnglish
              ? "Hand-picked reviews and tutorials to get you started"
              : "精心挑选的评测和教程，助您快速入门"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredContent.map((content, index) => (
            <Link
              key={index}
              href={content.href}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`h-2 bg-gradient-to-r ${content.gradient}`}
              ></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${content.gradient} text-white`}
                  >
                    {content.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {content.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {content.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {content.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">
                      {content.rating}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                    {isEnglish ? "Read More" : "阅读更多"}
                    <svg
                      className="w-4 h-4"
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
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-blue-50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            Why Choose Us
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
              Verified Reviews
            </h3>
            <p className="text-gray-600">
              In-depth, honest reviews from real users and experts
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast & Reliable
            </h3>
            <p className="text-gray-600">
              Quick access to the information you need, anytime
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600">
              No hidden fees, all content completely free
            </p>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="max-w-4xl mx-auto px-4 py-12 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {translations_data.home.affiliateDisclosure}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {translations_data.home.affiliateDisclosureText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
