import Link from "next/link";
import { type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

interface AIToolDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const aiToolsData: Record<string, any> = {
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
      en: "Midjourney is the leading AI image generation tool, creating stunning artwork from text descriptions. Known for artistic style and quality.",
      zh: "Midjourney 是领先的 AI 图像生成工具，可以从文本描述创建令人惊艳的艺术品。以艺术风格和质量著称。",
    },
    features: [
      { name: "Text-to-Image" },
      { name: "Image Variation" },
      { name: "Upscaling" },
      { name: "Style Parameters" },
      { name: "Community Feed" },
      { name: "Discord-based" },
    ],
    featuresZh: [
      "文字生成图片",
      "图像变化",
      "放大增强",
      "风格参数",
      "社区动态",
      "基于Discord",
    ],
    pros: ["Highest quality images", "Unique artistic style", "Active community", "Constant improvements"],
    prosZh: ["最高质量图像", "独特艺术风格", "活跃社区", "持续改进"],
    cons: ["Discord only", "Learning curve", "No free tier"],
    consZh: ["仅支持Discord", "学习曲线", "无免费层"],
    website: "https://www.midjourney.com",
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/DeepSeek_logo.svg/1200px-DeepSeek_logo.svg.png",
    rating: 4.5,
    price: "Free / $2/month",
    description: {
      en: "DeepSeek is an open-source AI assistant from China, offering powerful reasoning capabilities at competitive prices. Great for coding and math.",
      zh: "DeepSeek 是来自中国的开源 AI 助手，以具有竞争力的价格提供强大的推理能力。在编程和数学方面表现出色。",
    },
    features: [
      { name: "Open Source" },
      { name: "Code Generation" },
      { name: "Math Reasoning" },
      { name: "Long Context" },
      { name: "API Access" },
      { name: "Affordable Pricing" },
    ],
    featuresZh: [
      "开源",
      "代码生成",
      "数学推理",
      "长上下文",
      "API访问",
      "实惠价格",
    ],
    pros: ["Open source", "Great coding ability", "Very affordable", "Fast API"],
    prosZh: ["开源", "编程能力出色", "价格实惠", "API快速"],
    cons: ["Less established", "Smaller community", "English limited"],
    consZh: ["较新", "社区较小", "英文文档有限"],
    website: "https://deepseek.ai",
  },
  perplexity: {
    id: "perplexity",
    name: "Perplexity",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Perplexity_AI_logo.svg/1200px-Perplexity_AI_logo.svg.png",
    rating: 4.6,
    price: "$20/month",
    description: {
      en: "Perplexity is an AI-powered search engine that provides direct answers with sources. Perfect for research and fact-finding.",
      zh: "Perplexity 是一个 AI 驱动的搜索引擎，提供带来源的直接答案。非常适合研究和查证事实。",
    },
    features: [
      { name: "AI-Powered Search" },
      { name: "Source Citations" },
      { name: "Real-time Info" },
      { name: "Research Mode" },
      { name: "Thread Feature" },
      { name: "API Access" },
    ],
    featuresZh: [
      "AI驱动搜索",
      "来源引用",
      "实时信息",
      "研究模式",
      "对话线程",
      "API访问",
    ],
    pros: ["Accurate citations", "Real-time information", "Great for research", "Clean interface"],
    prosZh: ["准确的引用", "实时信息", "非常适合研究", "界面简洁"],
    cons: ["Limited free tier", "Can be slow", "Less creative"],
    consZh: ["免费层有限", "有时较慢", "创意任务较弱"],
    website: "https://www.perplexity.ai",
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/1200px-Google_Gemini_logo.svg.png",
    rating: 4.5,
    price: "Free / $20/month",
    description: {
      en: "Google Gemini is Google's most capable AI model, integrated with Google services. Excellent for research, coding, and multimodal tasks.",
      zh: "Google Gemini 是 Google 最强大的 AI 模型，与 Google 服务集成。在研究、编程和多模态任务方面表现出色。",
    },
    features: [
      { name: "Multimodal" },
      { name: "Google Integration" },
      { name: "Code Execution" },
      { name: "Large Context" },
      { name: "Free Access" },
      { name: "API Access" },
    ],
    featuresZh: [
      "多模态",
      "Google集成",
      "代码执行",
      "大上下文",
      "免费访问",
      "API访问",
    ],
    pros: ["Google ecosystem", "Free tier available", "Fast processing", "Multimodal"],
    prosZh: ["Google生态系统", "有免费层", "处理快速", "多模态能力"],
    cons: ["Less creative", "Knowledge cutoff", "Can be inconsistent"],
    consZh: ["创意方面不如竞争对手", "知识截止问题", "有时不稳定"],
    website: "https://gemini.google.com",
  },
};

export async function generateMetadata({
  params,
}: AIToolDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = aiToolsData[slug];

  if (!tool) {
    return { title: locale === "zh" ? "未找到" : "Not Found" };
  }

  return {
    title: tool.name + " - " + (locale === "zh" ? "AI工具评测" : "AI Tool Review"),
    description: tool.description[locale as Locale],
  };
}

export default async function AIToolDetailPage({ params }: AIToolDetailPageProps) {
  const { locale, slug } = await params;
  const tool = aiToolsData[slug];
  const isZh = locale === "zh";

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isZh ? "工具未找到" : "Tool Not Found"}
          </h1>
          <Link href={`/${locale}/ai-tools`} className="text-blue-600 hover:underline">
            {isZh ? "返回AI工具列表" : "Back to AI Tools"}
          </Link>
        </div>
      </div>
    );
  }

  const featuresList = isZh ? tool.featuresZh : tool.features.map((f: any) => f.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href={`/${locale}/ai-tools`} className="text-white/80 hover:text-white mb-4 inline-flex items-center">
            ← {isZh ? "返回列表" : "Back to List"}
          </Link>
          <div className="flex items-center gap-6">
            <img src={tool.logo} alt={tool.name} className="w-24 h-24 object-contain bg-white rounded-xl p-4" />
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{tool.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold">{tool.price}</span>
                <span className="text-yellow-300">⭐ {tool.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "概述" : "Overview"}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{tool.description[locale as Locale]}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "主要功能" : "Key Features"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {featuresList.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-purple-500">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-green-600">{isZh ? "优点" : "Pros"}</h2>
            <ul className="space-y-3">
              {(isZh ? tool.prosZh : tool.pros).map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">➕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-red-600">{isZh ? "缺点" : "Cons"}</h2>
            <ul className="space-y-3">
              {(isZh ? tool.consZh : tool.cons).map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-red-500">➖</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <a href={tool.website} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-shadow">
            {isZh ? "访问官网" : "Visit Website"}
          </a>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(aiToolsData).map((slug) => ({ slug }));
}
