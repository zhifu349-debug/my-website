import { PerformanceMetrics } from "@/types/advertising";

// 分析数据存储接口
interface AnalyticsEvent {
  eventType: "pageview" | "click" | "conversion";
  pageId: string;
  timestamp: Date;
  data: any;
}

// 数据追踪与分析系统
export class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private metrics: Map<string, PerformanceMetrics[]> = new Map();

  // 记录页面浏览
  trackPageView(pageId: string, additionalData?: any): void {
    const event: AnalyticsEvent = {
      eventType: "pageview",
      pageId,
      timestamp: new Date(),
      data: additionalData || {},
    };

    this.events.push(event);
    this.updateMetrics(pageId, { views: 1 });
  }

  // 记录点击（广告或联盟）
  trackClick(pageId: string, clickType: "ad" | "affiliate", data?: any): void {
    const event: AnalyticsEvent = {
      eventType: "click",
      pageId,
      timestamp: new Date(),
      data: { clickType, ...data },
    };

    this.events.push(event);
    this.updateMetrics(pageId, { clicks: 1 });
  }

  // 记录转化
  trackConversion(pageId: string, revenue: number, data?: any): void {
    const event: AnalyticsEvent = {
      eventType: "conversion",
      pageId,
      timestamp: new Date(),
      data: { revenue, ...data },
    };

    this.events.push(event);

    // 手动更新转化相关指标
    this.updateMetrics(pageId, {
      views: 1,
      clicks: 1,
      revenue,
    });
  }

  // 更新指标
  private updateMetrics(
    pageId: string,
    updates: {
      views?: number;
      clicks?: number;
      impressions?: number;
      revenue?: number;
    },
  ): void {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    if (!this.metrics.has(dateKey)) {
      this.metrics.set(dateKey, []);
    }

    const dayMetrics = this.metrics.get(dateKey)!;
    let pageMetric = dayMetrics.find((m) => m.pageId === pageId);

    if (!pageMetric) {
      pageMetric = {
        pageId,
        date: today,
        views: 0,
        clicks: 0,
        impressions: 0,
        revenue: 0,
        rpm: 0,
        conversionRate: 0,
      };
      dayMetrics.push(pageMetric);
    }

    if (updates.views) pageMetric.views += updates.views;
    if (updates.clicks) pageMetric.clicks += updates.clicks;
    if (updates.impressions) pageMetric.impressions += updates.impressions;
    if (updates.revenue) pageMetric.revenue += updates.revenue;

    // 重新计算派生指标
    pageMetric.rpm =
      pageMetric.views > 0 ? (pageMetric.revenue / pageMetric.views) * 1000 : 0;
    pageMetric.conversionRate =
      pageMetric.clicks > 0 ? (pageMetric.views / pageMetric.clicks) * 100 : 0;
  }

  // 获取页面指标
  getPageMetrics(pageId: string, days: number = 30): PerformanceMetrics[] {
    const metrics: PerformanceMetrics[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      const dayMetrics = this.metrics.get(dateKey);
      if (dayMetrics) {
        const pageMetric = dayMetrics.find((m) => m.pageId === pageId);
        if (pageMetric) {
          metrics.push(pageMetric);
        }
      }
    }

    return metrics.reverse();
  }

  // 获取聚合指标
  getAggregatedMetrics(
    pageId: string,
    days: number = 30,
  ): {
    totalViews: number;
    totalClicks: number;
    totalImpressions: number;
    totalRevenue: number;
    averageRPM: number;
    averageConversionRate: number;
  } {
    const metrics = this.getPageMetrics(pageId, days);

    return {
      totalViews: metrics.reduce((sum, m) => sum + m.views, 0),
      totalClicks: metrics.reduce((sum, m) => sum + m.clicks, 0),
      totalImpressions: metrics.reduce((sum, m) => sum + m.impressions, 0),
      totalRevenue: metrics.reduce((sum, m) => sum + m.revenue, 0),
      averageRPM:
        metrics.reduce((sum, m) => sum + m.rpm, 0) / (metrics.length || 1),
      averageConversionRate:
        metrics.reduce((sum, m) => sum + m.conversionRate, 0) /
        (metrics.length || 1),
    };
  }

  // 获取表现最佳页面
  getTopPerformingPages(
    limit: number = 10,
    sortBy: "views" | "revenue" | "rpm" = "revenue",
  ): Array<{
    pageId: string;
    totalViews: number;
    totalRevenue: number;
    averageRPM: number;
  }> {
    const pageIds = new Set<string>();
    this.events.forEach((event) => pageIds.add(event.pageId));

    const results = Array.from(pageIds).map((pageId) => {
      const metrics = this.getAggregatedMetrics(pageId);
      return {
        pageId,
        totalViews: metrics.totalViews,
        totalRevenue: metrics.totalRevenue,
        averageRPM: metrics.averageRPM,
      };
    });

    const sortKeyMap: Record<
      "views" | "revenue" | "rpm",
      keyof (typeof results)[0]
    > = {
      views: "totalViews",
      revenue: "totalRevenue",
      rpm: "averageRPM",
    };

    return results
      .sort((a, b) => {
        const aValue = a[sortKeyMap[sortBy]];
        const bValue = b[sortKeyMap[sortBy]];
        return (bValue as number) - (aValue as number);
      })
      .slice(0, limit);
  }

  // 生成优化建议
  generateOptimizationSuggestions(): Array<{
    pageId: string;
    type: "low-conversion" | "high-traffic-low-rpm" | "opportunity" | "warning";
    message: string;
    action: string;
  }> {
    const suggestions: Array<{
      pageId: string;
      type:
        | "low-conversion"
        | "high-traffic-low-rpm"
        | "opportunity"
        | "warning";
      message: string;
      action: string;
    }> = [];

    const pages = this.getTopPerformingPages(100);

    pages.forEach((page) => {
      // 检查低转化率
      if (page.totalViews > 1000 && page.averageRPM < 5) {
        suggestions.push({
          pageId: page.pageId,
          type: "high-traffic-low-rpm",
          message: `High traffic (${page.totalViews.toLocaleString()} views) but low RPM ($${page.averageRPM.toFixed(2)})`,
          action: "Consider updating ad placements or affiliate links",
        });
      }

      // 检查转化机会
      if (page.totalViews > 500 && page.totalRevenue < 50) {
        suggestions.push({
          pageId: page.pageId,
          type: "low-conversion",
          message: `Moderate traffic but low revenue ($${page.totalRevenue.toFixed(2)})`,
          action: "Review and update CTA buttons and affiliate links",
        });
      }

      // 高性能页面复制机会
      if (page.averageRPM > 20) {
        suggestions.push({
          pageId: page.pageId,
          type: "opportunity",
          message: `Excellent performance with $${page.averageRPM.toFixed(2)} RPM`,
          action: "Consider creating similar content with the same structure",
        });
      }
    });

    return suggestions;
  }

  // 导出分析数据
  exportAnalytics(pageId?: string, days: number = 30): string {
    if (pageId) {
      const metrics = this.getPageMetrics(pageId, days);
      const aggregated = this.getAggregatedMetrics(pageId, days);
      return JSON.stringify({ daily: metrics, aggregated }, null, 2);
    } else {
      const allPages = this.getTopPerformingPages(100);
      const suggestions = this.generateOptimizationSuggestions();
      return JSON.stringify({ pages: allPages, suggestions }, null, 2);
    }
  }

  // 清理旧数据
  cleanup(daysToKeep: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.events = this.events.filter((event) => event.timestamp >= cutoffDate);

    const dateKeysToDelete: string[] = [];
    this.metrics.forEach((metrics, dateKey) => {
      const [year, month, day] = dateKey.split("-").map(Number);
      const metricDate = new Date(year, month - 1, day);

      if (metricDate < cutoffDate) {
        dateKeysToDelete.push(dateKey);
      }
    });

    dateKeysToDelete.forEach((key) => this.metrics.delete(key));
  }
}

// 导出单例
export const analyticsTracker = new AnalyticsTracker();
