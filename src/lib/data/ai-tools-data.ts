/**
 * AI 工具数据
 */

import { AITool } from './types';

export const aiToolsData: Record<string, AITool> = {
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png",
    rating: 4.8,
    price: "$20/month",
    description: {
      en: "ChatGPT is OpenAI's advanced AI assistant, capable of engaging in natural conversations, writing code, analyzing data, and more. With GPT-4, it offers unprecedented capabilities.",
      zh: "ChatGPT 是 OpenAI 的高级 AI 助手，能够进行自然对话、编写代码，分析数据等。借助 GPT-4，它提供了前所未有的能力。",
    },
    features: [
      { name: "Natural Language Processing" },
      { name: "Code Generation" },
      { name: "Data Analysis" },
      { name: "Multi-language Support" },
      { name: "API Access" },
      { name: "Plugins & GPTs" },
    ],
    featuresZh: [
      "自然语言处理",
      "代码生成",
      "数据分析",
      "多语言支持",
      "API访问",
      "插件和GPTs",
    ],
    pros: ["Excellent conversation ability", "Wide knowledge base", "Strong coding assistance", "Regular improvements"],
    prosZh: ["出色的对话能力", "广泛的知识库", "强大的编码辅助", "持续改进"],
    cons: ["Knowledge cutoff", "Can hallucinate", "Requires subscription"],
    consZh: ["知识截止", "可能产生幻觉", "高级功能需要订阅"],
    website: "https://chat.openai.com",
  },
  claude: {
    id: "claude",
    name: "Claude",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Anthropic_Logo.svg/2048px-Anthropic_Logo.svg.png",
    rating: 4.7,
    price: "$20/month",
    description: {
      en: "Claude is Anthropic's AI assistant known for its long context window (200K tokens), excellent reasoning, and safe design principles.",
      zh: "Claude 是 Anthropic 的 AI 助手，以其长上下文窗口（200K tokens）、出色的推理能力和安全设计原则著称。",
    },
    features: [
      { name: "200K Token Context" },
      { name: "Advanced Reasoning" },
      { name: "Code Writing" },
      { name: "Document Analysis" },
      { name: "Vision Analysis" },
      { name: "Computer Use" },
    ],
    featuresZh: [
      "200K Token上下文",
      "高级推理",
      "代码编写",
      "文档分析",
      "视觉分析",
      "计算机使用",
    ],
    pros: ["Long context window", "Excellent for documents", "Strong ethical design", "Great at complex tasks"],
    prosZh: ["长上下文窗口", "处理文档出色", "道德设计优秀", "复杂任务能力强"],
    cons: ["Limited free tier", "Slower than competitors", "Less community resources"],
    consZh: ["免费层有限", "比竞争对手慢", "社区资源较少"],
    website: "https://claude.ai",
  },
  midjourney: {
    id: "midjourney",
    name: "Midjourney",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Discord_icon.svg/2048px-Discord_icon.svg.png",
    rating: 4.6,
    price: "$10-35/month",
    description: {
      en: "Midjourney is an AI image generation tool that creates stunning artwork from text descriptions. Known for artistic quality and unique style.",
      zh: "Midjourney 是一个 AI 图像生成工具，可以从文字描述创建精美的艺术作品。以艺术质量和独特风格著称。",
    },
    features: [
      { name: "Text to Image" },
      { name: "Style Variations" },
      { name: "High Resolution Output" },
      { name: "Batch Generation" },
      { name: "Image Upscaling" },
    ],
    featuresZh: [
      "文本转图像",
      "风格变化",
      "高分辨率输出",
      "批量生成",
      "图像放大",
    ],
    pros: ["Beautiful artistic style", "High quality output", "Active community", "Regular updates"],
    prosZh: ["艺术风格优美", "输出质量高", "社区活跃", "定期更新"],
    cons: ["Discord-only interface", "Limited free credits", "Slow generation"],
    consZh: ["仅限Discord界面", "免费积分有限", "生成速度慢"],
    website: "https://www.midjourney.com",
  },
  github_copilot: {
    id: "github-copilot",
    name: "GitHub Copilot",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png",
    rating: 4.7,
    price: "$10/month",
    description: {
      en: "GitHub Copilot is an AI pair programmer that suggests code and entire functions in real-time, right from your editor.",
      zh: "GitHub Copilot 是一个 AI 结对程序员，可以直接在编辑器中实时建议代码和整个函数。",
    },
    features: [
      { name: "Real-time Code Suggestions" },
      { name: "Multi-language Support" },
      { name: "IDE Integration" },
      { name: "Context-aware" },
      { name: "Chat Interface" },
    ],
    featuresZh: [
      "实时代码建议",
      "多语言支持",
      "IDE集成",
      "上下文感知",
      "聊天界面",
    ],
    pros: ["Seamless IDE integration", "Multi-language", "Learns from context", "Free for students"],
    prosZh: ["无缝IDE集成", "多语言", "从上下文学习", "学生免费"],
    cons: ["Requires subscription", "Can suggest incorrect code", "Privacy concerns"],
    consZh: ["需要订阅", "可能建议错误代码", "隐私问题"],
    website: "https://github.com/features/copilot",
  },
};

// 获取所有 AI 工具列表
export function getAllAITools(): AITool[] {
  return Object.values(aiToolsData);
}

// 根据 slug 获取 AI 工具
export function getAIToolBySlug(slug: string): AITool | undefined {
  return aiToolsData[slug];
}
