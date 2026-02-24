import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface ComparisonDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const comparisonsData: Record<string, any> = {
  "vultr-vs-digitalocean": {
    id: "vultr-vs-digitalocean",
    productA: "Vultr",
    productB: "DigitalOcean",
    logoA: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vultr_Logo.svg/2560px-Vultr_Logo.svg.png",
    logoB: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/2560px-DigitalOcean_logo.svg.png",
    title: {
      en: "Vultr vs DigitalOcean - Which is Better in 2026?",
      zh: "Vultr vs DigitalOcean - 2026年哪个更好？",
    },
    description: {
      en: "Detailed comparison between two popular cloud hosting providers.",
      zh: "两个热门云托管服务商的详细对比。",
    },
    features: [
      { name: "Starting Price", vultr: "$5/mo", digitalocean: "$6/mo" },
      { name: "Global Locations", vultr: "32", digitalocean: "13" },
      { name: "SSD Storage", vultr: "NVMe", digitalocean: "SSD" },
      { name: "Uptime SLA", vultr: "99.99%", digitalocean: "99.99%" },
      { name: "Free Tier", vultr: "❌", digitalocean: "❌" },
      { name: "Hourly Billing", vultr: "✅", digitalocean: "✅" },
    ],
    winner: {
      en: "Vultr - Better value and global presence",
      zh: "Vultr - 更好的性价比和全球布局",
    },
  },
  "chatgpt-vs-claude": {
    id: "chatgpt-vs-claude",
    productA: "ChatGPT",
    productB: "Claude",
    logoA: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png",
    logoB: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Anthropic_Logo.svg/2048px-Anthropic_Logo.svg.png",
    title: {
      en: "ChatGPT vs Claude - Which AI Assistant is Better?",
      zh: "ChatGPT vs Claude - 哪个AI助手更好？",
    },
    description: {
      en: "Compare the two leading AI assistants for productivity and coding.",
      zh: "比较两个领先的AI助手在生产力和编程方面的表现。",
    },
    features: [
      { name: "Free Version", chatgpt: "✅", claude: "✅" },
      { name: "Pro Price", chatgpt: "$20/mo", claude: "$20/mo" },
      { name: "Context Window", chatgpt: "128K", claude: "200K" },
      { name: "Coding Ability", chatgpt: "Excellent", claude: "Excellent" },
      { name: "Image Analysis", chatgpt: "✅", claude: "✅" },
      { name: "API Access", chatgpt: "✅", claude: "✅" },
    ],
    winner: {
      en: "Both - Choose based on your specific needs",
      zh: "两者皆可 - 根据您的具体需求选择",
    },
  },
};

export async function generateMetadata({
  params,
}: ComparisonDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const comparison = comparisonsData[slug];

  if (!comparison) {
    return { title: locale === "zh" ? "未找到" : "Not Found" };
  }

  return {
    title: comparison.title[locale as Locale],
    description: comparison.description[locale as Locale],
  };
}

export default async function ComparisonDetailPage({ params }: ComparisonDetailPageProps) {
  const { locale, slug } = await params;
  const comparison = comparisonsData[slug];

  if (!comparison) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {locale === "zh" ? "对比未找到" : "Comparison Not Found"}
          </h1>
          <Link href={`/${locale}/comparisons`} className="text-blue-600 hover:underline">
            {locale === "zh" ? "返回对比列表" : "Back to Comparisons"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/${locale}/comparisons`}
            className="text-white/80 hover:text-white mb-4 inline-flex items-center"
          >
            ← {locale === "zh" ? "返回列表" : "Back to List"}
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            {comparison.title[locale as Locale]}
          </h1>
          <p className="text-white/80 text-lg">
            {comparison.description[locale as Locale]}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-900 text-white p-6 text-center font-bold">
            <div>Feature</div>
            <div className="text-2xl">🆚</div>
            <div>Feature</div>
          </div>
          {comparison.features.map((feature: any, index: number) => (
            <div key={index} className={`grid grid-cols-3 p-4 text-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="font-medium">{comparison.productA}</div>
              <div className="text-gray-500 text-sm">{feature.name}</div>
              <div className="font-medium">{comparison.productB}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {locale === "zh" ? "🏆 结论" : "🏆 Winner"}
          </h3>
          <p className="text-white text-lg font-semibold">
            {comparison.winner[locale as Locale]}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(comparisonsData).map((slug) => ({
    slug,
  }));
}
