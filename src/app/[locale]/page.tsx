import Link from 'next/link'
import { type Locale } from '@/lib/i18n-config'
import { translations } from '@/lib/i18n-config'

interface LocalePageProps {
  params: Promise<{ locale: string }>
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params
  const translations_data = translations[locale as Locale] || translations.en

  const categories = [
    { href: `/${locale}/vps`, title: translations_data.home.vps.title, description: translations_data.home.vps.description, icon: '🖥️', gradient: 'from-blue-500 to-blue-600' },
    { href: `/${locale}/ai-tools`, title: translations_data.home.aiTools.title, description: translations_data.home.aiTools.description, icon: '🤖', gradient: 'from-purple-500 to-purple-600' },
    { href: `/${locale}/tutorials`, title: translations_data.home.tutorials.title, description: translations_data.home.tutorials.description, icon: '📚', gradient: 'from-green-500 to-green-600' },
    { href: `/${locale}/comparisons`, title: translations_data.home.comparisons.title, description: translations_data.home.comparisons.description, icon: '⚖️', gradient: 'from-orange-500 to-orange-600' },
    { href: `/${locale}/resources`, title: translations_data.home.resources.title, description: translations_data.home.resources.description, icon: '📦', gradient: 'from-pink-500 to-pink-600' },
  ]

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
              ✨ Trusted by 10,000+ Users
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 animate-fade-in">
            {translations_data.home.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {translations_data.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl">
              {translations_data.cta.getStarted}
            </button>
            <button className="btn bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border border-gray-200">
              {translations_data.cta.learnMore}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">500+</div>
              <div className="text-sm text-gray-500 mt-1">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">4.8</div>
              <div className="text-sm text-gray-500 mt-1">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-gray-500 mt-1">Support</div>
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
            Choose a category to find the perfect tools and services for your needs
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
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-200">
                  {translations_data.cta.tryNow}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Reviews</h3>
            <p className="text-gray-600">In-depth, honest reviews from real users and experts</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">Quick access to the information you need, anytime</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600">No hidden fees, all content completely free</p>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="max-w-4xl mx-auto px-4 py-12 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{translations_data.home.affiliateDisclosure}</h2>
              <p className="text-gray-700 leading-relaxed">
                {translations_data.home.affiliateDisclosureText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
