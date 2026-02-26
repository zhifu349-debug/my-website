import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Google Analytics 数据接口
export interface AnalyticsData {
  dailyVisitors: Array<{ date: string; count: number }>;
  topPages: Array<{ path: string; title: string; views: number }>;
  topReferrers: Array<{ source: string; count: number }>;
  realTimeUsers: number;
  totalUsers: number;
  totalPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
}

// 缓存配置
const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟缓存
let cachedData: { data: AnalyticsData; timestamp: number } | null = null;

// 获取 Analytics Data Client
function getAnalyticsClient(): BetaAnalyticsDataClient | null {
  const propertyId = process.env.GA_PROPERTY_ID;
  const credentialsJson = process.env.GA_CREDENTIALS;

  if (!propertyId || !credentialsJson) {
    console.warn("Google Analytics credentials not configured");
    return null;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    return new BetaAnalyticsDataClient({ credentials });
  } catch (error) {
    console.error("Failed to parse GA credentials:", error);
    return null;
  }
}

// 获取每日访客数据
async function getDailyVisitors(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; count: number }>> {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    });

    return (response.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      count: parseInt(row.metricValues?.[0]?.value || "0", 10),
    }));
  } catch (error) {
    console.error("Failed to get daily visitors:", error);
    return [];
  }
}

// 获取热门页面
async function getTopPages(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<Array<{ path: string; title: string; views: number }>> {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      ],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit,
    });

    return (response.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "",
      title: row.dimensionValues?.[1]?.value || "Unknown",
      views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    }));
  } catch (error) {
    console.error("Failed to get top pages:", error);
    return [];
  }
}

// 获取来源统计
async function getTopReferrers(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<Array<{ source: string; count: number }>> {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      ],
      dimensions: [{ name: "sessionSource" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit,
    });

    return (response.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Direct",
      count: parseInt(row.metricValues?.[0]?.value || "0", 10),
    }));
  } catch (error) {
    console.error("Failed to get top referrers:", error);
    return [];
  }
}

// 获取实时用户数
async function getRealTimeUsers(
  client: BetaAnalyticsDataClient,
  propertyId: string
): Promise<number> {
  try {
    const [response] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
  } catch (error) {
    console.error("Failed to get real-time users:", error);
    return 0;
  }
}

// 获取总体统计
async function getOverallStats(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalUsers: number;
  totalPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
}> {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      ],
      metrics: [
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
    });

    const row = response.rows?.[0];
    return {
      totalUsers: parseInt(row?.metricValues?.[0]?.value || "0", 10),
      totalPageViews: parseInt(row?.metricValues?.[1]?.value || "0", 10),
      avgSessionDuration: parseFloat(row?.metricValues?.[2]?.value || "0"),
      bounceRate: parseFloat(row?.metricValues?.[3]?.value || "0") * 100,
    };
  } catch (error) {
    console.error("Failed to get overall stats:", error);
    return {
      totalUsers: 0,
      totalPageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
    };
  }
}

// 格式化日期为 YYYY-MM-DD 格式
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// 主函数：获取完整分析数据
export async function getAnalyticsData(
  days: number = 30
): Promise<AnalyticsData> {
  // 检查缓存
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const client = getAnalyticsClient();
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!client || !propertyId) {
    // 返回模拟数据（用于开发环境）
    return getMockData();
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // 并行获取所有数据
    const [
      dailyVisitors,
      topPages,
      topReferrers,
      realTimeUsers,
      overallStats,
    ] = await Promise.all([
      getDailyVisitors(client, propertyId, startDate, endDate),
      getTopPages(client, propertyId, startDate, endDate),
      getTopReferrers(client, propertyId, startDate, endDate),
      getRealTimeUsers(client, propertyId),
      getOverallStats(client, propertyId, startDate, endDate),
    ]);

    const data: AnalyticsData = {
      dailyVisitors,
      topPages,
      topReferrers,
      realTimeUsers,
      ...overallStats,
    };

    // 更新缓存
    cachedData = { data, timestamp: Date.now() };

    return data;
  } catch (error) {
    console.error("Failed to get analytics data:", error);
    return getMockData();
  }
}

// 模拟数据（开发环境或 API 不可用时）
function getMockData(): AnalyticsData {
  const today = new Date();
  const dailyVisitors = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyVisitors.push({
      date: formatDate(date),
      count: Math.floor(Math.random() * 500) + 200,
    });
  }

  return {
    dailyVisitors,
    topPages: [
      { path: "/en/vps", title: "Best VPS 2026", views: 5234 },
      { path: "/en/tutorials/v2ray-setup", title: "V2Ray Setup Guide", views: 3456 },
      { path: "/en/ai-tools", title: "Best AI Tools", views: 2890 },
      { path: "/en/comparisons/vultr-vs-digitalocean", title: "Vultr vs DigitalOcean", views: 2100 },
      { path: "/en/vps/vultr-review", title: "Vultr Review", views: 1850 },
    ],
    topReferrers: [
      { source: "Google", count: 4523 },
      { source: "Direct", count: 2341 },
      { source: "Twitter", count: 892 },
      { source: "GitHub", count: 456 },
      { source: "Reddit", count: 234 },
    ],
    realTimeUsers: Math.floor(Math.random() * 50) + 10,
    totalUsers: 15678,
    totalPageViews: 45234,
    avgSessionDuration: 185.5,
    bounceRate: 42.3,
  };
}

// 清除缓存
export function clearAnalyticsCache(): void {
  cachedData = null;
}
