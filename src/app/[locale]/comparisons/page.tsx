import Link from 'next/link'
import { type Locale } from '@/lib/i18n-config'
import { translations } from '@/lib/i18n-config'
import type { Metadata } from 'next'

interface ComparisonsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ComparisonsPageProps): Promise<Metadata> {
  const { locale } = await params

  return {
    title: locale === 'zh' ? '产品对比 - 详细对比评测' : 'Comparisons - Detailed Product Reviews',
    description: locale === 'zh' ? '详细的产品对比评测，帮助您做出最佳选择' : 'Detailed product comparisons to help you make the best choice',
    keywords: 'comparison, review, vs, comparison chart',
    alternates: {
      canonical: `/${locale}/comparisons`,
      languages: {
        en: '/en/comparisons',
        zh: '/zh/comparisons',
      },
    },
  }
}

export default async function ComparisonsPage({ params }: ComparisonsPageProps) {
  const { locale } = await params

  const comparisons = [
    {
      id: 'vultr-vs-digitalocean',
      productA: 'Vultr',
      productB: 'DigitalOcean',
      title: locale === 'zh' ? 'Vultr vs DigitalOcean' : 'Vultr vs DigitalOcean',
      description: locale === 'zh' ? '两大云服务商的全面对比，哪个更适合你？' : 'Comprehensive comparison of two major cloud providers - which is right for you?',
      category: locale === 'zh' ? '云主机' : 'Cloud Hosting',
      features: locale === 'zh' ? ['性能对比', '价格对比', '支持对比'] : ['Performance', 'Pricing', 'Support'],
      iconA: '🚀',
      iconB: '☁️',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'chatgpt-vs-claude',
      productA: 'ChatGPT',
      productB: 'Claude',
      title: locale === 'zh' ? 'ChatGPT vs Claude' : 'ChatGPT vs Claude',
      description: locale === 'zh' ? '两大AI助手的深度对比，选择最适合你的工具' : 'In-depth comparison of two major AI assistants - choose the right one',
      category: locale === 'zh' ? 'AI工具' : 'AI Tools',
      features: locale === 'zh' ? ['功能对比', '响应速度', '价格对比'] : ['Features', 'Response Speed', 'Pricing'],
      iconA: '🤖',
      iconB: '🧠',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'react-vs-vue',
      productA: 'React',
      productB: 'Vue.js',
      title: locale === 'zh' ? 'React vs Vue.js' : 'React vs Vue.js',
      description: locale === 'zh' ? '主流前端框架的对比，新手应该选择哪个？' : 'Comparison of popular frontend frameworks - which should beginners choose?',
      category: locale === 'zh' ? '前端框架' : 'Frontend Frameworks',
      features: locale === 'zh' ? ['学习曲线', '生态系统', '性能'] : ['Learning Curve', 'Ecosystem', 'Performance'],
      iconA: '⚛️',
      iconB: '💚',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'docker-vs-kubernetes',
      productA: 'Docker',
      productB: 'Kubernetes',
      title: locale === 'zh' ? 'Docker vs Kubernetes' : 'Docker vs Kubernetes',
      description: locale === 'zh' ? '容器化技术的对比，何时使用哪一个？' : 'Comparison of containerization technologies - when to use which?',
      category: locale === 'zh' ? 'DevOps' : 'DevOps',
      features: locale === 'zh' ? ['适用场景', '复杂度', '学习成本'] : ['Use Cases', 'Complexity', 'Learning Cost'],
      iconA: '🐳',
      iconB: '☸️',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'nextjs-vs-nuxt',
      productA: 'Next.js',
      productB: 'Nuxt.js',
      title: locale === 'zh' ? 'Next.js vs Nuxt.js' : 'Next.js vs Nuxt.js',
      description: locale === 'zh' ? 'React和Vue生态系统的顶级框架对比' : 'Comparison of top frameworks in React and Vue ecosystems',
      category: locale === 'zh' ? '前端框架' : 'Frontend Frameworks',
      features: locale === 'zh' ? ['SSG/SSR', '性能', '生态系统'] : ['SSG/SSR', 'Performance', 'Ecosystem'],
      iconA: '▲',
      iconB: '🟢',
      gradient: 'from-pink-500 to-pink-600'
    },
  ]

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              ⚖️ Product Comparisons
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'zh' ? '产品对比评测' : 'Product Comparisons'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'zh' ? '详细的产品对比，帮助您做出明智的选择' : 'Detailed product comparisons to help you make informed decisions'}
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {comparisons.map((comparison) => (
            <Link
              key={comparison.id}
              href={`/${locale}/comparisons/${comparison.id}`}
              className="group card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${comparison.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              <div className="relative">
                {/* VS Badge */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-4xl">{comparison.iconA}</span>
                  <span className="text-2xl font-bold text-gray-400">VS</span>
                  <span className="text-4xl">{comparison.iconB}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{comparison.category}</span>
                  <span className={`px-3 py-1 bg-gradient-to-r ${comparison.gradient} text-white rounded-full text-xs font-medium`}>
                    {locale === 'zh' ? '详细对比' : 'Detailed'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {comparison.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {comparison.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    {locale === 'zh' ? '对比内容' : 'Comparison Points'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comparison.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full btn bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  {locale === 'zh' ? '查看完整对比' : 'View Full Comparison'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center section-divider">
            {locale === 'zh' ? '如何使用产品对比' : 'How to Use Comparisons'}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {locale === 'zh' ? '确定需求' : 'Identify Your Needs'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' ? '明确你需要什么功能和预算范围' : 'Clarify what features you need and your budget'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {locale === 'zh' ? '选择对比' : 'Choose Comparison'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' ? '选择相关的产品对比文章' : 'Select relevant comparison articles'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {locale === 'zh' ? '做出决定' : 'Make Decision'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' ? '根据对比结果做出最适合的选择' : 'Make the best choice based on comparison results'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
