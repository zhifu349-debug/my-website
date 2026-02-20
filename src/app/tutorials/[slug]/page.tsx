import { Metadata } from 'next'
import { seoEngine } from '@/lib/seo-engine'
import { mockTutorialPage } from '@/lib/data/mock-data'
import TutorialTemplate from '@/components/templates/TutorialTemplate'

// 生成SEO配置
const seo = seoEngine.generateSEO('tutorial' as any, {
  action: 'set up V2Ray',
  keyword: 'v2ray setup',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tutorials/v2ray-setup`
})

// 生成HowTo Schema
const howToSchema = seoEngine.generateSchema('tutorial' as any, {
  title: seo.title,
  description: seo.description,
  steps: mockTutorialPage.steps
}, '/tutorials/v2ray-setup')

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
}

export default function TutorialDynamicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Set Up V2Ray: Complete Guide
          </h1>
          <p className="text-xl text-gray-600">
            Step-by-step tutorial with screenshots and troubleshooting tips
          </p>
        </div>
      </div>
      <TutorialTemplate data={mockTutorialPage} />
    </>
  )
}
