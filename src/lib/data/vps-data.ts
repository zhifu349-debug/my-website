/**
 * VPS 服务商数据
 */

import { VPS } from './types';

export const vpsData: Record<string, VPS> = {
  vultr: {
    id: "1",
    name: "Vultr",
    slug: "vultr",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vultr_Logo.svg/2560px-Vultr_Logo.svg.png",
    rating: 4.8,
    price: "$5/month",
    description: {
      en: "Vultr is a high-performance cloud computing platform offering SSD-based instances across 32 global locations. Perfect for developers and businesses needing scalable infrastructure.",
      zh: "Vultr 是一个高性能云计算平台，提供基于SSD的实例，分布在32个全球位置。非常适合需要可扩展基础设施的开发者和企业。",
    },
    features: [
      { name: "NVMe SSD Storage" },
      { name: "Native IPv6 Support" },
      { name: "Hourly Billing" },
      { name: "Full Root Access" },
      { name: "14 Global Locations" },
    ],
    pros: ["Excellent performance", "Global presence", "Competitive pricing", "Fast deployment"],
    prosZh: ["性能出色", "全球布局", "价格竞争力", "快速部署"],
    cons: ["Limited support options", "No free tier"],
    consZh: ["支持选项有限", "无免费层"],
    link: "https://www.vultr.com",
  },
  digitalocean: {
    id: "2",
    name: "DigitalOcean",
    slug: "digitalocean",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/2560px-DigitalOcean_logo.svg.png",
    rating: 4.7,
    price: "$6/month",
    description: {
      en: "DigitalOcean is a developer-first cloud platform known for its simplicity and excellent documentation. Perfect for developers looking for an easy-to-use cloud solution.",
      zh: "DigitalOcean 是一个以开发者为中心的云平台，以其简洁性和优秀的文档著称。非常适合寻找易于使用的云解决方案的开发者。",
    },
    features: [
      { name: "SSD Storage" },
      { name: "99.99% Uptime SLA" },
      { name: "Global CDN" },
      { name: "Automated Backups" },
      { name: "Team Collaboration" },
    ],
    pros: ["Easy to use", "Great documentation", "Strong community", "One-click apps"],
    prosZh: ["易于使用", "文档优秀", "社区活跃", "一键应用"],
    cons: ["Higher pricing", "Limited regions compared to AWS"],
    consZh: ["价格较高", "与AWS相比区域较少"],
    link: "https://www.digitalocean.com",
  },
  linode: {
    id: "3",
    name: "Linode",
    slug: "linode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Linode_Logo.svg/2560px-Linode_Logo.svg.png",
    rating: 4.6,
    price: "$5/month",
    description: {
      en: "Linode has been a trusted name in cloud hosting since 2003. Known for excellent value, predictable pricing, and premium hardware.",
      zh: "Linode 自2003年起就是云托管领域的可信品牌。以出色的性价比、可预测的价格和优质硬件著称。",
    },
    features: [
      { name: "NVMe Storage" },
      { name: "Dedicated CPU Options" },
      { name: "Object Storage" },
      { name: "NodeBalancers" },
      { name: "40+ Global Regions" },
    ],
    pros: ["Great value", "Predictable pricing", "Excellent hardware", "Mature platform"],
    prosZh: ["性价比高", "价格可预测", "硬件优秀", "平台成熟"],
    cons: ["No free tier", "Limited managed services"],
    consZh: ["无免费层", "托管服务有限"],
    link: "https://www.linode.com",
  },
  hetzner: {
    id: "4",
    name: "Hetzner",
    slug: "hetzner",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Hetzner_Logo.svg/2560px-Hetzner_Logo.svg.png",
    rating: 4.5,
    price: "€3.29/month",
    description: {
      en: "Hetzner offers high-performance cloud servers at competitive prices. Based in Germany, it's excellent for European deployments with strong privacy protections.",
      zh: "Hetzner 以有竞争力的价格提供高性能云服务器。总部位于德国，非常适合欧洲部署，具有强大的隐私保护。",
    },
    features: [
      { name: "NVMe SSD" },
      { name: "EU Data Centers" },
      { name: "DDoS Protection" },
      { name: "IPv6 /64" },
      { name: "Snapshots" },
    ],
    pros: ["Very affordable", "Great EU performance", "Strong privacy", "Reliable"],
    prosZh: ["非常实惠", "欧洲性能优秀", "隐私保护强", "可靠"],
    cons: ["Limited locations", "Complex pricing"],
    consZh: ["位置有限", "定价复杂"],
    link: "https://www.hetzner.com",
  },
};

// 获取所有 VPS 列表
export function getAllVPS(): VPS[] {
  return Object.values(vpsData);
}

// 根据 slug 获取 VPS
export function getVPSBySlug(slug: string): VPS | undefined {
  return vpsData[slug];
}
