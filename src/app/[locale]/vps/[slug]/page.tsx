import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface VPSDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const vpsData: Record<string, any> = {
  vultr: {
    id: "1",
    name: "Vultr",
    slug: "vultr",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vultr_Logo.svg/2560px-Vultr_Logo.svg.png",
    rating: 4.8,
    price: "$5/month",
    description: {
      en: "Vultr is a high-performance cloud computing platform offering SSD-based instances across 32 global locations. Perfect for developers and businesses needing scalable infrastructure.",
      zh: "Vultr 是一个高性能云计算平台，提供基于SSD的实例，分布在32个全球位置。非常适合需要可扩展基础设施的开发者和企业。",
    },
    features: [
      { name: "NVMe SSD Storage" },
      { name: "Native IPv6 Support" },
      { name: "Hourly Billing" },
      { name: "Full Root Access" },
      { name: "14 Global Locations" },
    ],
    pros: ["Excellent performance", "Global presence", "Competitive pricing", "Fast deployment"],
    prosZh: ["性能出色", "全球布局", "价格竞争力", "快速部署"],
    cons: ["Limited support options", "No free tier"],
    consZh: ["支持选项有限", "无免费层"],
    link: "https://www.vultr.com",
  },
  digitalocean: {
    id: "2",
    name: "DigitalOcean",
    slug: "digitalocean",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/2560px-DigitalOcean_logo.svg.png",
    rating: 4.7,
    price: "$6/month",
    description: {
      en: "DigitalOcean is a developer-first cloud platform known for its simplicity and excellent documentation. Perfect for developers looking for an easy-to-use cloud solution.",
      zh: "DigitalOcean 是一个以开发者为中心的云平台，以其简洁性和优秀的文档著称。非常适合寻找易于使用的云解决方案的开发者。",
    },
    features: [
      { name: "SSD Storage" },
      { name: "99.99% Uptime SLA" },
      { name: "Global CDN" },
      { name: "Automated Backups" },
      { name: "Team Collaboration" },
    ],
    pros: ["Easy to use", "Great documentation", "Strong community", "One-click apps"],
    prosZh: ["易于使用", "文档优秀", "社区活跃", "一键应用"],
    cons: ["Higher pricing", "Limited regions compared to AWS"],
    consZh: ["价格较高", "与AWS相比区域较少"],
    link: "https://www.digitalocean.com",
  },
  linode: {
    id: "3",
    name: "Linode",
    slug: "linode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Linode_Logo.svg/2560px-Linode_Logo.svg.png",
    rating: 4.6,
    price: "$5/month",
    description: {
      en: "Linode has been a trusted name in cloud hosting since 2003. Known for excellent value, predictable pricing, and premium hardware.",
      zh: "Linode 自2003年起就是云托管领域的可信品牌。以出色的性价比、可预测的价格和优质硬件著称。",
    },
    features: [
      { name: "NVMe Storage" },
      { name: "Dedicated CPU Options" },
      { name: "Object Storage" },
      { name: "NodeBalancers" },
      { name: "40+ Global Regions" },
    ],
    pros: ["Great value", "Predictable pricing", "Excellent hardware", "Mature platform"],
    prosZh: ["性价比高", "价格可预测", "硬件优秀", "平台成熟"],
    cons: ["No free tier", "Limited managed services"],
    consZh: ["无免费层", "托管服务有限"],
    link: "https://www.linode.com",
  },
};

export async function generateMetadata({
  params,
}: VPSDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    return { title: "Not Found" };
  }
  
  const { locale, slug } = resolvedParams;
  const vps = vpsData[slug];

  if (!vps) {
    return {
      title: locale === "zh" ? "未找到" : "Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.xcodezg.com";

  return {
    title: locale === "zh" ? `${vps.name} VPS 评测` : `${vps.name} VPS Review`,
    description: vps.description[locale as Locale],
    alternates: {
      canonical: `${siteUrl}/${locale}/vps/${slug}`,
      languages: {
        en: `${siteUrl}/en/vps/${slug}`,
        zh: `${siteUrl}/zh/vps/${slug}`,
      },
    },
  };
}

export default async function VPSDetailPage({ params }: VPSDetailPageProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    notFound();
  }
  
  const { locale, slug } = resolvedParams;
  const vps = vpsData[slug];
  const isZh = locale === "zh";

  if (!vps) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href={`/${locale}/vps`} className="text-white/80 hover:text-white mb-4 inline-flex items-center">
            ← {isZh ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center gap-6">
            <img src={vps.logo} alt={vps.name} className="w-24 h-24 object-contain bg-white rounded-xl p-4" />
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{vps.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold">{vps.price}</span>
                <span className="text-yellow-300">⭐ {vps.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "概述" : "Overview"}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{vps.description[locale as Locale]}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "主要功能" : "Key Features"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {vps.features.map((feature: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-green-500">✓</span>
                <span>{feature.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-green-600">{isZh ? "优点" : "Pros"}</h2>
            <ul className="space-y-3">
              {(isZh ? vps.prosZh : vps.pros).map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">➕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-red-600">{isZh ? "缺点" : "Cons"}</h2>
            <ul className="space-y-3">
              {(isZh ? vps.consZh : vps.cons).map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-red-500">➖</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <a href={vps.link} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-shadow">
            {isZh ? "访问官网" : "Visit Website"}
          </a>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(vpsData).map((slug) => ({ slug }));
}
