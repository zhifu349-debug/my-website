import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/components/layout/LayoutProvider";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import NetworkStatus from "@/components/ui/NetworkStatus";
import { locales, type Locale } from "@/lib/i18n-config";

const inter = Inter({ subsets: ["latin"] });

// 根据 locale 动态生成 metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "xcodezg - Expert Reviews & Comparisons of VPS, AI Tools & More",
      description: "Discover the best VPS hosting, AI tools, and tech services through in-depth reviews and comparisons. Free, unbiased guides to help you decide.",
      keywords: ["VPS hosting", "AI tools", "tech reviews", "VPS comparison", "AI software", "developer tools", "cloud hosting"],
      openGraph: {
        title: "xcodezg - Expert Tech Reviews & Developer Resources",
        description: "Discover the best VPS hosting, AI tools, and tech services through in-depth reviews and comparisons.",
        type: "website",
        locale: "en_US",
      },
    },
    zh: {
      title: "xcodezg - VPS主机与AI工具深度评测和对比",
      description: "发现最佳VPS主机、AI工具和技术服务。通过深度评测和对比，获取免费、公正的指南，帮助您做出明智决策。",
      keywords: ["VPS主机", "AI工具", "技术评测", "VPS对比", "AI软件", "开发者工具", "云主机"],
      openGraph: {
        title: "xcodezg - 专业技术评测与开发者资源",
        description: "发现最佳VPS主机、AI工具和技术服务。通过深度评测和对比，获取免费、公正的指南。",
        type: "website",
        locale: "zh_CN",
      },
    },
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    notFound();
  }
  
  const { locale } = resolvedParams;

  // 验证locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <>
      <I18nProvider initialLocale={locale as Locale}>
        <NetworkStatus />
        <Navigation />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </I18nProvider>
    </>
  );
}
