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
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811",
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

## Step 3: Configure Nginx (Optional but Recommended)

### Install Nginx
\`\`\`bash
sudo apt install nginx -y
sudo systemctl enable nginx
\`\`\`

### Configure SSL with Let's Encrypt
\`\`\`bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
\`\`\`

## Step 4: Client Configuration

### Windows
1. Download V2RayN from GitHub
2. Import configuration
3. Start proxy

### macOS
1. Download V2RayX
2. Configure server details
3. Enable system proxy

### iOS
1. Download Shadowrocket or V2Box
2. Add server configuration
3. Connect

## Step 5: Test Your Setup
\`\`\`bash
# Check V2Ray status
sudo systemctl status v2ray

# Check logs
sudo tail -f /var/log/v2ray/error.log
\`\`\`

## Security Tips
- Always use TLS encryption
- Enable firewall rules
- Keep V2Ray updated
- Use strong UUIDs
`,
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

### 基础配置（VMess 协议）
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
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811",
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

## 步骤 3: 配置 Nginx（可选但推荐）

### 安装 Nginx
\`\`\`bash
sudo apt install nginx -y
sudo systemctl enable nginx
\`\`\`

### 使用 Let's Encrypt 配置 SSL
\`\`\`bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
\`\`\`

## 步骤 4: 客户端配置

### Windows
1. 从 GitHub 下载 V2RayN
2. 导入配置
3. 启动代理

### macOS
1. 下载 V2RayX
2. 配置服务器详情
3. 启用系统代理

### iOS
1. 下载 Shadowrocket 或 V2Box
2. 添加服务器配置
3. 连接

## 步骤 5: 测试您的设置
\`\`\`bash
# 检查 V2Ray 状态
sudo systemctl status v2ray

# 查看日志
sudo tail -f /var/log/v2ray/error.log
\`\`\`

## 安全提示
- 始终使用 TLS 加密
- 启用防火墙规则
- 保持 V2Ray 更新
- 使用强 UUID
`,
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
Docker simplifies deployment by packaging applications with all their dependencies. This eliminates the "it works on my machine" problem and enables consistent deployments across environments.

## Getting Started

