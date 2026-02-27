/**
 * 数据类型定义
 * 用于各个数据模块的类型约束
 */

import { Locale } from '@/lib/i18n-config';

// 本地化文本类型
export interface LocalizedText {
  en: string;
  zh: string;
}

// 教程数据类型
export interface Tutorial {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  content: LocalizedText;
  category: LocalizedText;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: LocalizedText;
  icon: string;
  updated: string;
}

// VPS 数据类型
export interface VPS {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  price: string;
  description: LocalizedText;
  features: { name: string }[];
  pros: string[];
  prosZh: string[];
  cons: string[];
  consZh: string[];
  link: string;
}

// AI 工具数据类型
export interface AITool {
  id: string;
  name: string;
  logo: string;
  rating: number;
  price: string;
  description: LocalizedText;
  features: { name: string }[];
  featuresZh?: string[];
  pros: string[];
  prosZh: string[];
  cons: string[];
  consZh: string[];
  website: string;
}

// 对比数据类型
export interface Comparison {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  contenders: {
    name: string;
    logo: string;
    pros: string[];
    cons: string[];
  }[];
  winner: string;
  summary: LocalizedText;
  content: LocalizedText;
}

// 资源数据类型
export interface Resource {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  type: 'ebook' | 'course' | 'template' | 'tool';
  price: string;
  downloads?: number;
  rating?: number;
  icon: string;
  tags: string[];
  content: LocalizedText;
  link?: string;
}

// 辅助函数：获取本地化文本
export function getLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.en;
}

// 辅助函数：获取本地化数组
export function getLocalizedArray(
  enArray: string[],
  zhArray: string[],
  locale: Locale
): string[] {
  return locale === 'zh' ? zhArray : enArray;
}
