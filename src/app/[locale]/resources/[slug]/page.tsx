import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface ResourceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const resourcesData: Record<string, any> = {
  "vps-guide": {
    id: "vps-guide",
    title: {
      en: "Complete VPS Hosting Guide 2026",
      zh: "VPS主机完全指南 2026",
    },
    description: {
      en: "Everything you need to know about VPS hosting, from choosing the right provider to deployment and security.",
      zh: "关于VPS主机您需要知道的一切，从选择正确的提供商到部署和安全。",
    },
    type: { en: "Comprehensive Guide", zh: "综合指南" },
    price: "Free",
    rating: 4.9,
    downloads: "10,000+",
    author: "Expert Team",
    lastUpdated: "2026-02-24",
    content: {
      en: `# Complete VPS Hosting Guide 2026

## Chapter 1: Understanding VPS
- What is VPS and How It Works
- VPS vs Shared Hosting vs Dedicated Server
- When to Choose VPS

## Chapter 2: Choosing a Provider
- Key Factors to Consider
- Top 10 VPS Providers in 2026
- Price Comparison Guide

## Chapter 3: Server Setup
- Initial Server Configuration
- Choosing Operating System
- Basic Security Setup

## Chapter 4: Deployment
- Web Server Installation (Nginx, Apache)
- Database Setup
- SSL Certificate Installation

## Chapter 5: Security Best Practices
- Firewall Configuration
- SSH Key Authentication
- Fail2Ban Setup
- Regular Backups

## Chapter 6: Performance Optimization
- Caching Strategies
- CDN Integration
- Monitoring Tools
`,
      zh: `# VPS主机完全指南 2026

## 第1章：理解VPS
- 什么是VPS及其工作原理
- VPS vs 共享主机 vs 独服
- 何时选择VPS

## 第2章：选择提供商
- 需要考虑的关键因素
- 2026年十大VPS提供商
- 价格对比指南

## 第3章：服务器设置
- 初始服务器配置
- 选择操作系统
- 基础安全设置

## 第4章：部署
- Web服务器安装（Nginx、Apache）
- 数据库设置
- SSL证书安装

## 第5章：安全最佳实践
- 防火墙配置
- SSH密钥认证
- Fail2Ban设置
- 定期备份

## 第6章：性能优化
- 缓存策略
- CDN集成
- 监控工具
`,
    },
  },
  "docker-masterclass": {
    id: "docker-masterclass",
    title: {
      en: "Docker Mastery: From Zero to Hero",
      zh: "Docker精通：从零到英雄",
    },
    description: {
      en: "Complete Docker learning path from installation to production deployment. Real-world projects included.",
      zh: "完整的Docker学习路径，从安装到生产部署。包含实际项目。",
    },
    type: { en: "Video Course", zh: "视频课程" },
    price: "Free",
    rating: 4.8,
    downloads: "8,500+",
    author: "DevOps Academy",
    lastUpdated: "2026-02-24",
    content: {
      en: `# Docker Mastery: From Zero to Hero

## Module 1: Getting Started
- What is Docker?
- Installing Docker on Windows/Mac/Linux
- Your First Container

## Module 2: Docker Fundamentals
- Images and Containers
- Docker Networking
- Volume Management

## Module 3: Dockerfile Deep Dive
- Best Practices
- Multi-stage Builds
- Security Optimization

## Module 4: Docker Compose
- Introduction to Compose
- Multi-container Applications
- Real-world Examples

## Module 5: Production Deployment
- Docker Swarm vs Kubernetes
- CI/CD Integration
- Monitoring and Logging

## Module 6: Advanced Topics
- Docker Security
- Performance Tuning
- Troubleshooting
`,
      zh: `# Docker精通：从零到英雄

## 模块1：入门
- 什么是Docker？
- 在Windows/Mac/Linux上安装Docker
- 您的第一个容器

## 模块2：Docker基础
- 镜像和容器
- Docker网络
- 卷管理

## 模块3：Dockerfile深入
- 最佳实践
- 多阶段构建
- 安全优化

## 模块4：Docker Compose
- Compose介绍
- 多容器应用
- 实际示例

## 模块5：生产部署
- Docker Swarm vs Kubernetes
- CI/CD集成
- 监控和日志

## 模块6：高级主题
- Docker安全
- 性能调优
- 故障排除
`,
    },
  },
  "react-patterns": {
    id: "react-patterns",
    title: {
      en: "React Design Patterns & Best Practices",
      zh: "React设计模式与最佳实践",
    },
    description: {
      en: "Learn professional React patterns used by top companies. Includes hooks, state management, and performance.",
      zh: "学习顶级公司使用的专业React模式。包括钩子、状态管理和性能优化。",
    },
    type: { en: "E-Book", zh: "电子书" },
    price: "Free",
    rating: 4.7,
    downloads: "6,200+",
    author: "React Masters",
    lastUpdated: "2026-02-24",
    content: {
      en: `# React Design Patterns & Best Practices

## Part 1: Component Patterns
- Compound Components
- Render Props Pattern
- Higher-Order Components
- Custom Hooks

## Part 2: State Management
- useState Best Practices
- useReducer for Complex State
- Context API Patterns
- State Machines

## Part 3: Performance
- useMemo and useCallback
- Code Splitting
- Virtualization
- Profiling

## Part 4: Testing
- Unit Testing Components
- Integration Testing
- E2E Testing with Cypress

## Part 5: TypeScript with React
- Typing Components
- Generic Components
- Type-Safe Hooks
`,
      zh: `# React设计模式与最佳实践

## 第1部分：组件模式
- 复合组件
- Render Props模式
- 高阶组件
- 自定义钩子

## 第2部分：状态管理
- useState最佳实践
- useReducer处理复杂状态
- Context API模式
- 状态机

## 第3部分：性能
- useMemo和useCallback
- 代码分割
- 虚拟化
- 性能分析

## 第4部分：测试
- 组件单元测试
- 集成测试
- Cypress端到端测试

## 第5部分：TypeScript与React
- 组件类型定义
- 泛型组件
- 类型安全的钩子
`,
    },
  },
};

