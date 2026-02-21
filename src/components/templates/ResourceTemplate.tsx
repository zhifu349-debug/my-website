import { ResourcePage } from "@/types/content";
import CTAButton from "../conversion/CTAButton";
import FAQSection from "../conversion/FAQSection";

interface ResourceTemplateProps {
  data: ResourcePage;
}

export default function ResourceTemplate({ data }: ResourceTemplateProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 价值说明 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What Is This Resource?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">{data.description}</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-2">What You'll Get</h3>
          <p className="text-gray-700">{data.valueProposition}</p>
        </div>
      </section>

      {/* 适合人群 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Who Is This For?
        </h2>
        <div className="flex flex-wrap gap-3">
          {data.targetAudience.map((audience, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
            >
              {audience}
            </span>
          ))}
        </div>
      </section>

      {/* 内容目录 */}
      <section className="mb-12 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Table of Contents</h2>
        </div>
        <div className="p-6">
          <ol className="space-y-3">
            {data.contents.map((section, index) => (
              <li key={section.id} className="flex items-start gap-3">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.content}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 定价 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Choose Your Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {data.pricing.map((plan, index) => (
            <div
              key={index}
              className={`border rounded-lg p-6 ${
                index === data.pricing.length - 1
                  ? "border-primary border-2 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.plan}
              </h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {plan.price}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <CTAButton
                href="#"
                text={`Get ${plan.plan}`}
                variant={
                  index === data.pricing.length - 1 ? "primary" : "outline"
                }
                size="md"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={data.faqs} />
    </article>
  );
}
