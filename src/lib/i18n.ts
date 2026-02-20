export type Locale = 'en' | 'zh'

export const locales: Locale[] = ['en', 'zh']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

export const translations = {
  en: {
    navigation: {
      home: 'Home',
      vps: 'VPS',
      aiTools: 'AI Tools',
      tutorials: 'Tutorials',
      comparisons: 'Comparisons',
      resources: 'Resources',
    },
    footer: {
      about: 'About',
      aboutText: 'SEO-driven content monetization platform providing in-depth reviews, comparisons, and tutorials to help you make informed decisions.',
      categories: 'Categories',
      legal: 'Legal',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      affiliateDisclosure: 'Affiliate Disclosure',
      copyright: '© 2026 CMS. All rights reserved.',
    },
    home: {
      title: 'Find Best Tools & Services',
      subtitle: 'In-depth reviews, comparisons, and tutorials to help you make informed decisions',
      vps: { title: 'VPS Hosting', description: 'Find best VPS providers for your projects' },
      aiTools: { title: 'AI Tools', description: 'Discover powerful AI tools and services' },
      tutorials: { title: 'Tutorials', description: 'Step-by-step guides for developers' },
      comparisons: { title: 'Comparisons', description: 'Compare products side by side' },
      resources: { title: 'Resources', description: 'In-depth guides and resources' },
      affiliateDisclosure: 'Affiliate Disclosure',
      affiliateDisclosureText: 'We may earn a commission when you purchase through our links. This helps us continue providing free content and reviews. We only recommend products we trust.',
    },
    cta: {
      getStarted: 'Get Started',
      tryNow: 'Try Now',
    },
  },
  zh: {
    navigation: {
      home: '首页',
      vps: 'VPS主机',
      aiTools: 'AI工具',
      tutorials: '教程',
      comparisons: '对比',
      resources: '资源',
    },
    footer: {
      about: '关于我们',
      aboutText: 'SEO驱动的内容变现平台，提供深度评测、对比和教程，帮助您做出明智决策。',
      categories: '分类',
      legal: '法律',
      privacyPolicy: '隐私政策',
      termsOfService: '服务条款',
      affiliateDisclosure: '联盟声明',
      copyright: '© 2026 CMS. 版权所有',
    },
    home: {
      title: '寻找最佳工具与服务',
      subtitle: '深度评测、对比和教程，帮助您做出明智决策',
      vps: { title: 'VPS主机', description: '为您的项目寻找最佳的VPS服务商' },
      aiTools: { title: 'AI工具', description: '发现强大的AI工具和服务' },
      tutorials: { title: '教程', description: '面向开发者的分步指南' },
      comparisons: { title: '对比', description: '并排对比产品' },
      resources: { title: '资源', description: '深度指南和资源' },
      affiliateDisclosure: '联盟声明',
      affiliateDisclosureText: '当我们通过链接销售产品时，可能会赚取佣金。这有助于我们继续提供免费内容和评测。我们只推荐我们信任的产品。',
    },
    cta: {
      getStarted: '立即开始',
      tryNow: '立即尝试',
    },
  },
} as const

export function t(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  return 'en'
}

export function setLocale(locale: Locale): void {
  localStorage.setItem('locale', locale)
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }))
}

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const stored = localStorage.getItem('locale') as Locale
  if (stored && locales.includes(stored)) return stored

  return getBrowserLocale()
}
