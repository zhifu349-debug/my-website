import { Metadata } from 'next'
import { seoEngine } from '@/lib/seo-engine'
import { mockResourcePage } from '@/lib/data/mock-data'
import ResourceTemplate from '@/components/templates/ResourceTemplate'

// 生成SEO配置
const seo = seoEngine.generateSEO('resource' as any, {
  title: 'Complete VPS Hosting Guide',
  category: 'VPS',
  keyword: 'vps guide',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/resources/vps-guide`
})

// 生成FAQ Schema
const faqSchema = seoEngine.generateFAQSchema(mockResourcePage.faqs)

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
}

export default function ResourceDynamicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{mockResourcePage.title}</h1>
          <p className="text-xl text-gray-600">{mockResourcePage.description}</p>
        </div>
      </div>
      <ResourceTemplate data={mockResourcePage} />
    </>
  )
}
