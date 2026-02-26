/**
 * Analytics Configuration for US/English-speaking Markets
 * Enhanced tracking for affiliate conversions, user engagement, and content performance
 */

// Analytics event types for English markets
export type AnalyticsEvent =
  | "page_view"
  | "affiliate_click"
  | "comparison_view"
  | "tutorial_start"
  | "tutorial_complete"
  | "search"
  | "filter_use"
  | "newsletter_signup"
  | "social_share"
  | "comment_post"
  | "time_on_page"
  | "scroll_depth";

// Event properties interface
interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Analytics configuration
export const analyticsConfig = {
  // Google Analytics 4 custom events
  ga4: {
    // Custom dimensions for content tracking
    customDimensions: {
      contentType: "content_type",
      contentCategory: "content_category",
      userType: "user_type",
      language: "language",
      deviceCategory: "device_category",
    },
    
    // Custom metrics
    customMetrics: {
      scrollDepth: "scroll_depth",
      timeOnPage: "time_on_page",
      affiliateClicks: "affiliate_clicks",
    },
  },
  
  // Conversion tracking
  conversions: {
    // Affiliate link clicks
    affiliateClick: {
      eventName: "affiliate_click",
      parameters: ["provider", "category", "position", "page_location"],
    },
    
    // Content engagement
    contentEngagement: {
      eventName: "content_engagement",
      parameters: ["content_type", "content_id", "engagement_time"],
    },
    
    // Comparison tool usage
    comparisonTool: {
      eventName: "comparison_tool_used",
      parameters: ["products_compared", "category", "time_spent"],
    },
  },
  
  // User segmentation
  userSegments: {
    newVisitor: "new_visitor",
    returningVisitor: "returning_visitor",
    engagedUser: "engaged_user", // Spent > 2 minutes on site
    converter: "converter", // Clicked affiliate link
    newsletterSubscriber: "newsletter_subscriber",
  },
};

// Track page view with enhanced parameters
export function trackPageView(
  pagePath: string,
  pageTitle: string,
  properties?: EventProperties
) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    send_to: process.env.NEXT_PUBLIC_GA_ID,
    ...properties,
  });
}

// Track affiliate link click
export function trackAffiliateClick(
  provider: string,
  category: string,
  position: number,
  pagePath: string
) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "affiliate_click", {
    event_category: "Affiliate",
    event_label: provider,
    provider: provider,
    category: category,
    position: position,
    page_location: pagePath,
    value: 1,
  });
  
  // Also track as conversion
  window.gtag("event", "conversion", {
    send_to: process.env.NEXT_PUBLIC_GA_ID,
    value: 1.0,
    currency: "USD",
  });
}

// Track comparison tool usage
export function trackComparison(
  products: string[],
  category: string,
  timeSpent: number
) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "comparison_tool_used", {
    event_category: "Engagement",
    products_compared: products.join(", "),
    category: category,
    time_spent: timeSpent,
  });
}

// Track tutorial engagement
export function trackTutorialEvent(
  event: "start" | "complete" | "progress",
  tutorialId: string,
  progress?: number
) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  const eventName = event === "start" 
    ? "tutorial_start" 
    : event === "complete" 
    ? "tutorial_complete" 
    : "tutorial_progress";
  
  window.gtag("event", eventName, {
    event_category: "Content",
    tutorial_id: tutorialId,
    progress: progress || 0,
  });
}

// Track scroll depth
export function trackScrollDepth(depth: number) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "scroll_depth", {
    event_category: "Engagement",
    event_label: `${depth}%`,
    value: depth,
  });
}

// Track search queries
export function trackSearch(
  query: string,
  resultsCount: number,
  category?: string
) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "search", {
    event_category: "Search",
    search_term: query,
    results_count: resultsCount,
    category: category || "all",
  });
}

// Track newsletter signup
export function trackNewsletterSignup(source: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "newsletter_signup", {
    event_category: "Lead",
    event_label: source,
    value: 1,
  });
  
  // Track as conversion
  window.gtag("event", "conversion", {
    send_to: process.env.NEXT_PUBLIC_GA_ID,
    value: 5.0,
    currency: "USD",
  });
}

// Track social share
export function trackSocialShare(
  platform: "twitter" | "facebook" | "linkedin" | "reddit",
  contentUrl: string
) {
  if (typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", "share", {
    event_category: "Social",
    method: platform,
    content_type: "article",
    item_id: contentUrl,
  });
}

// Initialize scroll depth tracking
export function initScrollDepthTracking() {
  if (typeof window === "undefined") return;
  
  const depths = [25, 50, 75, 90, 100];
  const tracked = new Set<number>();
  
  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    depths.forEach((depth) => {
      if (scrollPercent >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        trackScrollDepth(depth);
      }
    });
  };
  
  window.addEventListener("scroll", handleScroll, { passive: true });
  
  // Cleanup function
  return () => window.removeEventListener("scroll", handleScroll);
}

// Initialize time on page tracking
export function initTimeOnPageTracking() {
  if (typeof window === "undefined") return;
  
  let startTime = Date.now();
  let totalTime = 0;
  
  // Track when user leaves page
  const handleBeforeUnload = () => {
    totalTime += Date.now() - startTime;
    
    // Send beacon for reliable tracking
    if (navigator.sendBeacon && window.gtag) {
      const data = JSON.stringify({
        event: "time_on_page",
        value: Math.round(totalTime / 1000),
      });
      navigator.sendBeacon("/api/analytics", data);
    }
  };
  
  // Track visibility changes
  const handleVisibilityChange = () => {
    if (document.hidden) {
      totalTime += Date.now() - startTime;
    } else {
      startTime = Date.now();
    }
  };
  
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  
  // Cleanup function
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export default analyticsConfig;
