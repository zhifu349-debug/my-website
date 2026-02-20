// SEO配置
export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  ogImage?: string
  noindex?: boolean
  nofollow?: boolean
}

// Schema.org结构化数据类型
export type SchemaType =
  | 'WebPage'
  | 'Article'
  | 'Product'
  | 'Review'
  | 'FAQPage'
  | 'HowTo'
  | 'ItemList'
  | 'BreadcrumbList'

// 基础Schema结构
export interface SchemaData {
  '@context': 'https://schema.org'
  '@type': SchemaType
  [key: string]: any
}

// SEO规则
export interface SEORule {
  id: string
  pageType: string
  titleTemplate: string
  descriptionTemplate: string
  h1Template: string
  h2Templates: string[]
  requiredSections: string[]
  suggestedLength: {
    title: { min: number; max: number }
    description: { min: number; max: number }
    content: { min: number; max: number }
  }
}
