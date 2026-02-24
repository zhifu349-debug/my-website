import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface ResourceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const resourcesData: Record<string, any> = {
  "vps-guide": {
    id: "vps-guide",
    title: {
      en: "Complete VPS Hosting Guide 2026",
      zh: "VPS主机完全指南 2026",
    },
    description: {
      en: "Everything you need to know about VPS hosting, from choosing the right provider to deployment.",
      zh: "关于VPS主机您需要知道的一切，从选择正确的提供商到部署。",
    },
    type: { en: "Guide", zh: "指南" },
    price: "$29",
    rating: 4.8,
    downloads: "5,000+",
    content: {
      en: "What's Inside\n- How to choose the right VPS provider\n- Server setup and configuration\n- Security best practices\n- Performance optimization tips\n- Deployment strategies",
      zh: "内容包括\n- 如何选择正确的VPS提供商\n- 服务器设置和配置\n- 安全最佳实践\n- 性能优化技巧\n- 部署策略",
    },
  },
  "docker-masterclass": {
    id: "docker-masterclass",
    title: {
      en: "Docker Mastery Course",
      zh: "Docker 精通课程",
    },
    description: {
      en: "Complete Docker learning path from beginner to expert.",
      zh: "从入门到专家的完整Docker学习路径。",
    },
    type: { en: "Course", zh: "课程" },
    price: "$49",
    rating: 4.7,
    downloads: "3,200+",
    content: {
      en: "Course Curriculum\n- Docker fundamentals\n- Container management\n- Networking\n- Volume management\n- Docker Compose\n- Kubernetes basics",
      zh: "课程大纲\n- Docker基础\n- 容器管理\n- 网络\n- 卷管理\n- Docker Compose\n- Kubernetes基础",
    },
  },
};

export async function generateMetadata({
  params,
}: ResourceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resource = resourcesData[slug];

  if (!resource) {
    return { title: locale === "zh" ? "未找到" : "Not Found" };
  }

  return {
    title: resource.title[locale as Locale],
    description: resource.description[locale as Locale],
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { locale, slug } = await params;
  const resource = resourcesData[slug];

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {locale === "zh" ? "资源未找到" : "Resource Not Found"}
          </h1>
          <Link href={`/${locale}/resources`} className="text-blue-600 hover:underline">
            {locale === "zh" ? "返回资源列表" : "Back to Resources"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/${locale}/resources`}
            className="text-white/80 hover:text-white mb-4 inline-flex items-center"
          >
            ← {locale === "zh" ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-white/80 bg-white/20 px-3 py-1 rounded-full text-sm">
              {resource.type[locale as Locale]}
            </span>
            <span className="text-yellow-300">⭐ {resource.rating}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {resource.title[locale as Locale]}
          </h1>
          <p className="text-white/80 text-lg">
            {resource.description[locale as Locale]}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-3xl font-bold text-gray-900">{resource.price}</span>
            </div>
            <div className="text-gray-500">
              📥 {resource.downloads} {locale === "zh" ? "下载" : "downloads"}
            </div>
          </div>
          <div className="prose max-w-none">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto whitespace-pre-wrap">
              {resource.content[locale as Locale]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(resourcesData).map((slug) => ({
    slug,
  }));
}
