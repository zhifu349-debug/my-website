import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n-config";

interface NotFoundPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NotFound({ params }: NotFoundPageProps) {
  let locale: Locale = 'en';
  
  try {
    const resolvedParams = await params;
    if (resolvedParams?.locale && locales.includes(resolvedParams.locale as Locale)) {
      locale = resolvedParams.locale as Locale;
    }
  } catch {
    // Fallback to default locale
    locale = 'en';
  }

  const isZh = locale === 'zh';

  const translations = {
    en: {
      title: "Page Not Found",
      description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
      homeButton: "Go Home",
      homeButtonZh: "返回首页",
      popularPages: "Or try visiting one of our popular pages:",
      vps: "VPS Hosting",
      aiTools: "AI Tools",
      tutorials: "Tutorials",
      errorCode: "404 Error"
    },
    zh: {
      title: "页面未找到",
      description: "您访问的页面可能已被移除、名称已更改或暂时不可用。",
      homeButton: "返回首页",
      homeButtonZh: "Go Home",
      popularPages: "或者尝试访问我们的热门页面：",
      vps: "VPS主机",
      aiTools: "AI工具",
      tutorials: "教程",
      errorCode: "404 错误"
    }
  };

  const t = translations[locale];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-center max-w-lg">
        {/* Error Icon and Code */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🚀</div>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            404
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">{t.errorCode}</p>
        </div>

        {/* Title and Description */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.title}
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {t.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t.homeButton}
          </Link>

          <Link
            href={isZh ? '/en' : '/zh'}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            {isZh ? 'English Version' : '中文版'}
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            {t.popularPages}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/${locale}/vps`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              {t.vps}
            </Link>
            <Link
              href={`/${locale}/ai-tools`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              {t.aiTools}
            </Link>
            <Link
              href={`/${locale}/tutorials`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              {t.tutorials}
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 text-sm text-gray-400">
          <p>
            {isZh 
              ? "如果问题持续存在，请联系我们的支持团队。"
              : "If the problem persists, please contact our support team."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
