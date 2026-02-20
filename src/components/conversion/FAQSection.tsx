import { FAQ } from '@/types/content'

interface FAQSectionProps {
  faqs: FAQ[]
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center section-divider">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 bg-gray-50 px-6 py-4">
                {faq.question}
              </h3>
              <p className="text-gray-600 px-6 py-4 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
