/**
 * 生产级内容数据
 * 包含所有页面的真实可用内容
 */

// ==================== VPS 数据 ====================
export const vpsProviders = [
  {
    id: "vultr",
    name: "Vultr",
    slug: "vultr",
    price: "$5/month",
    affiliateUrl: "https://www.vultr.com/?ref=9529593-8H",
    logo: "/images/vps/vultr-logo.svg",
    rating: 4.8,
    bestFor: ["开发者", "中小企业", "全球部署"],
    description: {
      en: "High-performance SSD cloud servers with 32 global locations. Perfect for developers and businesses needing scalable infrastructure.",
      zh: "高性能SSD云服务器，拥有32个全球数据中心。非常适合需要可扩展基础设施的开发者和企业。",
    },
    pros: [
      "全球32个数据中心，覆盖6大洲",
      "NVMe SSD存储，读写速度极快",
      "按小时计费，灵活无合约",
      "一键部署100+应用",
      "100% SLA保证",
      "支持Windows和Linux系统",
    ],
    cons: [
      "低价套餐技术支持有限",
      "新用户需要信用卡验证",
      "部分区域偶尔缺货",
    ],
    features: [
      "Intel/AMD高性能CPU",
      "NVMe SSD存储",
      "免费DDoS防护",
      "私有网络支持",
      "自定义ISO安装",
      "API和CLI管理",
      "快照和备份",
      "负载均衡器",
    ],
    pricingPlans: [
      { name: "Cloud Compute", cpu: "1 vCPU", ram: "1 GB", storage: "25 GB NVMe", bandwidth: "2 TB", price: "$5/mo" },
      { name: "Cloud Compute", cpu: "1 vCPU", ram: "2 GB", storage: "50 GB NVMe", bandwidth: "3 TB", price: "$10/mo" },
      { name: "Cloud Compute", cpu: "2 vCPU", ram: "4 GB", storage: "100 GB NVMe", bandwidth: "4 TB", price: "$20/mo" },
      { name: "High Frequency", cpu: "1 vCPU", ram: "1 GB", storage: "32 GB NVMe", bandwidth: "1 TB", price: "$6/mo" },
    ],
    dataCenters: ["New York", "London", "Singapore", "Tokyo", "Amsterdam", "Los Angeles", "Frankfurt", "Sydney"],
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    slug: "digitalocean",
    price: "$4/month",
    affiliateUrl: "https://m.do.co/c/8e48a7ff99e2",
    logo: "/images/vps/digitalocean-logo.svg",
    rating: 4.7,
    bestFor: ["初学者", "开发者", "初创公司"],
    description: {
      en: "Developer-friendly cloud platform known for simplicity and excellent documentation. Great for beginners and startups.",
      zh: "以简洁和优秀文档著称的开发者友好云平台。非常适合初学者和初创公司。",
    },
    pros: [
      "极致简洁的控制面板",
      "业界最详细的文档和教程",
      "活跃的技术社区",
      "稳定可靠的基础设施",
      "丰富的API支持",
      "一键应用市场",
    ],
    cons: [
      "仅12个数据中心",
      "不支持Windows系统",
      "高级功能需要额外付费",
    ],
    features: [
      "SSD存储",
      "99.99% SLA保证",
      "浮动IP",
      "托管数据库",
      "Kubernetes托管",
      "对象存储Spaces",
      "CDN服务",
      "云防火墙",
    ],
    pricingPlans: [
      { name: "Basic", cpu: "1 vCPU", ram: "512 MB", storage: "10 GB SSD", bandwidth: "500 GB", price: "$4/mo" },
      { name: "Basic", cpu: "1 vCPU", ram: "1 GB", storage: "25 GB SSD", bandwidth: "1 TB", price: "$6/mo" },
      { name: "Basic", cpu: "1 vCPU", ram: "2 GB", storage: "50 GB SSD", bandwidth: "2 TB", price: "$12/mo" },
      { name: "General Purpose", cpu: "2 vCPU", ram: "8 GB", storage: "25 GB SSD", bandwidth: "4 TB", price: "$42/mo" },
    ],
    dataCenters: ["New York", "San Francisco", "Amsterdam", "Singapore", "London", "Frankfurt", "Toronto", "Bangalore"],
  },
  {
    id: "linode",
    name: "Linode",
    slug: "linode",
    price: "$5/month",
    affiliateUrl: "https://www.linode.com/?r=7c71c0d8a5c5e0e7d6c9f2b9a6e5d6c5",
    logo: "/images/vps/linode-logo.svg",
    rating: 4.6,
    bestFor: ["高级用户", "生产环境", "技术爱好者"],
    description: {
      en: "Trusted by developers since 2003. Excellent value with predictable pricing and premium hardware.",
      zh: "自2003年起受开发者信赖。优质硬件和可预测的价格，性价比极高。",
    },
    pros: [
      "2003年成立，历史悠久",
      "7x24小时专业支持",
      "多种Linux发行版",
      "性价比极高",
      "原生IPv6支持",
      "简洁直观的管理界面",
    ],
    cons: [
      "学习曲线较陡",
      "Windows支持有限",
      "一键应用较少",
    ],
    features: [
      "AMD EPYC处理器",
      "NVMe存储",
      "云防火墙",
      "NodeBalancers负载均衡",
      "对象存储",
      "GPU实例",
      "托管Kubernetes",
      "备份服务",
    ],
    pricingPlans: [
      { name: "Nanode", cpu: "1 vCPU", ram: "1 GB", storage: "25 GB SSD", bandwidth: "1 TB", price: "$5/mo" },
      { name: "Linode", cpu: "1 vCPU", ram: "2 GB", storage: "50 GB SSD", bandwidth: "2 TB", price: "$10/mo" },
      { name: "Linode", cpu: "2 vCPU", ram: "4 GB", storage: "80 GB SSD", bandwidth: "4 TB", price: "$20/mo" },
      { name: "Linode", cpu: "4 vCPU", ram: "8 GB", storage: "160 GB SSD", bandwidth: "5 TB", price: "$40/mo" },
    ],
    dataCenters: ["Newark", "Fremont", "Dallas", "Atlanta", "London", "Frankfurt", "Singapore", "Tokyo", "Mumbai", "Sydney", "Toronto", "Milan"],
  },
  {
    id: "aws-lightsail",
    name: "AWS Lightsail",
    slug: "aws-lightsail",
    price: "$3.50/month",
    affiliateUrl: "https://aws.amazon.com/lightsail/",
    logo: "/images/vps/aws-logo.svg",
    rating: 4.5,
    bestFor: ["AWS生态用户", "初学者", "简单应用"],
    description: {
      en: "Simple virtual servers from Amazon Web Services. Easy to use for beginners with AWS ecosystem integration.",
      zh: "亚马逊云服务提供的简单虚拟服务器。易于使用，与AWS生态系统完美集成。",
    },
    pros: [
      "与AWS服务无缝集成",
      "静态IP免费",
      "快照和备份简单",
      "托管数据库服务",
      "CDN集成",
      "全球基础设施",
    ],
    cons: [
      "价格相对较高",
      "超出套餐后费用昂贵",
      "功能相对简单",
    ],
    features: [
      "SSD存储",
      "静态IP",
      "DNS管理",
      "快照备份",
      "负载均衡",
      "托管数据库",
      "对象存储",
      "CDN",
    ],
    pricingPlans: [
      { name: "512MB RAM", cpu: "2 vCPU", ram: "512 MB", storage: "20 GB SSD", bandwidth: "1 TB", price: "$3.50/mo" },
      { name: "1GB RAM", cpu: "2 vCPU", ram: "1 GB", storage: "40 GB SSD", bandwidth: "2 TB", price: "$5/mo" },
      { name: "2GB RAM", cpu: "2 vCPU", ram: "2 GB", storage: "60 GB SSD", bandwidth: "3 TB", price: "$10/mo" },
      { name: "4GB RAM", cpu: "2 vCPU", ram: "4 GB", storage: "80 GB SSD", bandwidth: "4 TB", price: "$20/mo" },
    ],
    dataCenters: ["Virginia", "Ohio", "Oregon", "Ireland", "Frankfurt", "Singapore", "Tokyo", "Sydney", "Mumbai", "Seoul", "Paris", "London", "Stockholm", "Bahrain", "São Paulo"],
  },
  {
    id: "hetzner",
    name: "Hetzner Cloud",
    slug: "hetzner",
    price: "€4.51/month",
    affiliateUrl: "https://hetzner.cloud/?ref=GzWj5a7wVKrL",
    logo: "/images/vps/hetzner-logo.svg",
    rating: 4.6,
    bestFor: ["欧洲用户", "预算敏感", "高性能需求"],
    description: {
      en: "German engineering at its finest. Extremely competitive pricing with excellent performance. Best for European users.",
      zh: "德国工程典范。极具竞争力的价格和出色的性能。最适合欧洲用户。",
    },
    pros: [
      "欧洲数据中心速度快",
      "价格极具竞争力",
      "AMD EPYC高性能CPU",
      "NVMe存储标配",
      "按小时精确计费",
      "无隐藏费用",
    ],
    cons: [
      "仅欧洲和美国数据中心",
      "亚太访问速度较慢",
      "英文/德文界面",
    ],
    features: [
      "AMD EPYC处理器",
      "NVMe存储",
      "专用CPU选项",
      "浮动IP",
      "负载均衡器",
      "防火墙",
      "网络存储",
      "备份服务",
    ],
    pricingPlans: [
      { name: "CX11", cpu: "1 vCPU", ram: "2 GB", storage: "20 GB NVMe", bandwidth: "20 TB", price: "€4.51/mo" },
      { name: "CX21", cpu: "2 vCPU", ram: "4 GB", storage: "40 GB NVMe", bandwidth: "20 TB", price: "€8.22/mo" },
      { name: "CX31", cpu: "2 vCPU", ram: "8 GB", storage: "80 GB NVMe", bandwidth: "20 TB", price: "€14.76/mo" },
      { name: "CPX11", cpu: "2 vCPU", ram: "2 GB", storage: "40 GB NVMe", bandwidth: "20 TB", price: "€5.35/mo" },
    ],
    dataCenters: ["Nuremberg", "Falkenstein", "Helsinki", "Ashburn, VA", "Hillsboro, OR"],
  },
];

