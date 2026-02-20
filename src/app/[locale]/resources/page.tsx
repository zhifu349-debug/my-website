import Link from 'next/link'
import { type Locale } from '@/lib/i18n-config'
import { translations } from '@/lib/i18n-config'
import type { Metadata } from 'next'

interface ResourcesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ResourcesPageProps): Promise<Metadata> {
  const { locale } = await params

  return {
    title: locale === 'zh' ? '资源 - 深度指南和资源' : 'Resources - In-depth Guides',
    description: locale === 'zh' ? '高质量的学习资源和工具，提升你的技能' : 'High-quality learning resources and tools to boost your skills',
    keywords: 'resources, guides, tools, learning materials',
    alternates: {
      canonical: `/${locale}/resources`,
      languages: {
        en: '/en/resources',
        zh: '/zh/resources',
      },
    },
  }
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { locale } = await params

  const resources = [
    {
      id: 'vps-guide',
      title: locale === 'zh' ? 'VPS主机完全指南' : 'Complete VPS Hosting Guide',
      description: locale === 'zh' ? '从选择到部署，全方位掌握VPS主机知识' : 'Master VPS hosting knowledge from selection to deployment',
      type: locale === 'zh' ? '指南' : 'Guide',
      price: '$29',
      rating: 4.8,
      downloads: locale === 'zh' ? '5,000+' : '5,000+',
      icon: '📦',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'docker-masterclass',
      title: locale === 'zh' ? 'Docker 精通课程' : 'Docker Mastery Course',
      description: locale === 'zh' ? '从入门到专家的完整Docker学习路径' : 'Complete Docker learning path from beginner to expert',
      type: locale === 'zh' ? '课程' : 'Course',
      price: '$49',
      rating: 4.7,
      downloads: locale === 'zh' ? '3,200+' : '3,200+',
      icon: '🐳',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'react-patterns',
      title: locale === 'zh' ? 'React 设计模式手册' : 'React Design Patterns Handbook',
      description: locale === 'zh' ? '20+种React设计模式，提升代码质量' : '20+ React design patterns to improve code quality',
      type: locale === 'zh' ? '手册' : 'Handbook',
      price: '$19',
      rating: 4.6,
      downloads: locale === 'zh' ? '2,800+' : '2,800+',
      icon: '⚛️',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'api-security',
      title: locale === 'zh' ? 'API 安全最佳实践' : 'API Security Best Practices',
      description: locale === 'zh' ? '保护你的API免受各种安全威胁' : 'Protect your API from various security threats',
      type: locale === 'zh' ? '安全' : 'Security',
      price: '$35',
      rating: 4.9,
      downloads: locale === 'zh' ? '1,500+' : '1,500+',
      icon: '🔒',
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'performance-optimization',
      title: locale === 'zh' ? 'Web性能优化完整指南' : 'Complete Web Performance Optimization Guide',
      description: locale === 'zh' ? '提升网站速度和用户体验的50+技巧' : '50+ tips to improve website speed and user experience',
      type: locale === 'zh' ? '优化' : 'Optimization',
      price: '$39',
      rating: 4.8,
      downloads: locale === 'zh' ? '4,200+' : '4,200+',
      icon: '⚡',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'cloud-deployment',
      title: locale === 'zh' ? '云部署实战指南' : 'Cloud Deployment Guide',
      description: locale === 'zh' ? '掌握AWS、Google Cloud、Azure等云平台部署' : 'Master deployment on AWS, Google Cloud, Azure, and more',
      type: locale === 'zh' ? '实战' : 'Practice',
      price: '$59',
      rating: 4.7,
      downloads: locale === 'zh' ? '2,100+' : '2,100+',
      icon: '☁️',
      gradient: 'from-pink-500 to-pink-600'
    },
  ]

  return (
    <div>
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              📦 Premium Resources
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'zh' ? '学习资源库' : 'Learning Resources'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'zh' ? '高质量的指南、课程和工具，加速你的成长' : 'High-quality guides, courses, and tools to accelerate your growth'}
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={`/${locale}/resources/${resource.id}`}
              className="group card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${resource.gradient} p-6 text-white`}>
                <div className="text-5xl mb-3">{resource.icon}</div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                    {resource.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539 1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span className="font-bold">{resource.rating}/5</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold gradient-text">{resource.price}</span>
                    <span className="text-gray-600 ml-1 text-sm">
                      {locale === 'zh' ? '一次性' : 'one-time'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {resource.downloads} {locale === 'zh' ? '下载' : 'downloads'}
                  </span>
                </div>
                <button className="w-full btn bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl">
                  {locale === 'zh' ? '查看详情' : 'View Details'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {locale === 'zh' ? '为什么选择我们的资源？' : 'Why Choose Our Resources?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                🎯
              </div>
              <h3 className="font-bold mb-2">
                {locale === 'zh' ? '实用导向' : 'Practical'}
              </h3>
              <p className="text-white/90 text-sm">
                {locale === 'zh' ? '所有内容都来自实战经验' : 'All content from real-world experience'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                📈
              </div>
              <h3 className="font-bold mb-2">
                {locale === 'zh' ? '持续更新' : 'Updated'}
              </h3>
              <p className="text-white/90 text-sm">
                {locale === 'zh' ? '内容定期更新，保持最新' : 'Content updated regularly'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                💯
              </div>
              <h3 className="font-bold mb-2">
                {locale === 'zh' ? '质量保证' : 'Quality'}
              </h3>
              <p className="text-white/90 text-sm">
                {locale === 'zh' ? '经过严格的质量审查' : 'Thoroughly quality reviewed'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
