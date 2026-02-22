// CMS内容类型定义

export type ContentStatus = "draft" | "published" | "archived" | "scheduled";
export type MediaType = "image" | "video" | "document";

export interface CMSContent {
  id: string;
  type: "recommendation" | "review" | "comparison" | "tutorial" | "resource";
  title: { en: string; zh: string };
  slug: string;
  status: ContentStatus;
  seo: {
    title: { en: string; zh: string };
    description: { en: string; zh: string };
    keywords: { en: string; zh: string };
    canonical: string;
  };
  content: {
    en: CMSPageContent;
    zh: CMSPageContent;
  };
  featuredImage?: string;
  gallery?: string[];
  locale: "en" | "zh";
  author: string;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

// 版本控制相关类型
export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  title: { en: string; zh: string };
  slug: string;
  status: ContentStatus;
  seo: {
    title: { en: string; zh: string };
    description: { en: string; zh: string };
    keywords: { en: string; zh: string };
    canonical: string;
  };
  content: {
    en: CMSPageContent;
    zh: CMSPageContent;
  };
  featuredImage?: string;
  gallery?: string[];
  locale: "en" | "zh";
  author: string;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  createdAt: Date;
  updatedBy: string;
  comment?: string;
}

export interface CMSPageContent {
  intro: string;
  sections: ContentSection[];
  faq?: FAQItem[];
  cta?: CTAConfig;
}

export interface ContentSection {
  id: string;
  type: "text" | "image" | "video" | "comparison-table" | "list" | "quote";
  content: any;
  order: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  order: number;
}

export interface CTAConfig {
  text: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
}

export interface MediaFile {
  id: string;
  type: MediaType;
  name: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  alt: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: { en: string; zh: string };
  slug: string;
  description: { en: string; zh: string };
  order: number;
  icon?: string;
  gradient?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface NavigationItem {
  id: string;
  label: { en: string; zh: string };
  url: string;
  order: number;
  parentId?: string;
  visible: boolean;
}