// ==================== AI 工具数据 ====================
export const aiTools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    slug: "chatgpt",
    category: "ai-writing",
    price: "$20/month",
    affiliateUrl: "https://chat.openai.com/",
    logo: "/images/ai/chatgpt-logo.svg",
    rating: 4.8,
    bestFor: ["写作", "编程", "研究", "日常助手"],
    description: {
      en: "OpenAI's flagship conversational AI. Exceptional at writing, coding, analysis, and creative tasks.",
      zh: "OpenAI的旗舰对话AI。在写作、编程、分析和创意任务方面表现出色。",
    },
    pros: [
      "多语言能力强，中文支持好",
      "GPT-4推理能力顶尖",
      "代码生成和调试优秀",
      "知识面广，2024年4月截止",
      "插件生态丰富",
      "API支持完善",
    ],
    cons: [
      "GPT-4有使用限制",
      "偶尔会产生幻觉",
      "高级功能需要订阅",
    ],
    features: [
      "GPT-4模型",
      "代码解释器",
      "DALL-E 3图像生成",
      "文件上传分析",
      "网页浏览",
      "自定义GPTs",
      "语音对话",
      "API接入",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    slug: "claude",
    category: "ai-writing",
    price: "$20/month",
    affiliateUrl: "https://claude.ai/",
    logo: "/images/ai/claude-logo.svg",
    rating: 4.7,
    bestFor: ["长文本", "分析", "研究", "写作"],
    description: {
      en: "Anthropic's AI assistant with exceptional reasoning and safety. Best for long-form content and analysis.",
      zh: "Anthropic的AI助手，具有出色的推理能力和安全性。最适合长文本和分析。",
    },
    pros: [
      "支持超长上下文(200K tokens)",
      "推理能力强，逻辑清晰",
      "更安全，更少幻觉",
      "长文本处理能力顶尖",
      "Artifacts功能强大",
      "编程能力优秀",
    ],
    cons: [
      "无法实时联网",
      "没有图像生成功能",
      "在某些创意任务上不如ChatGPT",
    ],
    features: [
      "Claude 3.5 Sonnet",
      "200K上下文窗口",
      "Artifacts交互",
      "文件上传分析",
      "代码生成",
      "多模态理解",
      "API接入",
      "团队版",
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    slug: "midjourney",
    category: "ai-image",
    price: "$10/month",
    affiliateUrl: "https://www.midjourney.com/",
    logo: "/images/ai/midjourney-logo.svg",
    rating: 4.8,
    bestFor: ["艺术创作", "设计", "插画", "概念图"],
    description: {
      en: "The leading AI image generation tool. Unmatched artistic quality and creativity.",
      zh: "领先的AI图像生成工具。无与伦比的艺术质量和创意。",
    },
    pros: [
      "图像质量业界顶尖",
      "艺术风格多样",
      "社区灵感丰富",
      "Discord生态活跃",
      "持续快速迭代",
      "V6版本细节惊人",
    ],
    cons: [
      "需要通过Discord使用",
      "对提示词要求较高",
      "无法生成真实人脸",
    ],
    features: [
      "V6图像生成",
      "风格混合",
      "图像放大",
      "图像变体",
      "图生图",
      "角色一致",
      "Pan/Zoom功能",
      "Web界面",
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    slug: "github-copilot",
    category: "ai-coding",
    price: "$10/month",
    affiliateUrl: "https://github.com/features/copilot",
    logo: "/images/ai/copilot-logo.svg",
    rating: 4.6,
    bestFor: ["程序员", "开发者", "学生"],
    description: {
      en: "AI pair programmer powered by OpenAI. Best-in-class code completion and generation.",
      zh: "由OpenAI驱动的AI编程助手。业界领先的代码补全和生成。",
    },
    pros: [
      "代码补全速度快",
      "支持多种IDE",
      "理解上下文能力强",
      "代码注释生成",
      "测试代码生成",
      "学生免费使用",
    ],
    cons: [
      "偶尔会生成过时代码",
      "对复杂架构理解有限",
      "隐私考虑（代码上传）",
    ],
    features: [
      "实时代码补全",
      "整函数生成",
      "注释生成代码",
      "测试代码生成",
      "VS Code集成",
      "JetBrains集成",
      "Chat功能",
      "CLI工具",
    ],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    slug: "notion-ai",
    category: "ai-productivity",
    price: "$10/month",
    affiliateUrl: "https://www.notion.so/product/ai",
    logo: "/images/ai/notion-logo.svg",
    rating: 4.5,
    bestFor: ["笔记", "协作", "文档", "知识管理"],
    description: {
      en: "AI-powered writing assistant built into Notion. Perfect for note-taking, documentation, and team collaboration.",
      zh: "内置于Notion的AI写作助手。非常适合笔记、文档和团队协作。",
    },
    pros: [
      "与Notion完美集成",
      "写作辅助功能强大",
      "会议记录整理",
      "数据库自动填充",
      "支持多种内容类型",
      "团队协作增强",
    ],
    cons: [
      "需要Notion订阅",
      "AI功能单独付费",
      "代码支持较弱",
    ],
    features: [
      "智能写作",
      "内容生成",
      "翻译功能",
      "摘要生成",
      "头脑风暴",
      "会议记录",
      "数据库AI填充",
      "Q&A功能",
    ],
  },
];

// ==================== 教程数据 ====================
export const tutorials = [
  {
    id: "v2ray-setup",
    slug: "v2ray-setup",
    title: {
      en: "Complete V2Ray Setup Guide 2026",
      zh: "完整 V2Ray 搭建教程 2026",
    },
    description: {
      en: "Step-by-step guide to build your own V2Ray proxy server. Bypass internet restrictions and protect your privacy.",
      zh: "一步步教你搭建自己的V2Ray代理服务器。突破网络限制，保护隐私安全。",
    },
    category: "network-security",
    difficulty: "intermediate",
    duration: "30 min",
    tags: ["V2Ray", "VPS", "Proxy", "Security"],
    icon: "🛡️",
    prerequisites: [
      "一台VPS服务器（推荐Vultr、DigitalOcean）",
      "基础的Linux命令知识",
      "SSH客户端（如Terminal、PuTTY）",
      "域名（可选，用于TLS证书）",
    ],
    steps: [
      {
        title: "购买VPS服务器",
        content: "推荐选择Vultr或DigitalOcean，选择最接近你地理位置的数据中心。最低配置1核1GB内存即可。系统选择Ubuntu 22.04 LTS。",
      },
      {
        title: "连接服务器",
        content: "使用SSH连接你的服务器：ssh root@your-server-ip。首次连接需要确认指纹，输入yes。",
      },
      {
        title: "更新系统",
        content: "运行以下命令更新系统：apt update && apt upgrade -y。这一步确保系统软件是最新版本。",
      },
      {
        title: "安装V2Ray",
        content: "使用官方一键安装脚本：bash <(curl -L https://github.com/v2fly/fhs-install-v2ray/raw/master/install-release.sh)。安装完成后V2Ray会自动启动。",
      },
      {
        title: "配置V2Ray",
        content: "编辑配置文件 /usr/local/etc/v2ray/config.json。建议使用WebSocket + TLS配置以获得最佳稳定性和安全性。",
      },
      {
        title: "配置防火墙",
        content: "开放必要端口：ufw allow 443/tcp && ufw allow 80/tcp && ufw enable。确保V2Ray端口可以正常访问。",
      },
      {
        title: "安装Nginx（可选）",
        content: "如果需要进行流量伪装，安装Nginx：apt install nginx -y。配置反向代理到V2Ray端口。",
      },
      {
        title: "客户端配置",
        content: "下载V2RayN(Windows)、V2RayNG(Android)或Shadowrocket(iOS)。导入服务器配置即可开始使用。",
      },
    ],
    commonErrors: [
      {
        error: "连接超时",
        solution: "检查防火墙设置，确保端口已开放。同时检查VPS服务商的安全组设置。",
      },
      {
        error: "证书错误",
        solution: "确保域名正确解析到服务器IP，且Nginx配置正确。可以尝试重新申请证书。",
      },
      {
        error: "速度慢",
        solution: "尝试更换数据中心，或启用BBR加速。也可以使用CDN加速。",
      },
    ],
    faqs: [
      {
        question: "V2Ray安全吗？",
        answer: "V2Ray使用现代加密算法，传输过程是安全的。但请注意遵守当地法律法规。",
      },
      {
        question: "V2Ray和Shadowsocks有什么区别？",
        answer: "V2Ray功能更强大，支持更多协议和传输方式，抗封锁能力更强。Shadowsocks更简单轻量。",
      },
    ],
  },
  {
    id: "docker-deployment",
    slug: "docker-deployment",
    title: {
      en: "Docker Container Deployment Guide",
      zh: "Docker 容器部署实战指南",
    },
    description: {
      en: "Learn how to containerize and deploy applications using Docker. From basics to production-ready setups.",
      zh: "学习如何使用Docker容器化并部署应用。从基础到生产级配置。",
    },
    category: "devops",
    difficulty: "beginner",
    duration: "45 min",
    tags: ["Docker", "DevOps", "Deployment", "Container"],
    icon: "🐳",
    prerequisites: [
      "基础的Linux命令知识",
      "一台VPS或本地Linux环境",
      "基本的Web开发概念",
    ],
    steps: [
      {
        title: "安装Docker",
        content: "运行官方安装脚本：curl -fsSL https://get.docker.com | sh。安装完成后将当前用户加入docker组：usermod -aG docker $USER。",
      },
      {
        title: "验证安装",
        content: "运行 docker --version 查看版本，运行 docker run hello-world 测试是否正常工作。",
      },
      {
        title: "创建Dockerfile",
        content: "为你的应用创建Dockerfile。以Node.js应用为例：FROM node:18-alpine, WORKDIR /app, COPY . ., RUN npm install, CMD ['node', 'index.js']",
      },
      {
        title: "构建镜像",
        content: "运行 docker build -t myapp:1.0 . 构建镜像。使用-t标签为镜像命名和版本号。",
      },
      {
        title: "运行容器",
        content: "启动容器：docker run -d -p 3000:3000 --name myapp myapp:1.0。-d后台运行，-p映射端口。",
      },
      {
        title: "使用Docker Compose",
        content: "创建docker-compose.yml管理多容器应用。定义服务、网络、卷等配置，使用docker-compose up -d启动。",
      },
      {
        title: "数据持久化",
        content: "使用Docker Volume保存数据：docker volume create mydata。在compose中挂载：volumes: - mydata:/data",
      },
      {
        title: "生产环境配置",
        content: "配置自动重启策略restart: always，设置资源限制，配置日志轮转，使用Nginx反向代理。",
      },
    ],
    commonErrors: [
      {
        error: "端口被占用",
        solution: "使用lsof -i :3000查看占用进程，或使用其他端口映射如-p 3001:3000",
      },
      {
        error: "权限不足",
        solution: "确保用户已加入docker组，或重新登录使权限生效。",
      },
    ],
    faqs: [
      {
        question: "Docker和虚拟机有什么区别？",
        answer: "Docker容器共享主机内核，更轻量快速。虚拟机需要完整操作系统，资源占用更大。",
      },
      {
        question: "Docker镜像和容器的关系？",
        answer: "镜像是只读的模板，容器是镜像的运行实例。可以基于一个镜像创建多个容器。",
      },
    ],
  },
  {
    id: "react-performance",
    slug: "react-performance",
    title: {
      en: "React Performance Optimization Guide",
      zh: "React 性能优化完全指南",
    },
    description: {
      en: "20 proven techniques to optimize React applications. From rendering to bundle size optimization.",
      zh: "20个经过验证的React应用优化技巧。从渲染优化到打包体积优化。",
    },
    category: "frontend",
    difficulty: "advanced",
    duration: "60 min",
    tags: ["React", "Performance", "Frontend", "Optimization"],
    icon: "⚛️",
    prerequisites: [
      "熟练掌握React基础",
      "了解React Hooks",
      "熟悉Chrome DevTools",
    ],
    steps: [
      {
        title: "使用React.memo",
        content: "对纯展示组件使用React.memo进行记忆化，避免不必要的重渲染。注意不要在props中使用对象字面量。",
      },
      {
        title: "使用useMemo和useCallback",
        content: "缓存昂贵的计算结果和回调函数。但不要在所有地方都使用，因为缓存本身也有成本。",
      },
      {
        title: "虚拟列表",
        content: "对于长列表使用react-window或react-virtualized，只渲染可见区域的内容。",
      },
      {
        title: "代码分割",
        content: "使用React.lazy和Suspense进行路由级别的代码分割，减少首屏加载时间。",
      },
      {
        title: "图片优化",
        content: "使用WebP格式，实现懒加载，使用srcset响应式图片。可以使用Next.js Image组件。",
      },
      {
        title: "状态管理优化",
        content: "避免将不必要的状态放在全局。使用selector减少重渲染。考虑使用Zustand替代Redux。",
      },
    ],
    commonErrors: [
      {
        error: "过度优化",
        solution: "先测量再优化，使用React DevTools Profiler找出真正的性能瓶颈。",
      },
    ],
    faqs: [
      {
        question: "什么时候使用useMemo？",
        answer: "当计算成本较高且依赖不经常变化时使用。简单计算不需要useMemo。",
      },
    ],
  },
  {
    id: "nginx-config",
    slug: "nginx-config",
    title: {
      en: "Advanced Nginx Configuration Guide",
      zh: "Nginx 高级配置实战",
    },
    description: {
      en: "Master Nginx reverse proxy, load balancing, SSL, and performance tuning.",
      zh: "掌握Nginx反向代理、负载均衡、SSL配置和性能调优。",
    },
    category: "devops",
    difficulty: "advanced",
    duration: "50 min",
    tags: ["Nginx", "DevOps", "Server", "Security"],
    icon: "🌐",
    prerequisites: [
      "熟悉Linux基础命令",
      "了解HTTP协议基础",
      "拥有一台VPS服务器",
    ],
    steps: [
      {
        title: "安装Nginx",
        content: "Ubuntu/Debian: apt update && apt install nginx -y。CentOS: yum install nginx -y。启动服务：systemctl start nginx",
      },
      {
        title: "配置反向代理",
        content: "编辑/etc/nginx/sites-available/default，添加location / { proxy_pass http://localhost:3000; proxy_http_version 1.1; }",
      },
      {
        title: "配置SSL证书",
        content: "使用Certbot申请免费证书：apt install certbot python3-certbot-nginx -y && certbot --nginx -d yourdomain.com",
      },
      {
        title: "启用Gzip压缩",
        content: "在nginx.conf中添加gzip on; gzip_types text/plain application/javascript text/css;",
      },
      {
        title: "配置负载均衡",
        content: "定义upstream后端组，使用least_conn或ip_hash策略。配置健康检查。",
      },
    ],
    commonErrors: [
      {
        error: "403 Forbidden",
        solution: "检查文件权限和Nginx用户，确保www-data可以访问网站目录。",
      },
      {
        error: "502 Bad Gateway",
        solution: "检查后端服务是否运行，端口是否正确，防火墙是否开放。",
      },
    ],
    faqs: [
      {
        question: "Nginx和Apache怎么选？",
        answer: "Nginx性能更好，资源占用低，适合高并发。Apache模块丰富，.htaccess灵活。新项目推荐Nginx。",
      },
    ],
  },
];

// ==================== 资源数据 ====================
export const resources = [
  {
    id: "vps-mastery",
    slug: "vps-mastery",
    title: "VPS Mastery: From Beginner to Pro",
    title_zh: "VPS精通：从入门到专家",
    category: "guide",
    price: 29,
    rating: 4.9,
    downloads: 5200,
    description: {
      en: "Complete guide to VPS hosting: selection, setup, security, and optimization. Over 200 pages of practical content.",
      zh: "VPS主机完整指南：选择、配置、安全和优化。超过200页的实用内容。",
    },
    features: [
      "10个主流VPS深度评测",
      "服务器安全配置清单",
      "性能优化实战技巧",
      "自动化运维脚本集",
      "故障排查手册",
      "视频教程10+小时",
    ],
    includes: [
      "PDF电子书（200+页）",
      "配置脚本合集",
      "视频教程",
      "在线更新",
      "社区访问权限",
    ],
  },
  {
    id: "docker-course",
    slug: "docker-course",
    title: "Docker & Kubernetes Masterclass",
    title_zh: "Docker与Kubernetes大师课",
    category: "course",
    price: 49,
    rating: 4.8,
    downloads: 3100,
    description: {
      en: "Comprehensive container course covering Docker, Compose, and Kubernetes. Real-world projects included.",
      zh: "全面覆盖Docker、Compose和Kubernetes的容器课程。包含真实项目实战。",
    },
    features: [
      "Docker基础到进阶",
      "Docker Compose编排",
      "Kubernetes集群搭建",
      "CI/CD流水线集成",
      "生产环境最佳实践",
      "故障排查案例",
    ],
    includes: [
      "15小时视频课程",
      "项目源代码",
      "配套文档",
      "在线实验环境",
      "证书认证",
    ],
  },
  {
    id: "react-patterns",
    slug: "react-patterns",
    title: "React Design Patterns & Best Practices",
    title_zh: "React设计模式与最佳实践",
    category: "handbook",
    price: 19,
    rating: 4.7,
    downloads: 4800,
    description: {
      en: "Essential patterns for building scalable React applications. Hooks, state management, and performance tips.",
      zh: "构建可扩展React应用的必备模式。Hooks、状态管理和性能技巧。",
    },
    features: [
      "20+设计模式详解",
      "Hooks最佳实践",
      "状态管理对比",
      "性能优化技巧",
      "测试策略",
      "代码审查清单",
    ],
    includes: [
      "PDF手册",
      "代码示例库",
      "TypeScript版本",
      "定期更新",
    ],
  },
  {
    id: "api-security",
    slug: "api-security",
    title: "API Security Best Practices",
    title_zh: "API安全防护指南",
    category: "security",
    price: 35,
    rating: 4.8,
    downloads: 2800,
    description: {
      en: "Protect your APIs from attacks. Authentication, authorization, rate limiting, and penetration testing.",
      zh: "保护你的API免受攻击。认证、授权、限流和渗透测试。",
    },
    features: [
      "OAuth 2.0和JWT详解",
      "常见攻击防护",
      "API网关配置",
      "限流和熔断",
      "安全测试方法",
      "合规要求",
    ],
    includes: [
      "安全指南",
      "配置模板",
      "检查清单",
      "漏洞案例库",
    ],
  },
  {
    id: "performance-guide",
    slug: "performance-guide",
    title: "Web Performance Optimization",
    title_zh: "网站性能优化完全指南",
    category: "optimization",
    price: 39,
    rating: 4.6,
    downloads: 3500,
    description: {
      en: "Speed up your website: Core Web Vitals, caching, CDN, and image optimization techniques.",
      zh: "加速你的网站：Core Web Vitals、缓存、CDN和图片优化技术。",
    },
    features: [
      "Core Web Vitals优化",
      "缓存策略设计",
      "CDN配置指南",
      "图片和字体优化",
      "JavaScript性能",
      "监控和告警",
    ],
    includes: [
      "优化指南",
      "分析工具",
      "配置模板",
      "案例研究",
    ],
  },
  {
    id: "cloud-deploy",
    slug: "cloud-deploy",
    title: "Cloud Deployment Handbook",
    title_zh: "云部署实战手册",
    category: "devops",
    price: 59,
    rating: 4.9,
    downloads: 2100,
    description: {
      en: "Deploy to AWS, Azure, GCP, and more. Infrastructure as Code, CI/CD, and monitoring.",
      zh: "部署到AWS、Azure、GCP等云平台。基础设施即代码、CI/CD和监控。",
    },
    features: [
      "主流云平台对比",
      "Terraform实战",
      "CI/CD流水线",
      "容器编排",
      "监控告警",
      "成本优化",
    ],
    includes: [
      "部署手册",
      "Terraform代码",
      "GitHub Actions模板",
      "视频演示",
    ],
  },
];

// ==================== 对比数据 ====================
export const comparisons = [
  {
    id: "vultr-vs-digitalocean",
    slug: "vultr-vs-digitalocean",
    title: "Vultr vs DigitalOcean: Complete Comparison",
    title_zh: "Vultr vs DigitalOcean：全面对比",
    products: ["vultr", "digitalocean"],
    summary: {
      en: "Vultr offers more global locations and NVMe storage, while DigitalOcean excels in documentation and ease of use.",
      zh: "Vultr提供更多全球位置和NVMe存储，而DigitalOcean在文档和易用性方面更胜一筹。",
    },
    comparisonTable: [
      { feature: "起步价格", vultr: "$5/月", digitalocean: "$4/月" },
      { feature: "数据中心数量", vultr: "32个", digitalocean: "12个" },
      { feature: "存储类型", vultr: "NVMe SSD", digitalocean: "SSD" },
      { feature: "内存起步", vultr: "1 GB", digitalocean: "512 MB" },
      { feature: "带宽", vultr: "1-5 TB", digitalocean: "500 GB - 5 TB" },
      { feature: "API质量", vultr: "⭐⭐⭐⭐", digitalocean: "⭐⭐⭐⭐⭐" },
      { feature: "文档质量", vultr: "⭐⭐⭐⭐", digitalocean: "⭐⭐⭐⭐⭐" },
      { feature: "一键应用", vultr: "100+", digitalocean: "50+" },
      { feature: "Windows支持", vultr: "✅", digitalocean: "❌" },
      { feature: "按小时计费", vultr: "✅", digitalocean: "✅" },
    ],
    scenarios: [
      {
        scenario: "初学者",
        winner: "digitalocean",
        reason: "DigitalOcean有更详细的文档和更友好的界面，社区教程也更多。",
      },
      {
        scenario: "全球部署",
        winner: "vultr",
        reason: "Vultr有32个数据中心，覆盖更广，适合需要全球部署的用户。",
      },
      {
        scenario: "高性能需求",
        winner: "vultr",
        reason: "Vultr的High Frequency实例使用NVMe存储，I/O性能更好。",
      },
      {
        scenario: "API自动化",
        winner: "digitalocean",
        reason: "DigitalOcean的API更成熟，社区SDK和工具更丰富。",
      },
    ],
    verdit: {
      en: "Choose DigitalOcean if you're a beginner or need excellent documentation. Choose Vultr if you need global presence or the best performance per dollar.",
      zh: "如果你是初学者或需要优秀的文档，选择DigitalOcean。如果你需要全球部署或最佳性价比，选择Vultr。",
    },
  },
  {
    id: "chatgpt-vs-claude",
    slug: "chatgpt-vs-claude",
    title: "ChatGPT vs Claude: Which AI Assistant is Better?",
    title_zh: "ChatGPT vs Claude：哪个AI助手更好？",
    products: ["chatgpt", "claude"],
    summary: {
      en: "ChatGPT excels in versatility and features, while Claude shines in reasoning and handling long contexts.",
      zh: "ChatGPT在多功能性和特性方面表现出色，而Claude在推理和处理长上下文方面更胜一筹。",
    },
    comparisonTable: [
      { feature: "模型版本", chatgpt: "GPT-4/GPT-3.5", claude: "Claude 3.5 Sonnet" },
      { feature: "上下文长度", chatgpt: "128K", claude: "200K" },
      { feature: "联网搜索", chatgpt: "✅", claude: "❌" },
      { feature: "图像生成", chatgpt: "DALL-E 3", claude: "❌" },
      { feature: "代码能力", chatgpt: "⭐⭐⭐⭐⭐", claude: "⭐⭐⭐⭐⭐" },
      { feature: "推理能力", chatgpt: "⭐⭐⭐⭐", claude: "⭐⭐⭐⭐⭐" },
      { feature: "长文本处理", chatgpt: "⭐⭐⭐", claude: "⭐⭐⭐⭐⭐" },
      { feature: "安全性", chatgpt: "⭐⭐⭐⭐", claude: "⭐⭐⭐⭐⭐" },
      { feature: "价格", chatgpt: "$20/月", claude: "$20/月" },
      { feature: "免费版", chatgpt: "GPT-3.5", claude: "Claude 3 Haiku" },
    ],
    scenarios: [
      {
        scenario: "日常对话和写作",
        winner: "chatgpt",
        reason: "ChatGPT响应更快，联网功能可以获取最新信息。",
      },
      {
        scenario: "长文档分析",
        winner: "claude",
        reason: "Claude支持200K上下文，可以处理整本书或大量代码。",
      },
      {
        scenario: "编程和调试",
        winner: "tie",
        reason: "两者代码能力都很强，ChatGPT有代码解释器，Claude推理更清晰。",
      },
      {
        scenario: "创意写作",
        winner: "chatgpt",
        reason: "ChatGPT在创意和风格多样性方面略胜一筹。",
      },
    ],
    verdit: {
      en: "Use ChatGPT for versatility and latest information. Use Claude for deep analysis, long documents, and when you need the most accurate reasoning.",
      zh: "需要多功能性和最新信息时用ChatGPT。需要深度分析、长文档处理或最准确推理时用Claude。",
    },
  },
];

// ==================== FAQ 数据 ====================
export const commonFAQs = {
  vps: [
    {
      question: { en: "What is a VPS?", zh: "什么是VPS？" },
      answer: { 
        en: "A VPS (Virtual Private Server) is a virtual machine that runs its own copy of an operating system. You get dedicated resources (CPU, RAM, storage) on a shared physical server, giving you more control and performance than shared hosting.",
        zh: "VPS（虚拟专用服务器）是运行自己操作系统副本的虚拟机。你在共享物理服务器上获得专用资源（CPU、RAM、存储），比共享主机提供更多的控制和性能。",
      },
    },
    {
      question: { en: "How much does a VPS cost?", zh: "VPS多少钱？" },
      answer: { 
        en: "VPS prices typically range from $3-50/month for basic plans. Entry-level plans ($3-6/month) offer 1GB RAM and 1 CPU core, suitable for small websites. Higher-tier plans ($10-50/month) offer more resources for larger applications.",
        zh: "VPS价格通常在每月3-50美元之间。入门级套餐（3-6美元/月）提供1GB RAM和1个CPU核心，适合小型网站。高级套餐（10-50美元/月）提供更多资源，适合大型应用。",
      },
    },
    {
      question: { en: "Do I need technical skills to use a VPS?", zh: "使用VPS需要技术技能吗？" },
      answer: { 
        en: "Basic Linux command line knowledge is helpful but not always required. Many providers offer managed VPS services where they handle server maintenance. You can also use control panels like cPanel or Plesk for graphical management.",
        zh: "基本的Linux命令行知识有帮助，但并非总是必需。许多提供商提供托管VPS服务，他们会处理服务器维护。你也可以使用cPanel或Plesk等控制面板进行图形化管理。",
      },
    },
    {
      question: { en: "What's the difference between VPS and shared hosting?", zh: "VPS和共享主机有什么区别？" },
      answer: { 
        en: "Shared hosting puts many websites on one server with shared resources. VPS gives you dedicated resources and isolated environment. VPS offers better performance, security, and customization, but requires more technical knowledge.",
        zh: "共享主机将多个网站放在一台服务器上共享资源。VPS为你提供专用资源和隔离环境。VPS提供更好的性能、安全性和可定制性，但需要更多技术知识。",
      },
    },
    {
      question: { en: "Can I upgrade my VPS later?", zh: "以后可以升级VPS吗？" },
      answer: { 
        en: "Yes, most VPS providers allow easy upgrades. You can typically increase RAM, CPU, and storage with just a few clicks and a reboot. Some even support live upgrades without downtime.",
        zh: "是的，大多数VPS提供商允许轻松升级。通常只需点击几下并重启即可增加RAM、CPU和存储。有些甚至支持不停机在线升级。",
      },
    },
  ],
};
