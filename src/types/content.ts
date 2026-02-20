// 内容页面类型枚举
export enum PageType {
  RECOMMENDATION = 'recommendation', // 推荐页
  REVIEW = 'review',                  // 评测页
  COMPARISON = 'comparison',          // 对比页
  TUTORIAL = 'tutorial',              // 教程页
  RESOURCE = 'resource'               // 资源页
}

// 搜索意图类型
export enum SearchIntent {
  COMMERCIAL = 'commercial',      // 商业意图
  INFORMATIONAL = 'informational', // 信息意图
  TRANSACTIONAL = 'transactional', // 交易意图
  NAVIGATIONAL = 'navigational'   // 导航意图
}

// 关键词数据模型
export interface Keyword {
  id: string
  keyword: string
  searchVolume: number
  difficulty: number
  intent: SearchIntent
  cpc?: number
  clusterId?: string
  createdAt: Date
  updatedAt: Date
}

// 方案/产品信息（用于推荐页、评测页）
export interface Solution {
  id: string
  name: string
  slug: string
  price: string
  affiliateUrl: string
  pros: string[]
  cons: string[]
  features: string[]
  rating?: number
  bestFor: string[]
  imageUrl?: string
}

// 推荐页数据
export interface RecommendationPage {
  id: string
  slug: string
  keyword: string
  intent: SearchIntent
  solutions: Solution[]
  painPoints: string[]
  useCases: string[]
  selectionGuide: {
    beginners: string
    advanced: string
    specialNeeds: string
  }
  faqs: FAQ[]
  publishedAt: Date
  updatedAt: Date
}

// 评测页数据
export interface ReviewPage {
  id: string
  slug: string
  keyword: string
  product: Solution
  background: string
  features: string[]
  performance: string
  pricing: string
  testResults: {
    metric: string
    value: string
    details: string
  }[]
  screenshots: string[]
  conclusion: string
  suitableFor: string[]
  notSuitableFor: string[]
  faqs: FAQ[]
  publishedAt: Date
  updatedAt: Date
}

// 对比页数据
export interface ComparisonPage {
  id: string
  slug: string
  keyword: string
  products: Solution[]
  comparisonTable: {
    feature: string
    values: (string | number)[]
  }[]
  scenarioComparison: {
    scenario: string
    recommended: string[]
    reason: string
  }[]
  finalRecommendation: {
    scenario: string
    productId: string
    reason: string
  }[]
  faqs: FAQ[]
  publishedAt: Date
  updatedAt: Date
}

// 教程页数据
export interface TutorialPage {
  id: string
  slug: string
  keyword: string
  intent: SearchIntent
  background: string
  prerequisites: string[]
  steps: TutorialStep[]
  commonErrors: {
    error: string
    solution: string
  }[]
  recommendedProducts: Solution[]
  faqs: FAQ[]
  publishedAt: Date
  updatedAt: Date
}

export interface TutorialStep {
  id: string
  title: string
  content: string
  code?: string
  image?: string
}

// 资源页数据
export interface ResourcePage {
  id: string
  slug: string
  keyword: string
  title: string
  description: string
  valueProposition: string
  targetAudience: string[]
  contents: ResourceSection[]
  pricing: {
    plan: string
    price: string
    features: string[]
  }[]
  faqs: FAQ[]
  publishedAt: Date
  updatedAt: Date
}

export interface ResourceSection {
  id: string
  title: string
  content: string
}

// 通用FAQ
export interface FAQ {
  question: string
  answer: string
}

// 内链数据
export interface InternalLink {
  id: string
  fromPageId: string
  toPageId: string
  anchorText: string
  linkType: 'manual' | 'auto'
  priority: number
}