### Installation
\`\`\`bash
# macOS
brew install docker

# Linux (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Verify
docker --version
docker-compose --version
\`\`\`

## Core Concepts

### Images
Images are read-only templates used to create containers. Think of them as blueprints.

\`\`\`bash
# Pull an image
docker pull nginx:latest

# List images
docker images

# Build from Dockerfile
docker build -t myapp:1.0 .
\`\`\`

### Containers
Containers are running instances of images.

\`\`\`bash
# Run a container
docker run -d -p 8080:80 nginx:latest

# List running containers
docker ps

# Stop a container
docker stop <container_id>
\`\`\`

## Docker Compose

### docker-compose.yml
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
\`\`\`

### Common Commands
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
\`\`\`

## Best Practices

### 1. Use Multi-Stage Builds
\`\`\`dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/index.js"]
\`\`\`

### 2. Never Run as Root
\`\`\`dockerfile
RUN addgroup -g 1001 appgroup && \\
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser
USER appuser
\`\`\`

### 3. Use .dockerignore
\`\`\`
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
\`\`\`

## Production Deployment

### Docker Swarm
\`\`\`bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml myapp

# Scale service
docker service scale myapp_web=5
\`\`\`

### Security Scanning
\`\`\`bash
# Scan for vulnerabilities
docker scan myapp:1.0

# Run with security options
docker run --read-only --tmpfs /tmp myapp:1.0
\`\`\`

## Monitoring

### Health Checks
\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1
\`\`\`

### Logging
\`\`\`bash
# View logs
docker logs -f container_name

# JSON logging driver
docker run --log-driver=json-file --log-opt max-size=10m myapp:1.0
\`\`\`
`,
      zh: `# Docker 容器部署实战

## 为什么用 Docker？
Docker 通过将应用程序与其所有依赖项打包来简化部署。这消除了"在我机器上能运行"的问题，并实现跨环境的一致部署。

## 入门

### 安装
\`\`\`bash
# macOS
brew install docker

# Linux (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 验证
docker --version
docker-compose --version
\`\`\`

## 核心概念

### 镜像
镜像是用于创建容器的只读模板。将其视为蓝图。

\`\`\`bash
# 拉取镜像
docker pull nginx:latest

# 列出镜像
docker images

# 从 Dockerfile 构建
docker build -t myapp:1.0 .
\`\`\`

### 容器
容器是镜像的运行实例。

\`\`\`bash
# 运行容器
docker run -d -p 8080:80 nginx:latest

# 列出运行中的容器
docker ps

# 停止容器
docker stop <container_id>
\`\`\`

## Docker Compose

### docker-compose.yml
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
\`\`\`

### 常用命令
\`\`\`bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
\`\`\`

## 最佳实践

### 1. 使用多阶段构建
\`\`\`dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/index.js"]
\`\`\`

### 2. 永远不要以 Root 运行
\`\`\`dockerfile
RUN addgroup -g 1001 appgroup && \\
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser
USER appuser
\`\`\`

### 3. 使用 .dockerignore
\`\`\`
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
\`\`\`

## 生产部署

### Docker Swarm
\`\`\`bash
# 初始化 swarm
docker swarm init

# 部署 stack
docker stack deploy -c docker-compose.yml myapp

# 扩展服务
docker service scale myapp_web=5
\`\`\`

### 安全扫描
\`\`\`bash
# 扫描漏洞
docker scan myapp:1.0

# 使用安全选项运行
docker run --read-only --tmpfs /tmp myapp:1.0
\`\`\`

## 监控

### 健康检查
\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1
\`\`\`

### 日志
\`\`\`bash
# 查看日志
docker logs -f container_name

# JSON 日志驱动
docker run --log-driver=json-file --log-opt max-size=10m myapp:1.0
\`\`\`
`,
    },
    category: { en: "DevOps", zh: "DevOps" },
    difficulty: "Beginner",
    time: { en: "60 min", zh: "60 分钟" },
    icon: "🐳",
    updated: "2026-02-24",
  },
  "react-performance": {
    id: "react-performance",
    title: {
      en: "React Performance Optimization Guide",
      zh: "React 性能优化指南",
    },
    description: {
      en: "20+ practical tips to make your React apps lightning fast. Learn memoization, code splitting, rendering optimization, and more.",
      zh: "20+ 个实用技巧，让您的 React 应用飞起来。学习记忆化、代码分割、渲染优化等。",
    },
    content: {
      en: `# React Performance Optimization Guide

## Why Performance Matters
- 53% of mobile users leave sites that take >3 seconds to load
- Better UX leads to higher conversion rates
- Google uses Core Web Vitals for ranking

## 1. UseMemo and UseCallback

### useMemo - Memoize Expensive Calculations
\`\`\`tsx
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  return <List data={processedData} />;
}
\`\`\`

### useCallback - Memoize Functions
\`\`\`tsx
function ParentComponent() {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return <Child onClick={handleClick} />;
}
\`\`\`

## 2. Code Splitting

### Dynamic Imports
\`\`\`tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
\`\`\`

### Route-Based Splitting
\`\`\`tsx
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
    </Routes>
  );
}
\`\`\`

## 3. Virtualization

### react-window for Long Lists
\`\`\`tsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={300}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

## 4. Optimize Re-renders

### React.memo
\`\`\`tsx
const Button = React.memo(function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
});
\`\`\`

### useWhyDidYouUpdate Hook
\`\`\`tsx
function useWhyDidYouUpdate(props) {
  const previousProps = useRef({});
  useEffect(() => {
    Object.keys(props).forEach(key => {
      if (previousProps.current[key] !== props[key]) {
        console.log('props changed:', key, previousProps.current[key], props[key]);
      }
    });
    previousProps.current = props;
  });
}
\`\`\`

## 5. Image Optimization

### Next.js Image
\`\`\`tsx
import Image from 'next/image';

function MyPage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:..."
    />
  );
}
\`\`\`

### Lazy Loading Images
\`\`\`tsx
<img loading="lazy" src="image.jpg" alt="..." />
\`\`\`

## 6. Bundle Analysis

### webpack-bundle-analyzer
\`\`\`bash
npm install --save-dev webpack-bundle-analyzer
\`\`\`

\`\`\`javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // other config
});
\`\`\`

## 7. State Management

### Colocate State
\`\`\`tsx
// Bad - Lifted state causes unnecessary re-renders
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <ExpensiveChild />
      <Button onClick={() => setCount(c => c + 1)} />
    </>
  );
}

// Good - Colocated state
function Parent() {
  return (
    <>
      <ExpensiveChild />
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

## 8. Profiling

### React DevTools Profiler
1. Install React DevTools
2. Open DevTools → Profiler tab
3. Click "Record"
4. Interact with your app
5. Analyze the flamegraph

## Performance Checklist
- [ ] Use production build
- [ ] Enable compression
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Use CDN
- [ ] Enable caching
- [ ] Monitor Core Web Vitals
- [ ] Set performance budgets
`,
      zh: `# React 性能优化指南

## 为什么性能很重要
- 53% 的移动用户会在加载时间超过 3 秒时离开网站
- 更好的用户体验带来更高的转化率
- Google 使用 Core Web Vitals 进行排名

## 1. 使用 useMemo 和 useCallback

### useMemo - 记忆化昂贵计算
\`\`\`tsx
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  return <List data={processedData} />;
}
\`\`\`

### useCallback - 记忆化函数
\`\`\`tsx
function ParentComponent() {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return <Child onClick={handleClick} />;
}
\`\`\`

## 2. 代码分割

### 动态导入
\`\`\`tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
\`\`\`

### 路由级分割
\`\`\`tsx
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
    </Routes>
  );
}
\`\`\`

## 3. 虚拟化

### react-window 长列表
\`\`\`tsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={300}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

## 4. 优化重渲染

### React.memo
\`\`\`tsx
const Button = React.memo(function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
});
\`\`\`

## 5. 图片优化

### Next.js Image
\`\`\`tsx
import Image from 'next/image';

function MyPage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:..."
    />
  );
}
\`\`\`

## 6. 包分析

### webpack-bundle-analyzer
\`\`\`bash
npm install --save-dev webpack-bundle-analyzer
\`\`\`

## 7. 状态管理

### 状态共置
\`\`\`tsx
// 不好 - 提升状态导致不必要的重渲染
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <ExpensiveChild />
      <Button onClick={() => setCount(c => c + 1)} />
    </>
  );
}

// 好 - 状态共置
function Parent() {
  return (
    <>
      <ExpensiveChild />
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

## 8. 性能分析

### React DevTools Profiler
1. 安装 React DevTools
2. 打开 DevTools → Profiler 标签
3. 点击 "Record"
4. 与应用交互
5. 分析火焰图

## 性能检查清单
- [ ] 使用生产构建
- [ ] 启用压缩
- [ ] 实现代码分割
- [ ] 优化图片
- [ ] 使用 CDN
- [ ] 启用缓存
- [ ] 监控 Core Web Vitals
- [ ] 设置性能预算
`,
    },
    category: { en: "Frontend Development", zh: "前端开发" },
    difficulty: "Advanced",
    time: { en: "75 min", zh: "75 分钟" },
    icon: "⚛️",
    updated: "2026-02-24",
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
  const isZh = locale === "zh";

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isZh ? "教程未找到" : "Tutorial Not Found"}
          </h1>
          <Link href={`/${locale}/tutorials`} className="text-blue-600 hover:underline">
            {isZh ? "返回教程列表" : "Back to Tutorials"}
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
            ← {isZh ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{tutorial.icon}</span>
            <span className="text-white/80 bg-white/20 px-3 py-1 rounded-full text-sm">
              {tutorial.category[locale as Locale]}
            </span>
            <span className="text-white/80">
              {tutorial.time[locale as Locale]}
            </span>
            <span className="text-white/80">
              {tutorial.difficulty}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">
            {tutorial.title[locale as Locale]}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-600 text-lg mb-8">
            {tutorial.description[locale as Locale]}
          </p>
          <div className="prose max-w-none">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
              {tutorial.content[locale as Locale]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(tutorialsData).map((slug) => ({ slug }));
}
