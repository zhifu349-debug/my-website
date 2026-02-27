import Link from "next/link";
import { notFound } from "next/navigation";
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
      en: "Vultr vs DigitalOcean - Complete Comparison 2026",
      zh: "Vultr vs DigitalOcean - 全面对比 2026",
    },
    description: {
      en: "Comprehensive comparison between Vultr and DigitalOcean - two of the most popular cloud hosting providers. Find out which one is right for your needs.",
      zh: "Vultr 和 DigitalOcean 之间的全面对比——两个最受欢迎的云托管服务商。找出哪个适合您的需求。",
    },
    features: [
      { name: "Starting Price", vultr: "$5/mo", digitalocean: "$6/mo", winner: "vultr" },
      { name: "Global Locations", vultr: "32", digitalocean: "13", winner: "vultr" },
      { name: "Storage Type", vultr: "NVMe SSD", digitalocean: "SSD", winner: "vultr" },
      { name: "Uptime SLA", vultr: "99.99%", digitalocean: "99.99%", winner: "tie" },
      { name: "Free Tier", vultr: "❌", digitalocean: "❌", winner: "tie" },
      { name: "Hourly Billing", vultr: "✅", digitalocean: "✅", winner: "tie" },
      { name: "One-Click Apps", vultr: "90+", digitalocean: "100+", winner: "digitalocean" },
      { name: "Documentation", vultr: "Good", digitalocean: "Excellent", winner: "digitalocean" },
      { name: "API", vultr: "Full API", digitalocean: "Full API", winner: "tie" },
      { name: "Beginner Friendly", vultr: "Medium", digitalocean: "Easy", winner: "digitalocean" },
    ],
    conclusion: {
      en: "Choose Vultr for better pricing and global presence. Choose DigitalOcean for better documentation and ease of use.",
      zh: "选择 Vultr 获得更好的价格和全球布局。选择 DigitalOcean 获得更好的文档和易用性。",
    },
    winner: "digitalocean",
    winnerText: {
      en: "DigitalOcean - Better for beginners",
      zh: "DigitalOcean - 更适合初学者",
    },
  },
  "chatgpt-vs-claude": {
    id: "chatgpt-vs-claude",
    productA: "ChatGPT",
    productB: "Claude",
    logoA: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png",
    logoB: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Anthropic_Logo.svg/2048px-Anthropic_Logo.svg.png",
    title: {
      en: "ChatGPT vs Claude - Best AI Assistant 2026",
      zh: "ChatGPT vs Claude - 最佳AI助手 2026",
    },
    description: {
      en: "Compare the two leading AI assistants. ChatGPT vs Claude - which one is better for your workflow?",
      zh: "比较两个领先的 AI 助手。ChatGPT vs Claude - 哪个更适合您的工作流程？",
    },
    features: [
      { name: "Free Version", chatgpt: "✅", claude: "✅", winner: "tie" },
      { name: "Pro Price", chatgpt: "$20/mo", claude: "$20/mo", winner: "tie" },
      { name: "Context Window", chatgpt: "128K", claude: "200K", winner: "claude" },
      { name: "Coding Ability", chatgpt: "Excellent", claude: "Excellent", winner: "tie" },
      { name: "Image Analysis", chatgpt: "✅", claude: "✅", winner: "tie" },
      { name: "API Access", chatgpt: "✅", claude: "✅", winner: "tie" },
      { name: "Plugins", chatgpt: "✅", claude: "❌", winner: "chatgpt" },
      { name: "Computer Use", chatgpt: "Limited", claude: "✅", winner: "claude" },
      { name: "Response Speed", chatgpt: "Fast", claude: "Medium", winner: "chatgpt" },
      { name: "Safety Focus", chatgpt: "Good", claude: "Excellent", winner: "claude" },
    ],
    conclusion: {
      en: "ChatGPT is better for general use and plugins. Claude excels at long documents and complex reasoning.",
      zh: "ChatGPT 更适合一般使用和插件。Claude 在长文档和复杂推理方面表现出色。",
    },
    winner: "chatgpt",
    winnerText: {
      en: "ChatGPT - More versatile",
      zh: "ChatGPT - 更通用",
    },
  },
  "react-vs-vue": {
    id: "react-vs-vue",
    productA: "React",
    productB: "Vue.js",
    logoA: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    logoB: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vue.png/800px-Vue.png",
    title: {
      en: "React vs Vue.js - Which to Choose in 2026?",
      zh: "React vs Vue.js - 2026年如何选择？",
    },
    description: {
      en: "Compare React and Vue.js for your next project. Learn the pros and cons of each framework.",
      zh: "为您的下一个项目比较 React 和 Vue.js。了解每个框架的优缺点。",
    },
    features: [
      { name: "Learning Curve", react: "Medium", vue: "Easy", winner: "vue" },
      { name: "Performance", react: "Excellent", vue: "Excellent", winner: "tie" },
      { name: "Job Market", react: "Very High", vue: "High", winner: "react" },
      { name: "Ecosystem", react: "Huge", vue: "Large", winner: "react" },
      { name: "Flexibility", react: "High", vue: "Medium", winner: "react" },
      { name: "Documentation", react: "Good", vue: "Excellent", winner: "vue" },
      { name: "TypeScript Support", react: "Native", vue: "Great", winner: "tie" },
      { name: "Mobile (React Native)", react: "✅", vue: "NativeScript", winner: "react" },
      { name: "State Management", react: "Redux/Zustand", vue: "Pinia/Vuex", winner: "tie" },
      { name: "Corporate Support", react: "Meta", vue: "Evan You", winner: "react" },
    ],
    conclusion: {
      en: "Choose React for job opportunities and ecosystem. Choose Vue for learning ease and simplicity.",
      zh: "选择 React 获得工作机会和生态系统。选择 Vue 获得学习轻松和简洁。",
    },
    winner: "react",
    winnerText: {
      en: "React - Industry standard",
      zh: "React - 行业标准",
    },
  },
  "aws-vs-azure": {
    id: "aws-vs-azure",
    productA: "AWS",
    productB: "Azure",
    logoA: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png",
    logoB: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1200px-Microsoft_Azure.svg.png",
    title: {
      en: "AWS vs Azure - Cloud Platform Comparison 2026",
      zh: "AWS vs Azure - 云平台对比 2026",
    },
    description: {
      en: "Compare Amazon Web Services and Microsoft Azure. Which cloud platform is better for your business?",
      zh: "比较亚马逊云服务和微软 Azure。哪个云平台更适合您的业务？",
    },
    features: [
      { name: "Market Share", aws: "32%", azure: "23%", winner: "aws" },
      { name: "Services Count", aws: "200+", azure: "200+", winner: "tie" },
      { name: "Free Tier", aws: "12 months", azure: "12 months", winner: "tie" },
      { name: "Enterprise Focus", aws: "High", azure: "Very High", winner: "azure" },
      { name: "Pricing", aws: "Pay-as-you-go", azure: "Pay-as-you-go", winner: "tie" },
      { name: "Hybrid Cloud", aws: "Outposts", azure: "Arc - Better", winner: "azure" },
      { name: "Windows Support", aws: "Limited", azure: "Excellent", winner: "azure" },
      { name: "Machine Learning", aws: "SageMaker", azure: "ML Studio", winner: "aws" },
      { name: "Global Infrastructure", aws: "33 Regions", azure: "60+ Regions", winner: "azure" },
      { name: "Startup Friendly", aws: "Excellent", azure: "Good", winner: "aws" },
    ],
    conclusion: {
      en: "AWS leads in market share and services. Azure is better for enterprise and Windows workloads.",
      zh: "AWS 在市场份额和服务方面领先。Azure 更适合企业和 Windows 工作负载。",
    },
    winner: "aws",
    winnerText: {
      en: "AWS - More popular",
      zh: "AWS - 更受欢迎",
    },
  },
};

