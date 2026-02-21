import { RecommendationPage } from "@/types/content";
import ComparisonTable from "../conversion/ComparisonTable";
import CTAButton from "../conversion/CTAButton";
import FAQSection from "../conversion/FAQSection";
import { type Locale } from "@/lib/i18n-config";

interface RecommendationTemplateProps {
  data: RecommendationPage;
  locale?: Locale;
}

export default function RecommendationTemplate({
  data,
  locale = "en",
}: RecommendationTemplateProps) {
  const comparisonHeaders = [
    "Solution",
    "Price",
    "Rating",
    "Best For",
    "Action",
  ];

  const comparisonRows = data.solutions.map((solution) => ({
    feature: solution.name,
    values: [
      solution.price,
      `${solution.rating || "N/A"}/5`,
      solution.bestFor[0] || "General Use",
      "",
    ],
  }));

  return (
    <article className="max-w-5xl mx-auto px-4 py-8">
      {/* 问题直击模块 */}
      <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-4xl">🎯</span>
          Why Finding the Right {data.keyword} Matters
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Common Pain Points
            </h3>
            <ul className="space-y-2">
              {data.painPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-red-500 mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-green-600 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Popular Use Cases
            </h3>
            <ul className="space-y-2">
              {data.useCases.map((useCase, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-green-500 mt-1">✓</span>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 推荐总览表 */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 section-divider">
          Quick Comparison
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <ComparisonTable headers={comparisonHeaders} rows={comparisonRows} />
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center">
              {data.solutions.map((solution, index) => (
                <CTAButton
                  key={index}
                  href={solution.affiliateUrl}
                  text={`Get ${solution.name}`}
                  variant="primary"
                  size="md"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 方案详细拆解 */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 section-divider">
          Detailed Reviews
        </h2>
        <div className="space-y-8">
          {data.solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {solution.name}
                </h3>
                {solution.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-gray-900">
                      {solution.rating}/5
                    </span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {solution.pros.map((pro, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-green-500 mt-1">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {solution.cons.map((con, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-red-500 mt-1">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {solution.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-6">
                <div>
                  <span className="text-3xl font-bold gradient-text">
                    {solution.price}
                  </span>
                  <span className="text-gray-600 ml-2">starting price</span>
                </div>
                <CTAButton
                  href={solution.affiliateUrl}
                  text={`Try ${solution.name}`}
                  variant="primary"
                  size="md"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 选择建议模块 */}
      <section className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Which One Should You Choose?
        </h2>
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">For Beginners:</h3>
            <p className="text-white/90">{data.selectionGuide.beginners}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">For Advanced Users:</h3>
            <p className="text-white/90">{data.selectionGuide.advanced}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">For Special Needs:</h3>
            <p className="text-white/90">{data.selectionGuide.specialNeeds}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={data.faqs} />
    </article>
  );
}
