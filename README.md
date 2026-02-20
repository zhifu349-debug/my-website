# SEO Content Monetization System

一个SEO驱动的内容变现系统，专注于搜索流量获取和商业转化。

## 系统架构

### 技术栈
- **Next.js 15** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统

### 核心模块

#### 1. SEO引擎 (`src/lib/seo-engine.ts`)
- 自动生成Title、Meta描述
- Schema.org结构化数据生成
- H标签建议
- SEO规则验证

#### 2. 5种页面模板
- **推荐页** (`RecommendationTemplate`) - 最赚钱的页面类型
- **评测页** (`ReviewTemplate`) - 建立信任的评测内容
- **对比页** (`ComparisonTemplate`) - 产品对比分析
- **教程页** (`TutorialTemplate`) - SEO流量池
- **资源页** (`ResourceTemplate`) - 付费资源

#### 3. 广告与联盟管理
- **广告管理器** (`src/lib/ad-manager.ts`) - 广告位管理与A/B测试
- **联盟管理器** (`src/lib/affiliate-manager.ts`) - 联盟链接追踪

#### 4. 内链系统 (`src/lib/auto-internal-links.ts`)
- 自动内链生成
- 链接质量验证
- 内链统计分析

#### 5. 数据追踪 (`src/lib/analytics-tracker.ts`)
- 页面浏览追踪
- 点击转化追踪
- 性能指标分析
- 优化建议生成

## 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── vps/                 # VPS页面
│   ├── ai-tools/            # AI工具页面
│   ├── tutorials/           # 教程页面
│   ├── comparisons/         # 对比页面
│   ├── resources/           # 资源页面
│   └── admin/               # 管理后台
├── components/
│   ├── layout/              # 布局组件
│   ├── seo/                 # SEO组件
│   ├── templates/           # 页面模板
│   └── conversion/          # 转化组件
├── lib/
│   ├── seo-engine.ts        # SEO引擎
│   ├── internal-links.ts    # 内链引擎
│   ├── ad-manager.ts        # 广告管理
│   ├── affiliate-manager.ts # 联盟管理
│   ├── auto-internal-links.ts # 自动内链
│   └── analytics-tracker.ts # 数据追踪
└── types/                   # TypeScript类型定义
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站

### 访问管理后台
http://localhost:3000/admin

## 使用指南

### 1. 创建新页面

使用SEO引擎生成SEO配置：

```typescript
import { seoEngine } from '@/lib/seo-engine'

const seo = seoEngine.generateSEO('recommendation', {
  keyword: 'best vps',
  category: 'VPS Hosting'
})

const schema = seoEngine.generateSchema('recommendation', {
  title: seo.title,
  description: seo.description,
  solutions: yourSolutions
}, '/vps/best-vps-2026')
```

### 2. 使用页面模板

```typescript
import RecommendationTemplate from '@/components/templates/RecommendationTemplate'

<RecommendationTemplate data={pageData} />
```

### 3. 管理广告位

```typescript
import { adManager } from '@/lib/ad-manager'

// 添加广告位
adManager.addAdSlot({
  id: 'ad-1',
  name: 'In-Content Ad',
  type: AdSlotType.IN_CONTENT,
  adCode: '<div>Ad Code</div>',
  enabled: true
})

// 启用A/B测试
adManager.enableABTest('ad-1', [
  { id: 'variant-1', adCode: '<div>Variant 1</div>', traffic: 50 },
  { id: 'variant-2', adCode: '<div>Variant 2</div>', traffic: 50 }
])
```

### 4. 追踪联盟链接

```typescript
import { affiliateManager } from '@/lib/affiliate-manager'

// 记录点击
affiliateManager.recordClick('vultr-main')

// 记录转化
affiliateManager.recordConversion('vultr-main', 50)

// 获取转化率
const rate = affiliateManager.getConversionRate('vultr-main')
```

### 5. 自动内链生成

```typescript
import { autoInternalLinkSystem } from '@/lib/auto-internal-links'

// 添加页面
autoInternalLinkSystem.addPage({
  slug: 'vultr-review',
  title: 'Vultr Review',
  pageType: PageType.REVIEW,
  keywords: ['vultr', 'vps', 'review']
})

// 生成内链
const links = autoInternalLinkSystem.generateLinksForPage('vultr-review')

// 自动插入内链
const { content, insertedLinks } = autoInternalLinkSystem.insertInternalLinks(
  yourContent,
  'vultr-review'
)
```

### 6. 数据分析

```typescript
import { analyticsTracker } from '@/lib/analytics-tracker'

// 追踪页面浏览
analyticsTracker.trackPageView('vultr-review')

// 获取指标
const metrics = analyticsTracker.getAggregatedMetrics('vultr-review')

// 生成优化建议
const suggestions = analyticsTracker.generateOptimizationSuggestions()
```

## SEO最佳实践

### URL结构
- 全小写
- 短链接
- 无参数
- 一URL = 一关键词

示例：
```
/vps/best-vps-2026
/vps/vultr-review
/comparisons/vultr-vs-digitalocean
/tutorials/v2ray-setup
```

### 页面类型选择
- **推荐页**: 商业意图强的关键词
- **评测页**: 品牌相关的搜索
- **对比页**: "vs"类搜索词
- **教程页**: "how to"类搜索
- **资源页**: 付费产品/服务

### Schema.org使用
- FAQ页使用 `FAQPage` schema
- 教程页使用 `HowTo` schema
- 推荐页使用 `ItemList` schema
- 评测页使用 `Review` schema

## 数据库集成（第二阶段）

当前使用内存数据存储。生产环境建议集成：

- **内容存储**: MongoDB 或 PostgreSQL
- **关系型数据**: PostgreSQL
- **缓存层**: Redis
- **分析数据**: ClickHouse 或 BigQuery

## 部署

### Vercel
```bash
vercel deploy
```

### Docker
```bash
docker build -t seo-cms .
docker run -p 3000:3000 seo-cms
```

## 贡献指南

1. Fork本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License
