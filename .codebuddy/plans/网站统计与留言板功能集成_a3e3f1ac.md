---
name: 网站统计与留言板功能集成
overview: 为网站添加访问统计集成和 Waline 留言板功能，包括 Google Analytics API 接入管理后台、Waline 后端部署、以及教程/评测页面评论组件集成。
todos:
  - id: ga-api-setup
    content: 创建 Google Analytics API 封装模块
    status: completed
  - id: analytics-api-route
    content: 创建 /api/analytics API 端点
    status: completed
    dependencies:
      - ga-api-setup
  - id: update-dashboard
    content: 更新管理后台分析仪表板组件
    status: completed
    dependencies:
      - analytics-api-route
  - id: create-comments
    content: 创建 Waline 评论通用组件
    status: completed
  - id: add-comments-tutorials
    content: 在教程详情页添加评论组件
    status: completed
    dependencies:
      - create-comments
  - id: add-comments-other
    content: 在 VPS/AI工具/对比页添加评论组件
    status: completed
    dependencies:
      - create-comments
  - id: update-env-config
    content: 更新环境变量配置和部署文档
    status: completed
---

## 产品概述

为 xcodezg 网站添加访问统计分析与留言板功能，实现数据可视化和用户互动。

## 核心功能

### 1. 访问统计功能

- Google Analytics 4 数据接入管理后台
- 实时访客数、热门页面、用户来源可视化展示
- 支持中英文双语界面

### 2. 留言板功能

- 基于 Waline 的评论系统
- 部署在教程详情页、VPS推荐页、AI工具页、对比页面底部
- 支持匿名评论、邮件通知、管理员回复

## 技术栈

### 访问统计

- **Google Analytics Data API** - 获取 GA4 数据
- **googleapis** - Node.js Google API 客户端
- **服务账号认证** - 安全的 API 访问

### 留言板

- **Waline** - 开源评论系统
- **@waline/client** - 前端客户端
- **Vercel + LeanCloud** - 免费部署方案

## 实现方案

### 一、Google Analytics API 集成

1. **创建 Google Cloud 服务账号**

- 在 Google Cloud Console 创建项目
- 启用 Analytics Data API
- 创建服务账号并下载 JSON 密钥
- 将服务账号添加到 GA4 资源

2. **后端 API 实现**

- 创建 `/api/analytics` 端点
- 实现访客数、热门页面、用户来源等数据查询
- 数据缓存策略（5分钟缓存）

3. **管理后台集成**

- 更新 `AnalyticsDashboard.tsx` 组件
- 替换模拟数据为真实 GA 数据
- 添加日期范围选择器

### 二、Waline 评论系统

1. **Waline 服务端部署**（用户需手动完成）

- Vercel 一键部署
- LeanCloud 作为数据库（免费额度充足）
- 配置环境变量

2. **前端组件开发**

- 创建 `src/components/Comments.tsx` 通用组件
- 基于 @waline/client 封装
- 支持中英文语言切换
- 暗色主题适配

3. **页面集成**

- 教程详情页 `/tutorials/[slug]`
- VPS 推荐页 `/vps`
- AI 工具页 `/ai-tools`
- 对比页面 `/comparisons`

## 目录结构

```
project-root/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── analytics/           # [NEW] GA 数据 API
│   │           └── route.ts         # 返回访客、热门页面等数据
│   ├── components/
│   │   ├── Comments.tsx             # [NEW] Waline 评论组件
│   │   └── admin/
│   │       └── AnalyticsDashboard.tsx # [MODIFY] 接入真实 GA 数据
│   └── lib/
│       └── google-analytics.ts       # [NEW] GA API 封装
├── .env.example                      # [MODIFY] 添加 GA 和 Waline 配置
└── WALINE_DEPLOYMENT.md             # [NEW] Waline 部署指南
```

## 关键代码结构

```typescript
// src/lib/google-analytics.ts
interface AnalyticsData {
  dailyVisitors: { date: string; count: number }[];
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; count: number }[];
  realTimeUsers: number;
}

export async function getAnalyticsData(startDate: Date, endDate: Date): Promise<AnalyticsData>

// src/components/Comments.tsx
interface CommentsProps {
  path: string;        // 评论页面唯一标识
  locale?: 'en' | 'zh';
}

export default function Comments({ path, locale }: CommentsProps)
```

## 环境变量配置

```
# Google Analytics API
GA_PROPERTY_ID=123456789
GA_CREDENTIALS={"type":"service_account",...}

# Waline
NEXT_PUBLIC_WALINE_SERVER_URL=https://your-waline.vercel.app
```

## 实施注意事项

1. **GA API 配额限制**：Data API 每天有配额限制，需实现缓存机制
2. **Waline 部署**：用户需自行部署 Waline 服务端到 Vercel
3. **评论安全**：配置 Waline 的敏感词过滤和垃圾评论防护
4. **性能优化**：评论组件使用动态导入，避免影响页面加载

## SubAgent

- **code-explorer**
- Purpose: 探索现有模板组件结构，确定评论组件插入位置
- Expected outcome: 识别所有需要添加评论组件的页面模板，确定组件集成方式