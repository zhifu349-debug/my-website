import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface AffiliatePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AffiliatePageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "zh" ? "联盟披露 - CMS" : "Affiliate Disclosure - CMS",
    description:
      locale === "zh"
        ? "了解我们的联盟披露政策"
        : "Learn about our affiliate disclosure policy",
    alternates: {
      canonical: `/${locale}/affiliate`,
      languages: {
        en: "/en/affiliate",
        zh: "/zh/affiliate",
      },
    },
  };
}

export default async function AffiliatePage({ params }: AffiliatePageProps) {
  const { locale } = await params;

  const content = {
    en: {
      title: "Affiliate Disclosure",
      lastUpdated: "Last Updated: January 2026",
      intro:
        "Transparency is important to us. We want you to know how we make money so you can trust our recommendations.",
      sections: [
        {
          title: "What This Means",
          content:
            "Some of the links on our website are affiliate links. This means that if you click on the link and purchase an item, we may receive an affiliate commission at no additional cost to you.",
        },
        {
          title: "Our Promise",
          content:
            "We only recommend products and services that we believe will add value to our readers. Our editorial integrity is important to us, and we would never compromise it for financial gain.",
        },
        {
          title: "How We Select Products",
          content:
            "We conduct thorough research and testing before recommending any product. Our recommendations are based on actual experience, industry knowledge, and genuine belief in the product's value.",
        },
        {
          title: "Independence",
          content:
            "Our recommendations are not influenced by affiliate partnerships. We maintain editorial independence and always prioritize our readers' best interests.",
        },
        {
          title: "Your Trust Matters",
          content:
            "We appreciate your trust and are committed to providing honest, unbiased reviews and recommendations. Your support through affiliate links helps us continue to create valuable content.",
        },
      ],
    },
    zh: {
      title: "联盟披露",
      lastUpdated: "最后更新：2026年1月",
      intro:
        "透明度对我们很重要。我们希望您了解我们如何赚钱，以便您信任我们的推荐。",
      sections: [
        {
          title: "这意味着什么",
          content:
            "我们网站上的某些链接是联盟链接。这意味着如果您点击链接并购买商品，我们可能会收到联盟佣金，而不会给您带来额外费用。",
        },
        {
          title: "我们的承诺",
          content:
            "我们只推荐我们相信能为读者增值的产品和服务。我们的编辑诚信对我们很重要，我们绝不会为了经济利益而妥协。",
        },
        {
          title: "我们如何选择产品",
          content:
            "在推荐任何产品之前，我们会进行深入的研究和测试。我们的推荐基于实际经验、行业知识和对产品价值的真正信念。",
        },
        {
          title: "独立性",
          content:
            "我们的推荐不受联盟伙伴关系的影响。我们保持编辑独立性，始终优先考虑读者的最佳利益。",
        },
        {
          title: "您的信任很重要",
          content:
            "我们感谢您的信任，并致力于提供诚实、公正的评论和推荐。您通过联盟链接的支持帮助我们继续创造有价值的内容。",
        },
      ],
    },
  };

  const t = content[locale as Locale] || content.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          💰 Affiliate Disclosure
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-600">{t.lastUpdated}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">{t.intro}</p>
      </div>

      <div className="space-y-8">
        {t.sections.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                {index + 1}
              </span>
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
