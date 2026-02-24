import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface TutorialDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const tutorialsData: Record<string, any> = {
  "v2ray-setup": {
    id: "v2ray-setup",
    title: {
      en: "Complete V2Ray Setup Guide 2026",
      zh: "V2Ray 完整配置教程 2026",
    },
    description: {
      en: "Learn how to set up V2Ray from scratch, including server deployment and client configuration.",
      zh: "学习如何从零开始配置V2Ray，包括服务器部署和客户端配置。",
    },
    content: {
      en: `
## Introduction
V2Ray is a powerful network proxy tool that supports multiple protocols. This guide will help you set up your own V2Ray server.

## Prerequisites
- A VPS with Ubuntu 20.04+
- SSH access to your server
- Basic command line knowledge

## Step 1: Server Setup
\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install V2Ray
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
\`\`\`

## Step 2: Configure V2Ray
Edit the config.json file and set up your preferred protocols.

## Step 3: Client Configuration
Download and configure V2Ray clients for Windows, macOS, or mobile.
      `,
      zh: `
## 简介
V2Ray 是一个强大的网络代理工具，支持多种协议。本指南将帮助您设置自己的 V2Ray 服务器。

## 前提条件
- 一台 Ubuntu 20.04+ 的 VPS
- SSH 访问权限
- 基本的命令行知识

## 步骤 1: 服务器设置
\`\`\`bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 V2Ray
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
\`\`\`

## 步骤 2: 配置 V2Ray
编辑 config.json 文件，设置您喜欢的协议。

## 步骤 3: 客户端配置
下载并配置 Windows、macOS 或移动设备的 V2Ray 客户端。
      `,
    },
    category: { en: "Network Security", zh: "网络安全" },
    difficulty: "Intermediate",
    time: { en: "30 min", zh: "30 分钟" },
    icon: "🛡️",
  },
  "docker-deployment": {
    id: "docker-deployment",
    title: {
      en: "Docker Container Deployment Masterclass",
      zh: "Docker 容器部署实战",
    },
    description: {
      en: "Master Docker deployment from basics to production-ready containers.",
      zh: "掌握 Docker 部署，从基础到生产级容器。",
    },
    content: {
      en: `
## Why Docker?
Docker simplifies deployment by packaging applications with their dependencies.

## Getting Started
\`\`\`bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Verify installation
docker --version
\`\`\`

## Creating Your First Container
Learn how to create, run, and manage Docker containers effectively.
      `,
      zh: `
## 为什么用 Docker？
Docker 通过将应用程序与其依赖项打包来简化部署。

## 入门
\`\`\`bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 验证安装
docker --version
\`\`\`

## 创建第一个容器
学习如何有效创建、运行和管理 Docker 容器。
      `,
    },
    category: { en: "DevOps", zh: "DevOps" },
    difficulty: "Beginner",
    time: { en: "45 min", zh: "45 分钟" },
    icon: "🐳",
  },
  "react-performance": {
    id: "react-performance",
    title: {
      en: "React Performance Optimization Guide",
      zh: "React 性能优化指南",
    },
    description: {
      en: "20+ practical tips to make your React apps lightning fast.",
      zh: "20+ 个实用技巧，让您的 React 应用飞起来。",
    },
    content: {
      en: `
## Performance Matters
Fast apps = better user experience = higher conversions.

## Key Techniques
1. Use useMemo and useCallback
2. Implement code splitting
3. Optimize re-renders
4. Lazy load images
      `,
      zh: `
## 性能很重要
快速的应用 = 更好的用户体验 = 更高的转化率。

## 关键技术
1. 使用 useMemo 和 useCallback
2. 实现代码分割
3. 优化重渲染
4. 延迟加载图片
      `,
    },
    category: { en: "Frontend Development", zh: "前端开发" },
    difficulty: "Advanced",
    time: { en: "60 min", zh: "60 分钟" },
    icon: "⚛️",
  },
};

export async function generateMetadata({
  params,
}: TutorialDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tutorial = tutorialsData[slug];

  if (!tutorial) {
    return { title: locale === "zh" ? "未找到" : "Not Found" };
  }

  return {
    title: tutorial.title[locale as Locale],
    description: tutorial.description[locale as Locale],
  };
}

export default async function TutorialDetailPage({ params }: TutorialDetailPageProps) {
  const { locale, slug } = await params;
  const tutorial = tutorialsData[slug];

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {locale === "zh" ? "教程未找到" : "Tutorial Not Found"}
          </h1>
          <Link href={`/${locale}/tutorials`} className="text-blue-600 hover:underline">
            {locale === "zh" ? "返回教程列表" : "Back to Tutorials"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-green-500 to-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href={`/${locale}/tutorials`}
            className="text-white/80 hover:text-white mb-4 inline-flex items-center"
          >
            ← {locale === "zh" ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{tutorial.icon}</span>
            <span className="text-white/80 bg-white/20 px-3 py-1 rounded-full text-sm">
              {tutorial.category[locale as Locale]}
            </span>
            <span className="text-white/80">
              {tutorial.time[locale as Locale]}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">
            {tutorial.title[locale as Locale]}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600 text-lg mb-8">
            {tutorial.description[locale as Locale]}
          </p>
          <div className="prose max-w-none">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto whitespace-pre-wrap">
              {tutorial.content[locale as Locale]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(tutorialsData).map((slug) => ({
    slug,
  }));
}
