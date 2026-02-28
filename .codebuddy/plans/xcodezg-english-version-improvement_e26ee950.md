---
name: xcodezg-english-version-improvement
overview: 根据深度分析报告，制定 xcodezg.com 英语版本的全面改进计划，包括 SEO 优化、信任建设、内容深度提升和用户体验改进
design:
  architecture:
    framework: react
  styleKeywords:
    - Modern Minimalist
    - Gradient Design
    - Card-based Layout
    - Trust Signals
    - Professional
  fontSystem:
    fontFamily: Inter
    heading:
      size: 48px
      weight: 700
    subheading:
      size: 24px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#2563EB"
      - "#7C3AED"
      - "#059669"
    background:
      - "#F9FAFB"
      - "#FFFFFF"
      - "#F3F4F6"
    text:
      - "#111827"
      - "#374151"
      - "#6B7280"
    functional:
      - "#DC2626"
      - "#059669"
      - "#F59E0B"
todos:
  - id: fix-seo-metadata
    content: 修复 layout.tsx 和 page.tsx 的 SEO 标题为元数据
    status: completed
  - id: unify-brand-text
    content: 统一 i18n-config.ts 中的品牌描述和版权信息
    status: completed
  - id: fix-hero-buttons
    content: 将首页 Hero 按钮改为 Link 组件并添加链接目标
    status: completed
  - id: optimize-trust-signals
    content: 优化首页信任信号展示，调整统计数据
    status: completed
    dependencies:
      - fix-hero-buttons
  - id: create-about-page
    content: 创建双语 About Us 页面，包含品牌故事和联系方式
    status: completed
    dependencies:
      - unify-brand-text
  - id: add-featured-section
    content: 在首页添加精选内容推荐区块
    status: completed
  - id: update-footer-nav
    content: 更新 Footer 添加 About Us 链接
    status: completed
    dependencies:
      - create-about-page
---

## 产品概述

根据深度分析报告，对 xcodezg.com 英语版本进行全面改进，提升其在英语市场的服务能力、用户体验和信任度。

## 核心改进需求

### 1. SEO 优化

- 修复页面标题 "SEO Content Monetization System" 为更友好的品牌标题
- 优化元数据描述，提升搜索引擎友好度

### 2. 用户体验改进

- 将首页 "Get Started" 和 "Learn More" 按钮改为可点击的链接
- 添加指向具体内容的导航路径

### 3. 品牌信息统一

- 统一全站品牌描述，替换 "SEO-driven content monetization platform"
- 更新 Footer 中的关于文本和版权信息

### 4. 信任度建设

- 创建 About Us 页面，展示团队信息、联系方式和网站故事
- 优化信任信号展示，使数据更具可信度

### 5. 内容推荐增强

- 在首页添加热门文章/工具的直接推荐区块

## 技术栈

- Next.js 15 App Router + TypeScript
- Tailwind CSS 样式系统
- 国际化架构（/en/ 和 /zh/ 路径）
- 服务端组件优先

## 实现方案

### SEO 标题修复

修改 `src/app/[locale]/layout.tsx` 和 `src/app/page.tsx` 的 metadata，使用动态生成函数根据 locale 返回对应的标题和描述。

### 按钮链接化

将 `src/app/[locale]/page.tsx` 中的 `<button>` 元素改为 `<Link>` 组件，指向具体的分类页面或关于页面。

### 品牌信息统一

更新 `src/lib/i18n-config.ts` 中的 translations 对象：

- `footer.aboutText`：改为品牌导向的描述
- `footer.copyright`：更新为正确的品牌名

### About Us 页面创建

在 `src/app/[locale]/about/page.tsx` 创建双语关于页面，包含：

- 品牌故事和使命
- 团队介绍
- 联系方式
- 信任指标说明

### 信任信号优化

修改 `src/app/[locale]/page.tsx`：

- 调整 "Trusted by 10,000+ Users" 为更真实的表述
- 优化统计数据展示方式

### 热门内容推荐

在首页添加 Featured Content 区块，展示精选的 VPS、AI Tools 和教程内容。

## 架构设计

```
src/app/[locale]/
├── layout.tsx           [MODIFY] 更新 metadata 生成逻辑
├── page.tsx             [MODIFY] 修复按钮链接，优化信任信号
└── about/
    └── page.tsx         [NEW] 双语 About Us 页面

src/lib/
└── i18n-config.ts       [MODIFY] 更新品牌翻译文本
```

## 关键设计决策

1. **Metadata 生成**：使用 `generateMetadata` 函数实现基于 locale 的动态标题
2. **组件复用**：About 页面复用现有的 Hero 和 Section 样式模式
3. **i18n 一致性**：所有品牌相关文本通过 translations 对象管理，确保双语同步
4. **链接策略**：Get Started 指向 /vps（核心内容），Learn More 指向 /about

## 设计改进方案

### 整体风格

保持现有的现代简约设计风格，使用渐变色彩和卡片式布局。新增 About Us 页面采用与首页一致的视觉语言，确保品牌一致性。

### About Us 页面结构

1. **Hero 区块**：品牌标语 + 使命宣言，使用蓝紫渐变背景
2. **品牌故事区块**：左侧图文介绍，右侧时间线展示发展历程
3. **团队介绍区块**：简洁的卡片式展示（初期可隐藏具体人员，展示团队理念）
4. **信任指标说明**：透明化地解释数据来源
5. **联系方式区块**：邮箱、社交媒体链接

### 首页优化

1. **Hero 按钮**：改为带箭头的链接按钮，增强可点击感知
2. **信任徽章**：添加 "Since 2024" 等时间维度信息增加可信度
3. **Featured Section**：新增精选内容网格，展示3个热门文章/工具卡片

### 响应式设计

所有新增和修改的组件均遵循移动端优先原则，确保在手机设备上的良好体验。