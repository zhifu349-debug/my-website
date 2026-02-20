import { Metadata } from 'next'
import { seoEngine } from '@/lib/seo-engine'
import { mockRecommendationPage } from '@/lib/data/mock-data'
import RecommendationTemplate from '@/components/templates/RecommendationTemplate'

// 生成SEO配置
const seo = seoEngine.generateSEO('recommendation' as any, {
  keyword: 'best vps',
  category: 'VPS Hosting',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/vps`
})

// 生成Schema
const schema = seoEngine.generateSchema('recommendation' as any, {
  title: seo.title,
  description: seo.description,
  solutions: mockRecommendationPage.solutions
}, '/vps')

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
}

export default function VPSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              🏆 Updated for 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Best VPS Hosting 2026
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Our experts tested and ranked the top VPS providers to help you choose the best option
          </p>
        </div>
      </div>
      <RecommendationTemplate data={mockRecommendationPage} />
    </>
  )
}
