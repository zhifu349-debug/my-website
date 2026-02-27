---
name: fix-5-critical-issues
overview: 修复网站的5个关键问题：404状态码、favicon路由、评论系统配置、Canonical URL优化、Web Analytics验证
todos:
  - id: "1"
    content: 使用 [subagent:code-explorer] 扫描所有动态路由页面，识别缺少 404 处理和 canonical 配置的文件
    status: completed
  - id: "2"
    content: 创建 [locale]/not-found.tsx 多语言 404 页面
    status: completed
    dependencies:
      - "1"
  - id: "3"
    content: 更新动态路由使用 notFound() 函数正确处理不存在的 slug
    status: completed
    dependencies:
      - "1"
  - id: "4"
    content: 创建 apple-icon.tsx 和 manifest.ts 完善 PWA 配置
    status: completed
  - id: "5"
    content: 优化 icon.tsx 支持多尺寸输出
    status: completed
  - id: "6"
    content: 为所有动态页面生成完整的 canonical URL（包含域名）
    status: completed
    dependencies:
      - "1"
  - id: "7"
    content: 配置 Giscus 评论系统（无需后端部署）
    status: completed
  - id: "8"
    content: 更新 .env.example 添加所有必要的环境变量配置
    status: completed
  - id: "9"
    content: 创建 GA4 验证脚本和配置检查清单
    status: completed
  - id: "10"
    content: 构建测试并生成修复报告
    status: completed
    dependencies:
      - "2"
      - "3"
      - "4"
      - "5"
      - "6"
      - "7"
      - "8"
      - "9"
---

## 项目概述

修复网站存在的5个关键问题，确保网站符合生产环境标准，提升SEO表现和用户体验。

## 核心问题清单

1. **404 状态码修复** - 确保不存在的页面正确返回 HTTP 404 状态码
2. **favicon 路由完善** - 添加完整的图标文件和 PWA 配置
3. **评论系统配置** - 部署并配置评论服务（Waline/Giscus）
4. **Canonical URL 优化** - 为每个页面生成独立的规范链接
5. **Web Analytics 验证** - 确保 GA4 数据收集正常工作

## 问题现状

- 404: 根目录有 not-found.tsx，但动态路由缺少正确的 404 处理
- favicon: 只有基础 icon.tsx，缺少 Apple 图标和 PWA 配置
- 评论: Waline 组件已集成但未配置后端服务
- Canonical: 基础配置存在，动态页面需完善
- Analytics: 代码已集成，需配置环境变量和验证

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **分析**: Google Analytics 4 + @next/third-parties
- **评论**: Waline / Giscus

## 实施方案

### 1. 404 状态码修复

- 创建 `[locale]/not-found.tsx` 多语言 404 页面
- 在动态路由中使用 `notFound()` 函数触发 404
- 确保返回正确的 HTTP 状态码

### 2. favicon 完善

- 创建 `apple-icon.tsx` (180x180)
- 创建 `manifest.ts` (PWA 配置)
- 优化现有 `icon.tsx` 支持多尺寸

### 3. 评论系统

- 方案A: 部署 Waline (需要 LeanCloud/数据库)
- 方案B: 使用 Giscus (基于 GitHub Discussions，无需后端)
- 配置环境变量

### 4. Canonical URL 优化

- 为所有动态路由生成完整的 canonical URL
- 包含站点域名的绝对 URL
- 确保多语言版本正确标注

### 5. Web Analytics

- 配置 GA4 环境变量
- 验证事件追踪触发
- 添加自定义转化事件

## 目录结构变更

```
src/app/
├── [locale]/
│   └── not-found.tsx          # [NEW] 多语言 404 页面
├── apple-icon.tsx             # [NEW] Apple 设备图标
├── manifest.ts                # [NEW] PWA 配置
├── icon.tsx                   # [MODIFY] 优化多尺寸支持
├── layout.tsx                 # [MODIFY] 验证 GA 配置
├── [locale]/tutorials/[slug]/page.tsx  # [MODIFY] 添加 notFound() 调用
├── [locale]/ai-tools/page.tsx          # [MODIFY] 完善 canonical
└── [locale]/vps/page.tsx               # [MODIFY] 完善 canonical
```

## Agent Extensions

### SubAgent: code-explorer

- **用途**: 探索代码库中所有需要修复的文件，识别动态路由和 metadata 配置模式
- **预期结果**: 生成完整的文件清单和修改位置，确保没有遗漏的页面

### SubAgent: code-explorer

- **用途**: 检查所有联盟链接配置和追踪代码集成状态
- **预期结果**: 验证 affiliate-manager 和 analytics 工具是否正确集成到各个页面