import { Metadata } from 'next'
import { seoEngine } from '@/lib/seo-engine'
import { mockComparisonPage } from '@/lib/data/mock-data'
import ComparisonTemplate from '@/components/templates/ComparisonTemplate'

// 生成SEO配置
const seo = seoEngine.generateSEO('comparison' as any, {
  productA: 'Vultr',
  productB: 'DigitalOcean',
  keyword: 'vultr vs digitalocean',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/comparisons/vultr-vs-digitalocean`
})

// 生成FAQ Schema
const faqSchema = seoEngine.generateFAQSchema(mockComparisonPage.faqs)

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
}

export default function ComparisonDynamicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {mockComparisonPage.products[0].name} vs {mockComparisonPage.products[1].name}
          </h1>
          <p className="text-xl text-gray-600">
            Complete side-by-side comparison to help you choose
          </p>
        </div>
      </div>
      <ComparisonTemplate data={mockComparisonPage} />
    </>
  )
}
