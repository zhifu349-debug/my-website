import { ReviewPage } from "@/types/content";
import CTAButton from "../conversion/CTAButton";
import FAQSection from "../conversion/FAQSection";

interface ReviewTemplateProps {
  data: ReviewPage;
}

export default function ReviewTemplate({ data }: ReviewTemplateProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 背景与使用场景 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What Is {data.product.name}?
        </h2>
        <p className="text-gray-600 leading-relaxed">{data.background}</p>
      </section>

      {/* 功能、性能、价格 */}
      <section className="mb-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {data.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance</h2>
          <p className="text-gray-600 leading-relaxed">{data.performance}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
          <p className="text-gray-600 leading-relaxed">{data.pricing}</p>
        </div>
      </section>

      {/* 实测结果 */}
      {data.testResults.length > 0 && (
        <section className="mb-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Test Results
          </h2>
          <div className="space-y-4">
            {data.testResults.map((result, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {result.metric}
                  </h3>
                  <p className="text-sm text-gray-600">{result.details}</p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {result.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 优缺点 */}
      <section className="mb-12 grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Pros</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.product.pros.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-4">Cons</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.product.cons.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 结论 */}
      <section className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Is It Worth It?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">{data.conclusion}</p>
        <CTAButton
          href={data.product.affiliateUrl}
          text={`Get ${data.product.name}`}
          variant="primary"
          size="lg"
        />
      </section>

      {/* 适合人群 */}
      <section className="mb-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Who Should Use {data.product.name}?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {data.suitableFor.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Who Should Avoid {data.product.name}?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {data.notSuitableFor.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={data.faqs} />
    </article>
  );
}
