import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "zh" ? "隐私政策 - CMS" : "Privacy Policy - CMS",
    description:
      locale === "zh"
        ? "了解我们如何收集、使用和保护您的个人信息"
        : "Learn how we collect, use, and protect your personal information",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: "/en/privacy",
        zh: "/zh/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: January 2026",
      sections: [
        {
          title: "Information We Collect",
          content:
            "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.",
        },
        {
          title: "How We Use Your Information",
          content:
            "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.",
        },
        {
          title: "Information Sharing",
          content:
            "We do not sell your personal information. We may share your information with service providers who assist us in operating our services.",
        },
        {
          title: "Data Security",
          content:
            "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
        },
        {
          title: "Your Rights",
          content:
            "You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications from us.",
        },
        {
          title: "Contact Us",
          content:
            "If you have any questions about this Privacy Policy, please contact us at privacy@example.com",
        },
      ],
    },
    zh: {
      title: "隐私政策",
      lastUpdated: "最后更新：2026年1月",
      sections: [
        {
          title: "我们收集的信息",
          content:
            "我们收集您直接提供给我们的信息，例如当您创建账户、订阅我们的新闻通讯或联系我们要寻求支持时。",
        },
        {
          title: "我们如何使用您的信息",
          content:
            "我们使用收集到的信息来提供、维护和改进我们的服务，与您沟通，并遵守法律义务。",
        },
        {
          title: "信息共享",
          content:
            "我们不会出售您的个人信息。我们可能与协助我们运营服务的服务提供商共享您的信息。",
        },
        {
          title: "数据安全",
          content:
            "我们采取适当的安全措施来保护您的个人信息免受未经授权的访问、更改、披露或破坏。",
        },
        {
          title: "您的权利",
          content:
            "您有权访问、更正或删除您的个人信息。您也可以选择不接收我们的营销通讯。",
        },
        {
          title: "联系我们",
          content:
            "如果您对本隐私政策有任何疑问，请通过 privacy@example.com 联系我们",
        },
      ],
    },
  };

  const t = content[locale as Locale] || content.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-600">{t.lastUpdated}</p>
      </div>

      <div className="space-y-8">
        {t.sections.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