export async function generateMetadata({
  params,
}: ResourceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resource = resourcesData[slug];

  if (!resource) {
    return { title: locale === "zh" ? "未找到" : "Not Found" };
  }

  return {
    title: resource.title[locale as Locale],
    description: resource.description[locale as Locale],
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { locale, slug } = await params;
  const resource = resourcesData[slug];
  const isZh = locale === "zh";

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isZh ? "资源未找到" : "Resource Not Found"}
          </h1>
          <Link href={`/${locale}/resources`} className="text-blue-600 hover:underline">
            {isZh ? "返回资源列表" : "Back to Resources"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/${locale}/resources`}
            className="text-white/80 hover:text-white mb-4 inline-flex items-center"
          >
            ← {isZh ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="text-white/80 bg-white/20 px-3 py-1 rounded-full text-sm">
              {resource.type[locale as Locale]}
            </span>
            <span className="text-yellow-300">⭐ {resource.rating}</span>
            <span className="text-white/80">📥 {resource.downloads}</span>
            <span className="text-white/80">✍️ {resource.author}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {resource.title[locale as Locale]}
          </h1>
          <p className="text-white/80 text-lg">
            {resource.description[locale as Locale]}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <span className="text-3xl font-bold text-green-600">{resource.price}</span>
              <span className="text-gray-500 ml-2">- {isZh ? "免费获取" : "Free Access"}</span>
            </div>
            <div className="text-gray-500">
              {isZh ? "最后更新" : "Last Updated"}: {resource.lastUpdated}
            </div>
          </div>
          <div className="prose max-w-none">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
              {resource.content[locale as Locale]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(resourcesData).map((slug) => ({ slug }));
}
