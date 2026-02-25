/**
 * 联盟链接配置
 * 从环境变量读取，避免在代码中硬编码真实链接
 */

export interface AffiliateConfig {
  vultr: string;
  digitalocean: string;
  linode: string;
  aws: string;
  hetzner: string;
  chatgpt: string;
  claude: string;
  midjourney: string;
  githubCopilot: string;
  notionAI: string;
}

// 从环境变量读取联盟链接，如果没有则使用占位符
export const affiliateLinks: AffiliateConfig = {
  vultr: process.env.AFFILIATE_VULTR || "https://www.vultr.com/",
  digitalocean: process.env.AFFILIATE_DIGITALOCEAN || "https://www.digitalocean.com/",
  linode: process.env.AFFILIATE_LINODE || "https://www.linode.com/",
  aws: process.env.AFFILIATE_AWS || "https://aws.amazon.com/lightsail",
  hetzner: process.env.AFFILIATE_HETZNER || "https://hetzner.cloud/",
  chatgpt: process.env.AFFILIATE_CHATGPT || "https://chat.openai.com/",
  claude: process.env.AFFILIATE_CLAUDE || "https://claude.ai/",
  midjourney: process.env.AFFILIATE_MIDJOURNEY || "https://www.midjourney.com/",
  githubCopilot: process.env.AFFILIATE_GITHUB_COPILOT || "https://github.com/features/copilot",
  notionAI: process.env.AFFILIATE_NOTION_AI || "https://www.notion.so/product/ai",
};

// 开发环境警告
if (process.env.NODE_ENV === "development") {
  const missingLinks = Object.entries(affiliateLinks).filter(
    ([key, value]) => !process.env[`AFFILIATE_${key.toUpperCase()}`]
  );
  
  if (missingLinks.length > 0) {
    console.warn(
      "⚠️  警告：以下联盟链接未配置环境变量，将使用默认链接:\n",
      missingLinks.map(([key]) => `- AFFILIATE_${key.toUpperCase()}`).join("\n")
    );
  }
}
