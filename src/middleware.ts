import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n-config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否已经有语言前缀
  const hasValidLocalePrefix = locales.some(
    (locale: Locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  // 如果是根路径且没有语言前缀，重定向到默认语言
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 如果路径缺少语言前缀且不是静态资源或API
  if (
    !hasValidLocalePrefix &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  // 排除静态资源和API路由
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
