// 广告位类型
export enum AdSlotType {
  IN_CONTENT = "in-content", // 内容内广告
  SIDEBAR = "sidebar", // 侧边栏
  FOOTER = "footer", // 页脚
  HEADER = "header", // 页头
  BELOW_TITLE = "below-title", // 标题下方
  ABOVE_FOLD = "above-fold", // 首屏上方
}

// 广告位
export interface AdSlot {
  id: string;
  name: string;
  type: AdSlotType;
  adCode: string;
  enabled: boolean;
  rpm?: number;
  abTest?: {
    enabled: boolean;
    variants: {
      id: string;
      adCode: string;
      traffic: number; // 0-100
    }[];
  };
}

// 联盟链接
export interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  productId: string;
  ctaText: string;
  enabled: boolean;
  clickTracking: {
    totalClicks: number;
    lastClickAt?: Date;
  };
  conversionTracking?: {
    totalConversions: number;
    revenue: number;
    lastConversionAt?: Date;
  };
}

// 广告展示规则
export interface AdDisplayRule {
  id: string;
  pageType: string;
  adSlotId: string;
  position: number;
  condition?: {
    minViews?: number;
    maxViews?: number;
    device?: "mobile" | "desktop" | "all";
  };
}

// 性能数据
export interface PerformanceMetrics {
  pageId: string;
  date: Date;
  views: number;
  clicks: number;
  impressions: number;
  revenue: number;
  rpm: number;
  conversionRate: number;
}
