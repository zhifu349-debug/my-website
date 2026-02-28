import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import { translations } from "@/lib/i18n-config";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = translations[locale as Locale] || translations.en;

  const isEnglish = locale === "en";

  // Content based on locale
  const content = isEnglish
    ? {
        hero: {
          title: "About xcodezg",
          subtitle:
            "Your trusted source for tech reviews and comparisons. We help developers and tech enthusiasts make informed decisions.",
        },
        mission: {
          title: "Our Mission",
          description:
            "We believe everyone deserves access to honest, in-depth tech reviews. Our mission is to cut through the marketing noise and provide you with the information you actually need to choose the right tools and services for your projects.",
          points: [
            "Unbiased, data-driven reviews",
            "Real-world testing and benchmarks",
            "Transparent affiliate relationships",
            "Community-focused approach",
          ],
        },
        story: {
          title: "Our Story",
          description:
            "Founded in 2024, xcodezg started as a small blog sharing VPS hosting experiences. Today, we've grown into a comprehensive resource covering VPS hosting, AI tools, development tutorials, and tech comparisons.",
          timeline: [
            { year: "2024", event: "xcodezg founded" },
            { year: "2024", event: "First 50 in-depth reviews published" },
            { year: "2025", event: "Expanded to AI tools coverage" },
            { year: "2026", event: "Reaching developers worldwide" },
          ],
        },
        team: {
          title: "Our Team Philosophy",
          description:
            "We're a team of developers, system administrators, and tech enthusiasts who believe in the power of knowledge sharing. While we prefer to let our work speak for itself, here's what drives us:",
          values: [
            {
              title: "Technical Excellence",
              desc: "Every review is backed by hands-on testing and real-world usage",
            },
            {
              title: "Transparency First",
              desc: "Clear disclosure of affiliate relationships and testing methodologies",
            },
            {
              title: "Community Driven",
              desc: "We listen to our readers and prioritize content that matters to you",
            },
          ],
        },
        trust: {
          title: "Why Trust Us?",
          description:
            "We understand that trust must be earned. Here's how we maintain our integrity:",
          points: [
            "Independent testing - no sponsored reviews",
            "Real user feedback integrated into our analysis",
            "Regular content updates to ensure accuracy",
            "Clear methodology explained in every review",
          ],
        },
        contact: {
          title: "Get in Touch",
          description:
            "Have questions, suggestions, or feedback? We'd love to hear from you.",
          email: "hello@xcodezg.com",
          response: "We typically respond within 24-48 hours",
        },
        stats: {
          title: "By the Numbers",
          items: [
            { value: "50+", label: "In-Depth Reviews" },
            { value: "10+", label: "Expert Contributors" },
            { value: "99%", label: "Reader Satisfaction" },
          ],
        },
      }
    : {
        hero: {
          title: "关于 xcodezg",
          subtitle:
            "您值得信赖的技术评测与对比平台。我们帮助开发者和科技爱好者做出明智的决策。",
        },
        mission: {
          title: "我们的使命",
          description:
            "我们相信每个人都应该获得诚实、深入的技术评测。我们的使命是穿透营销噪音，为您提供真正需要的信息，帮助您为项目选择正确的工具和服务。",
          points: [
            "公正、数据驱动的评测",
            "真实世界测试和基准测试",
            "透明的联盟关系",
            "以社区为中心的方法",
          ],
        },
        story: {
          title: "我们的故事",
          description:
            "xcodezg 成立于2024年，最初是一个分享VPS主机使用经验的小博客。如今，我们已发展成为涵盖VPS主机、AI工具、开发教程和技术对比的综合资源平台。",
          timeline: [
            { year: "2024", event: "xcodezg 成立" },
            { year: "2024", event: "发布首批50篇深度评测" },
            { year: "2025", event: "扩展至AI工具领域" },
            { year: "2026", event: "服务全球开发者" },
          ],
        },
        team: {
          title: "我们的团队理念",
          description:
            "我们是一支由开发者、系统管理员和科技爱好者组成的团队，相信知识分享的力量。虽然我们更愿意让工作本身说话，但以下是驱动我们的核心理念：",
          values: [
            {
              title: "技术卓越",
              desc: "每篇评测都以实际测试和真实使用体验为基础",
            },
            {
              title: "透明至上",
              desc: "清楚披露联盟关系和测试方法论",
            },
            {
              title: "社区驱动",
              desc: "我们倾听读者声音，优先创作对您有价值的内容",
            },
          ],
        },
        trust: {
          title: "为什么信任我们？",
          description: "我们理解信任需要赢得。以下是我们如何保持诚信：",
          points: [
            "独立测试 - 不接受付费评测",
            "将真实用户反馈纳入分析",
            "定期更新内容确保准确性",
            "每篇评测都解释清楚方法论",
          ],
        },
        contact: {
          title: "联系我们",
          description: "有问题、建议或反馈？我们很乐意听取您的意见。",
          email: "hello@xcodezg.com",
          response: "我们通常在24-48小时内回复",
        },
        stats: {
          title: "数据一览",
          items: [
            { value: "50+", label: "深度评测" },
            { value: "10+", label: "专家贡献者" },
            { value: "99%", label: "读者满意度" },
          ],
        },
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
              {isEnglish ? "Building Trust Since 2024" : "自2024年开始建立信任"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-6 animate-fade-in">
            {content.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {content.hero.subtitle}
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {content.stats.items.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 section-divider inline-block">
              {content.mission.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {content.mission.description}
            </p>
            <ul className="space-y-3">
              {content.mission.points.map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl transform rotate-3 opacity-10"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900">
                    {isEnglish ? "Accuracy" : "准确性"}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="font-semibold text-gray-900">
                    {isEnglish ? "Transparency" : "透明度"}
                  </div>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">💡</div>
                  <div className="font-semibold text-gray-900">
                    {isEnglish ? "Insight" : "洞察力"}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">🤝</div>
                  <div className="font-semibold text-gray-900">
                    {isEnglish ? "Community" : "社区"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-blue-50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            {content.story.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.story.description}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            {content.story.timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="w-5/12 text-right pr-8">
                  {index % 2 === 0 && (
                    <>
                      <div className="text-2xl font-bold gradient-text">
                        {item.year}
                      </div>
                      <div className="text-gray-600">{item.event}</div>
                    </>
                  )}
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                </div>
                <div className="w-5/12 pl-8">
                  {index % 2 === 1 && (
                    <>
                      <div className="text-2xl font-bold gradient-text">
                        {item.year}
                      </div>
                      <div className="text-gray-600">{item.event}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Philosophy */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-divider inline-block">
            {content.team.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.team.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.team.values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
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
                {value.title}
              </h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-green-50 rounded-3xl my-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 section-divider inline-block">
              {content.trust.title}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {content.trust.description}
            </p>
            <ul className="space-y-4">
              {content.trust.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
              <div className="text-3xl font-bold gradient-text">4.8/5.0</div>
              <div className="text-gray-600 mt-2">
                {isEnglish
                  ? "Based on user feedback and reviews"
                  : "基于用户反馈和评价"}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">5 ★</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">4 ★</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">10%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">3 ★</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[3%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">3%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">2 ★</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[1%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">1%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">1 ★</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[1%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">1%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {content.contact.title}
          </h2>
          <p className="text-gray-600 mb-6">{content.contact.description}</p>
          <a
            href={`mailto:${content.contact.email}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
          >
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {content.contact.email}
          </a>
          <p className="text-sm text-gray-500 mt-4">{content.contact.response}</p>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="max-w-4xl mx-auto px-4 py-12 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t.home.affiliateDisclosure}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.home.affiliateDisclosureText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
