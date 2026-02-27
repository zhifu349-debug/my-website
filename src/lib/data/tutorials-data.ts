/**
 * 教程数据
 * 包含所有教程文章的详细内容
 */

import { Tutorial } from './types';

export const tutorialsData: Record<string, Tutorial> = {
  "v2ray-setup": {
    id: "v2ray-setup",
    title: {
      en: "Complete V2Ray Setup Guide 2026",
      zh: "V2Ray 完整配置教程 2026",
    },
    description: {
      en: "Learn how to set up V2Ray from scratch, including server deployment and client configuration on Windows, macOS, and Linux.",
      zh: "学习如何从零开始配置V2Ray，包括在Windows、macOS和Linux上部署服务器和配置客户端。",
    },
    content: {
      en: `# Complete V2Ray Setup Guide 2026

## What is V2Ray?
V2Ray is a powerful network proxy tool that supports multiple protocols including VMess, VLess, Trojan, and Shadowsocks. It's designed to help users bypass network restrictions while maintaining good performance.

## Prerequisites
- A VPS with Ubuntu 20.04+ or Debian 10+
- SSH access to your server
- Basic command line knowledge
- A domain name (optional but recommended)

## Step 1: Server Setup

### Update System
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

### Install V2Ray
\`\`\`bash
# Official installation script
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)

# Verify installation
v2ray --version
\`\`\`

## Step 2: Configure V2Ray

### Create Configuration File
\`\`\`bash
sudo mkdir -p /etc/v2ray
sudo vi /etc/v2ray/config.json
\`\`\`

### Basic Configuration (VMess Protocol)
\`\`\`json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "port": 10086,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "YOUR_UUID_HERE",
            "alterId": 0
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
\`\`\`

## Step 3: Start V2Ray
\`\`\`bash
sudo systemctl start v2ray
sudo systemctl enable v2ray
\`\`\`

## Security Tips
- Always use TLS encryption
- Enable firewall rules
- Keep V2Ray updated
- Use strong UUIDs`,
      zh: `# V2Ray 完整配置教程 2026

## 什么是 V2Ray？
V2Ray 是一个强大的网络代理工具，支持多种协议包括 VMess、VLess、Trojan 和 Shadowsocks。它旨在帮助用户绕过网络限制，同时保持良好的性能。

## 前提条件
- 一台 Ubuntu 20.04+ 或 Debian 10+ 的 VPS
- SSH 访问权限
- 基本的命令行知识
- 一个域名（可选但推荐）

## 步骤 1: 服务器设置

### 更新系统
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

### 安装 V2Ray
\`\`\`bash
# 官方安装脚本
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)

# 验证安装
v2ray --version
\`\`\`

## 步骤 2: 配置 V2Ray

### 创建配置文件
\`\`\`bash
sudo mkdir -p /etc/v2ray
sudo vi /etc/v2ray/config.json
\`\`\`

## 安全提示
- 始终使用 TLS 加密
- 启用防火墙规则
- 保持 V2Ray 更新
- 使用强 UUID`,
    },
    category: { en: "Network Security", zh: "网络安全" },
    difficulty: "Intermediate",
    time: { en: "45 min", zh: "45 分钟" },
    icon: "🛡️",
    updated: "2026-02-24",
  },
  "docker-deployment": {
    id: "docker-deployment",
    title: {
      en: "Docker Container Deployment Masterclass",
      zh: "Docker 容器部署实战",
    },
    description: {
      en: "Master Docker from basics to production-ready containers. Learn containerization, image optimization, and deployment strategies.",
      zh: "掌握 Docker 从基础到生产级容器。学习容器化、镜像优化和部署策略。",
    },
    content: {
      en: `# Docker Container Deployment Masterclass

## Why Docker?
Docker simplifies deployment by packaging applications with all their dependencies.

## Getting Started

### Installation
\`\`\`bash
# macOS
brew install docker

# Linux (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
\`\`\`

## Core Concepts

### Images
\`\`\`bash
# Pull an image
docker pull nginx:latest

# Build from Dockerfile
docker build -t myapp:1.0 .
\`\`\`

### Containers
\`\`\`bash
# Run a container
docker run -d -p 8080:80 nginx:latest

# List running containers
docker ps
\`\`\`

## Docker Compose
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
\`\`\``,
      zh: `# Docker 容器部署实战

## 为什么选择 Docker？
Docker 通过将应用程序与其所有依赖项打包来简化部署。

## 入门指南

### 安装
\`\`\`bash
# macOS
brew install docker

# Linux (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
\`\`\`

## 核心概念

### 镜像
\`\`\`bash
# 拉取镜像
docker pull nginx:latest

# 从 Dockerfile 构建
docker build -t myapp:1.0 .
\`\`\``,
    },
    category: { en: "DevOps", zh: "运维" },
    difficulty: "Intermediate",
    time: { en: "60 min", zh: "60 分钟" },
    icon: "🐳",
    updated: "2026-02-25",
  },
};

// 获取所有教程列表
export function getAllTutorials(): Tutorial[] {
  return Object.values(tutorialsData);
}

// 根据 slug 获取教程
export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorialsData[slug];
}
