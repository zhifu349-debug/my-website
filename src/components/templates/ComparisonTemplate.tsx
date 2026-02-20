import { ComparisonPage } from '@/types/content'
import ComparisonTable from '../conversion/ComparisonTable'
import CTAButton from '../conversion/CTAButton'
import FAQSection from '../conversion/FAQSection'

interface ComparisonTemplateProps {
  data: ComparisonPage
}

export default function ComparisonTemplate({ data }: ComparisonTemplateProps) {
  const headers = ['Feature', ...data.products.map(p => p.name)]

  const comparisonRows = data.comparisonTable.map(table => ({
    feature: table.feature,
    values: table.values
  }))

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 快速对比 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Side-by-Side Comparison</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <ComparisonTable headers={headers} rows={comparisonRows} />
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              {data.products.map((product, index) => (
                <CTAButton
                  key={index}
                  href={product.affiliateUrl}
                  text={`Try ${product.name}`}
                  variant="primary"
                  size="md"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 场景对比 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Best for Different Use Cases</h2>
        <div className="space-y-4">
          {data.scenarioComparison.map((scenario, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">{scenario.scenario}</h3>
              <p className="text-gray-600 mb-3">{scenario.reason}</p>
              <div className="flex flex-wrap gap-2">
                {scenario.recommended.map(productId => {
                  const product = data.products.find(p => p.id === productId)
                  return product ? (
                    <span
                      key={productId}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {product.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 最终推荐 */}
      <section className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Recommendation</h2>
        <div className="space-y-6">
          {data.finalRecommendation.map((rec, index) => {
            const product = data.products.find(p => p.id === rec.productId)
            return product ? (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.scenario}</h3>
                  <p className="text-gray-600">{rec.reason}</p>
                </div>
                <CTAButton
                  href={product.affiliateUrl}
                  text={`Choose ${product.name}`}
                  variant="primary"
                />
              </div>
            ) : null
          })}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={data.faqs} />
    </article>
  )
}
