import { TutorialPage } from '@/types/content'
import CTAButton from '../conversion/CTAButton'
import FAQSection from '../conversion/FAQSection'

interface TutorialTemplateProps {
  data: TutorialPage
}

export default function TutorialTemplate({ data }: TutorialTemplateProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 问题背景 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
        <p className="text-gray-600 leading-relaxed">{data.background}</p>
      </section>

      {/* 前置条件 */}
      <section className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {data.prerequisites.map((prereq, index) => (
            <li key={index}>{prereq}</li>
          ))}
        </ul>
      </section>

      {/* 步骤 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide</h2>
        <div className="space-y-8">
          {data.steps.map((step, index) => (
            <div key={step.id} className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              </div>
              <div className="text-gray-600 leading-relaxed">
                <p className="mb-4">{step.content}</p>
                {step.code && (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                )}
                {step.image && (
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-lg border border-gray-200 mt-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 常见错误 */}
      {data.commonErrors.length > 0 && (
        <section className="mb-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
          <div className="space-y-4">
            {data.commonErrors.map((error, index) => (
              <div key={index}>
                <h3 className="font-semibold text-red-700 mb-1">{error.error}</h3>
                <p className="text-gray-600">{error.solution}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 延伸推荐 */}
      {data.recommendedProducts.length > 0 && (
        <section className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.recommendedProducts.map((product, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.price}</p>
                <CTAButton
                  href={product.affiliateUrl}
                  text={`Get ${product.name}`}
                  variant="outline"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={data.faqs} />
    </article>
  )
}
