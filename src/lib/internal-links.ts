import { PageType } from "@/types/content";

// 内链规则引擎
export class InternalLinkEngine {
  // 内链规则矩阵
  private linkRules: Array<{
    from: PageType;
    to: PageType;
    priority: number;
    anchorTemplate: string;
  }> = [
    {
      from: PageType.TUTORIAL,
      to: PageType.RECOMMENDATION,
      priority: 1,
      anchorTemplate: "Best {keyword} for {useCase}",
    },
    {
      from: PageType.TUTORIAL,
      to: PageType.REVIEW,
      priority: 2,
      anchorTemplate: "Read our {productName} review",
    },
    {
      from: PageType.REVIEW,
      to: PageType.COMPARISON,
      priority: 1,
      anchorTemplate: "{productName} vs {competitors}",
    },
    {
      from: PageType.REVIEW,
      to: PageType.RECOMMENDATION,
      priority: 2,
      anchorTemplate: "Top {keyword} alternatives",
    },
    {
      from: PageType.COMPARISON,
      to: PageType.RECOMMENDATION,
      priority: 1,
      anchorTemplate: "Best {keyword} ranked",
    },
    {
      from: PageType.COMPARISON,
      to: PageType.REVIEW,
      priority: 2,
      anchorTemplate: "{productName} detailed review",
    },
    {
      from: PageType.RECOMMENDATION,
      to: PageType.REVIEW,
      priority: 1,
      anchorTemplate: "{productName} full review",
    },
    {
      from: PageType.RECOMMENDATION,
      to: PageType.COMPARISON,
      priority: 2,
      anchorTemplate: "Compare {keyword}",
    },
  ];

  // 获取目标页面类型的建议内链
  getSuggestedLinks(
    currentPageType: PageType,
    availablePages: Array<{
      slug: string;
      title: string;
      pageType: PageType;
      keywords: string[];
    }>,
    maxLinks: number = 3,
  ): Array<{
    slug: string;
    anchorText: string;
    priority: number;
  }> {
    const rules = this.linkRules.filter(
      (rule) => rule.from === currentPageType,
    );

    const suggestions: Array<{
      slug: string;
      anchorText: string;
      priority: number;
    }> = [];

    for (const rule of rules) {
      const targetPages = availablePages.filter(
        (page) => page.pageType === rule.to,
      );

      for (const page of targetPages) {
        if (suggestions.length >= maxLinks) break;

        const anchorText = this.replaceVariables(rule.anchorTemplate, {
          keyword: page.keywords[0] || "",
          productName: page.title.split(" ").slice(0, 2).join(" "),
          competitors: "others",
          useCase: "beginners",
        });

        suggestions.push({
          slug: page.slug,
          anchorText,
          priority: rule.priority,
        });
      }
    }

    return suggestions
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxLinks);
  }

  // 生成内链HTML
  generateInternalLinkHTML(
    slug: string,
    anchorText: string,
    className: string = "text-primary hover:underline",
  ): string {
    return `<a href="/${slug}" class="${className}">${anchorText}</a>`;
  }

  // 替换变量占位符
  private replaceVariables(
    template: string,
    variables: Record<string, any>,
  ): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  // 验证内链质量
  validateInternalLink(
    fromSlug: string,
    toSlug: string,
    anchorText: string,
  ): { valid: boolean; score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // 规则1: 不链接到自己
    if (fromSlug === toSlug) {
      issues.push("Cannot link to the same page");
      score -= 100;
    }

    // 规则2: 避免通用锚文本
    const genericAnchors = ["click here", "read more", "learn more", "this"];
    if (genericAnchors.includes(anchorText.toLowerCase())) {
      issues.push("Avoid generic anchor text");
      score -= 30;
    }

    // 规则3: 锚文本长度检查
    if (anchorText.length < 3) {
      issues.push("Anchor text is too short");
      score -= 20;
    }
    if (anchorText.length > 60) {
      issues.push("Anchor text is too long");
      score -= 10;
    }

    return {
      valid: score >= 50,
      score,
      issues,
    };
  }
}

export const internalLinkEngine = new InternalLinkEngine();
