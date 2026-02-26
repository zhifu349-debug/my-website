import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData, clearAnalyticsCache } from "@/lib/google-analytics";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30", 10);
    const refresh = searchParams.get("refresh") === "true";

    // 如果请求刷新缓存
    if (refresh) {
      clearAnalyticsCache();
    }

    // 验证天数范围
    const validDays = Math.min(Math.max(days, 1), 365);
    
    const data = await getAnalyticsData(validDays);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        days: validDays,
        cached: !refresh,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 刷新缓存
export async function POST() {
  try {
    clearAnalyticsCache();
    const data = await getAnalyticsData(30);
    
    return NextResponse.json({
      success: true,
      data,
      message: "Analytics cache refreshed",
    });
  } catch (error) {
    console.error("Analytics refresh error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh analytics data",
      },
      { status: 500 }
    );
  }
}
