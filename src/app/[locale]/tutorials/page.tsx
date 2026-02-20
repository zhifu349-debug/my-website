import Link from 'next/link'
import { type Locale } from '@/lib/i18n-config'
import { translations } from '@/lib/i18n-config'
import type { Metadata } from 'next'

interface TutorialsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TutorialsPageProps): Promise<Metadata> {
  const { locale } = await params

  return {
    title: locale === 'zh' ? '教程 - 分步指南和教程' : 'Tutorials - Step-by-Step Guides',
    description: locale === 'zh' ? '详细的技术教程，帮助您掌握各种技能' : 'Detailed technical tutorials to help you master various skills',
    keywords: 'tutorials, guides, how-to, step by step, technical guides',
    alternates: {
      canonical: `/${locale}/tutorials`,
      languages: {
        en: '/en/tutorials',
        zh: '/zh/tutorials',
      },
    },
  }
}

export default async function TutorialsPage({ params }: TutorialsPageProps) {
  const { locale } = await params
  const translations_data = translations[locale as Locale] || translations.en

  const tutorials = [
    {
      id: 'v2ray-setup',
      title: locale === 'zh' ? 'V2Ray 完整配置教程' : 'Complete V2Ray Setup Guide',
      description: locale === 'zh' ? '从零开始配置V2Ray代理，包括服务器搭建和客户端设置' : 'Set up V2Ray proxy from scratch, including server setup and client configuration',
      category: locale === 'zh' ? '网络安全' : 'Network Security',
      difficulty: 'Intermediate',
      time: locale === 'zh' ? '30 分钟' : '30 min',
      icon: '🛡️',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'docker-deployment',
      title: locale === 'zh' ? 'Docker 容器部署实战' : 'Docker Container Deployment',
      description: locale === 'zh' ? '学习使用Docker部署Web应用，掌握容器化技术' : 'Learn to deploy web apps with Docker and master containerization',
      category: locale === 'zh' ? 'DevOps' : 'DevOps',
      difficulty: 'Beginner',
      time: locale === 'zh' ? '45 分钟' : '45 min',
      icon: '🐳',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'react-performance',
      title: locale === 'zh' ? 'React 性能优化指南' : 'React Performance Optimization',
      description: locale === 'zh' ? '提升React应用性能的20个实用技巧和最佳实践' : '20 practical tips and best practices to improve React app performance',
      category: locale === 'zh' ? '前端开发' : 'Frontend Development',
      difficulty: 'Advanced',
      time: locale === 'zh' ? '60 分钟' : '60 min',
      icon: '⚛️',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'nginx-config',
      title: locale === 'zh' ? 'Nginx 高级配置教程' : 'Advanced Nginx Configuration',
      description: locale === 'zh' ? '配置反向代理、负载均衡、SSL证书等高级功能' : 'Configure reverse proxy, load balancing, SSL certificates and more',
      category: locale === 'zh' ? '服务器配置' : 'Server Configuration',
      difficulty: 'Intermediate',
      time: locale === 'zh' ? '40 分钟' : '40 min',
      icon: '⚙️',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'nextjs-ssg',
      title: locale === 'zh' ? 'Next.js SSG 完全指南' : 'Complete Next.js SSG Guide',
      description: locale === 'zh' ? '从零开始学习Next.js静态网站生成，提升SEO性能' : 'Learn Next.js static site generation from scratch to improve SEO',
      category: locale === 'zh' ? '前端框架' : 'Frontend Frameworks',
      difficulty: 'Intermediate',
      time: locale === 'zh' ? '50 分钟' : '50 min',
      icon: '▲',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      id: 'api-security',
      title: locale === 'zh' ? 'API 安全最佳实践' : 'API Security Best Practices',
      description: locale === 'zh' ? '保护你的API免受常见攻击，确保数据安全' : 'Protect your API from common attacks and ensure data security',
      category: locale === 'zh' ? '安全' : 'Security',
      difficulty: 'Advanced',
      time: locale === 'zh' ? '55 分钟' : '55 min',
      icon: '🔒',
      gradient: 'from-red-500 to-red-600'
    },
  ]

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700'
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              📚 Technical Tutorials
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'zh' ? '技术教程库' : 'Technical Tutorials'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'zh' ? '从零到精通，掌握最新的技术栈和实践' : 'From beginner to expert, master the latest tech stack and practices'}
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap gap-3">
          {['All', 'DevOps', 'Frontend Development', 'Network Security', 'Server Configuration'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors text-sm font-medium"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Link
              key={tutorial.id}
              href={`/${locale}/tutorials/${tutorial.id}`}
              className="group card-hover bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tutorial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tutorial.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {tutorial.icon}
                </div>
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[tutorial.difficulty as keyof typeof difficultyColors]}`}>
                    {tutorial.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tutorial.time}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{tutorial.category}</span>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-200">
                    {locale === 'zh' ? '开始学习' : 'Start Learning'}
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tutorial */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                ✨ Featured Tutorial
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {locale === 'zh' ? 'Next.js SSG 完全指南' : 'Complete Next.js SSG Guide'}
              </h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                {locale === 'zh' ? '学习如何使用Next.js构建高性能SEO友好的静态网站，提升你的项目排名' : 'Learn how to build high-performance SEO-friendly static websites with Next.js to boost your rankings'}
              </p>
              <Link
                href={`/${locale}/tutorials/nextjs-ssg`}
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                {locale === 'zh' ? '立即开始' : 'Start Now'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="text-8xl md:text-9xl">▲</div>
          </div>
        </div>
      </section>
    </div>
  )
}
