import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "zh" ? "服务条款 - CMS" : "Terms of Service - CMS",
    description:
      locale === "zh"
        ? "阅读我们的服务条款和条件"
        : "Read our terms and conditions",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        en: "/en/terms",
        zh: "/zh/terms",
      },
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: January 2026",
      sections: [
        {
          title: "Acceptance of Terms",
          content:
            "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
        },
        {
          title: "Use License",
          content:
            "Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only.",
        },
        {
          title: "Disclaimer",
          content:
            'The materials on this website are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all warranties.',
        },
        {
          title: "Limitations",
          content:
            "In no event shall we or our suppliers be liable for any damages arising out of the use or inability to use the materials on this website.",
        },
        {
          title: "Revisions and Errata",
          content:
            "The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate.",
        },
        {
          title: "Governing Law",
          content:
            "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which this website operates.",
        },
      ],
    },
    zh: {
      title: "服务条款",
      lastUpdated: "最后更新：2026年1月",
      sections: [
        {
          title: "接受条款",
          content:
            "通过访问和使用本网站，您接受并同意受本协议的条款和规定约束。",
        },
        {
          title: "使用许可",
          content:
            "获准临时下载本网站上的材料一份，仅限个人、非商业性临时查看。",
        },
        {
          title: "免责声明",
          content:
            '本网站上的材料按"原样"提供。我们不作任何明示或暗示的保证，特此放弃所有保证。',
        },
        {
          title: "限制",
          content:
            "在任何情况下，我们或我们的供应商都不应对因使用或无法使用本网站上的材料而产生的任何损害负责。",
        },
        {
          title: "修订和勘误",
          content:
            "本网站上出现的材料可能包含技术、排版或摄影错误。我们不保证任何材料都是准确的。",
        },
        {
          title: "管辖法律",
          content:
            "这些条款和条件受本网站运营所在司法管辖区的法律管辖并据其解释。",
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