export async function generateMetadata({
  params,
}: ComparisonDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    return { title: "Not Found" };
  }
  
  const { locale, slug } = resolvedParams;
  const comparison = comparisonsData[slug];

  if (!comparison) {
    return { title: locale === "zh" ? "未找到" : "Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.xcodezg.com";

  return {
    title: comparison.title[locale as Locale],
    description: comparison.description[locale as Locale],
    alternates: {
      canonical: `${siteUrl}/${locale}/comparisons/${slug}`,
      languages: {
        en: `${siteUrl}/en/comparisons/${slug}`,
        zh: `${siteUrl}/zh/comparisons/${slug}`,
      },
    },
  };
}

export default async function ComparisonDetailPage({ params }: ComparisonDetailPageProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    notFound();
  }
  
  const { locale, slug } = resolvedParams;
  const comparison = comparisonsData[slug];
  const isZh = locale === "zh";

  if (!comparison) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/${locale}/comparisons`}
            className="text-white/80 hover:text-white mb-4 inline-flex items-center"
          >
            ← {isZh ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center justify-center gap-8 mb-4">
            <img src={comparison.logoA} alt={comparison.productA} className="w-20 h-20 object-contain bg-white rounded-xl p-3" />
            <span className="text-4xl text-white font-bold">VS</span>
            <img src={comparison.logoB} alt={comparison.productB} className="w-20 h-20 object-contain bg-white rounded-xl p-3" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            {comparison.title[locale as Locale]}
          </h1>
          <p className="text-white/80 text-lg text-center">
            {comparison.description[locale as Locale]}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-3 bg-gray-900 text-white p-4 text-center font-bold">
            <div>{isZh ? "功能" : "Feature"}</div>
            <div className="text-center">{comparison.productA}</div>
            <div className="text-center">{comparison.productB}</div>
          </div>
          {comparison.features.map((feature: any, index: number) => (
            <div key={index} className={`grid grid-cols-3 p-4 text-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="font-medium text-gray-700">{feature.name}</div>
              <div className={`text-center ${feature.winner === 'vultr' || feature.winner === 'chatgpt' || feature.winner === 'react' || feature.winner === 'aws' ? 'font-bold text-green-600' : ''}`}>
                {feature[comparison.productA.toLowerCase().replace(' ', '')]}
              </div>
              <div className={`text-center ${feature.winner === 'digitalocean' || feature.winner === 'claude' || feature.winner === 'vue' || feature.winner === 'azure' ? 'font-bold text-green-600' : ''}`}>
                {feature[comparison.productB.toLowerCase().replace(' ', '')]}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "结论" : "Conclusion"}</h2>
          <p className="text-gray-600 text-lg">{comparison.conclusion[locale as Locale]}</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🏆 {isZh ? "推荐" : "Recommendation"}</h3>
          <p className="text-white text-lg font-semibold">
            {comparison.winnerText[locale as Locale]}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(comparisonsData).map((slug) => ({ slug }));
}
