import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n-config";

// 允许访问的IP地址列表
const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(",") || ["127.0.0.1", "::1"];

// 检查IP是否被允许
function isIpAllowed(ip: string): boolean {
  // 开发环境允许所有IP
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return ALLOWED_IPS.includes(ip);
}

// 从请求中获取IP地址
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  // 从请求对象中获取IP（Next.js 13+）
  const url = new URL(request.url);
  return url.hostname;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查IP访问限制（仅对管理后台和API路由）
  if (pathname.includes("/admin") || pathname.startsWith("/api")) {
    const clientIp = getClientIp(request);
    if (!isIpAllowed(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Access denied: IP not allowed" },
        { status: 403 }
      );
    }
  }

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
