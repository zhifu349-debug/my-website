import { SEOConfig, SchemaData, SEORule } from "@/types/seo";
import { PageType, FAQ, Solution } from "@/types/content";

// SEO规则引擎
export class SEORuleEngine {
  private rules: Record<PageType, SEORule>;

  constructor() {
    this.rules = {
      [PageType.RECOMMENDATION]: {
        id: "rec-rule",
        pageType: "recommendation",
        titleTemplate: "{keyword} 2026 - Best {category} Reviewed & Ranked",
        descriptionTemplate:
          "Discover the best {keyword} for {intent}. Our experts review and rank top solutions. Compare features, pricing, and find your perfect match.",
        h1Template: "Best {keyword} in 2026",
        h2Templates: [
          "Why Choose the Right {keyword}?",
          "Top {keyword} Comparison",
          "{solutionName} Review",
          "How to Choose the Best {keyword}",
          "FAQ About {keyword}",
        ],
        requiredSections: [
          "comparison-table",
          "detailed-reviews",
          "selection-guide",
          "faq",
        ],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 2000, max: 5000 },
        },
      },
      [PageType.REVIEW]: {
        id: "review-rule",
        pageType: "review",
        titleTemplate: "{productName} Review 2026 - Pros, Cons & Features",
        descriptionTemplate:
          "Comprehensive {productName} review. We tested features, performance, and pricing. Read our honest analysis before you buy.",
        h1Template: "{productName} Review: Is It Worth It?",
        h2Templates: [
          "What Is {productName}?",
          "Key Features",
          "Performance & Reliability",
          "Pricing & Plans",
          "Pros & Cons",
          "Who Should Use {productName}?",
          "FAQ",
        ],
        requiredSections: [
          "background",
          "features",
          "performance",
          "pros-cons",
          "conclusion",
          "faq",
        ],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 1500, max: 3000 },
        },
      },
      [PageType.COMPARISON]: {
        id: "comparison-rule",
        pageType: "comparison",
        titleTemplate: "{productA} vs {productB} - Which One Is Better?",
        descriptionTemplate:
          "Compare {productA} vs {productB} side by side. We analyze features, pricing, and performance to help you choose the best option.",
        h1Template: "{productA} vs {productB}: Complete Comparison",
        h2Templates: [
          "Quick Comparison",
          "Feature Comparison Table",
          "Best for Different Use Cases",
          "Final Verdict",
          "FAQ",
        ],
        requiredSections: [
          "comparison-table",
          "scenario-comparison",
          "final-recommendation",
          "faq",
        ],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 1500, max: 3000 },
        },
      },
      [PageType.TUTORIAL]: {
        id: "tutorial-rule",
        pageType: "tutorial",
        titleTemplate: "How to {action} - Step-by-Step Guide",
        descriptionTemplate:
          "Learn how to {action} with our comprehensive step-by-step guide. Includes screenshots, best practices, and troubleshooting.",
        h1Template: "How to {action}: Complete Guide",
        h2Templates: [
          "What You Will Learn",
          "Prerequisites",
          "Step 1: {stepTitle}",
          "Step 2: {stepTitle}",
          "Common Mistakes to Avoid",
          "FAQ",
        ],
        requiredSections: [
          "background",
          "prerequisites",
          "steps",
          "troubleshooting",
          "faq",
        ],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 1000, max: 2500 },
        },
      },
      [PageType.RESOURCE]: {
        id: "resource-rule",
        pageType: "resource",
        titleTemplate: "{title} - Complete {category} Guide",
        descriptionTemplate:
          "Get our comprehensive {title} guide. Includes {valueProposition} for {targetAudience}.",
        h1Template: "{title}: Complete Guide",
        h2Templates: [
          "What Is This Resource?",
          "Who Should Use This?",
          "What You Will Get",
          "Table of Contents",
          "Pricing",
          "FAQ",
        ],
        requiredSections: [
          "value-proposition",
          "target-audience",
          "contents",
          "pricing",
          "faq",
        ],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 800, max: 2000 },
        },
      },
    };
  }

  // 生成SEO配置
  generateSEO(pageType: PageType, variables: Record<string, any>): SEOConfig {
    const rule = this.rules[pageType];

    return {
      title: this.replaceVariables(rule.titleTemplate, variables),
      description: this.replaceVariables(rule.descriptionTemplate, variables),
      keywords: this.extractKeywords(variables),
      canonical: variables.canonical || undefined,
    };
  }

  // 生成Schema.org数据
  generateSchema(
    pageType: PageType,
    variables: Record<string, any>,
    url: string,
  ): SchemaData {
    const baseSchema: SchemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: url,
      name: variables.title || "",
      description: variables.description || "",
    };

    switch (pageType) {
      case PageType.RECOMMENDATION:
        return {
          ...baseSchema,
          "@type": "ItemList",
          itemListElement: (variables.solutions || []).map(
            (item: Solution, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: item.name,
                description: item.features.join(", "),
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: "USD",
                  url: item.affiliateUrl,
                },
              },
            }),
          ),
        };

      case PageType.REVIEW:
        return {
          ...baseSchema,
          "@type": "Review",
          itemReviewed: {
            "@type": "Product",
            name: variables.productName || "",
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: variables.rating || 0,
          },
        };

      case PageType.TUTORIAL:
        return {
          ...baseSchema,
          "@type": "HowTo",
          name: variables.title || "",
          description: variables.description || "",
          step: (variables.steps || []).map((step: any, index: number) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.title,
            text: step.content,
          })),
        };

      default:
        if (variables.faqs && variables.faqs.length > 0) {
          return {
            ...baseSchema,
            "@type": "FAQPage",
            mainEntity: variables.faqs.map((faq: FAQ) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          };
        }
        return baseSchema;
    }
  }

  // 生成FAQ Schema
  generateFAQSchema(faqs: FAQ[]): SchemaData {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  // 生成面包屑Schema
  generateBreadcrumbSchema(
    breadcrumbs: Array<{ name: string; url: string }>,
  ): SchemaData {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  // 验证SEO配置
  validateSEO(
    pageType: PageType,
    seo: SEOConfig,
  ): { valid: boolean; errors: string[] } {
    const rule = this.rules[pageType];
    const errors: string[] = [];

    if (seo.title.length < rule.suggestedLength.title.min) {
      errors.push(
        `Title is too short (minimum ${rule.suggestedLength.title.min} characters)`,
      );
    }
    if (seo.title.length > rule.suggestedLength.title.max) {
      errors.push(
        `Title is too long (maximum ${rule.suggestedLength.title.max} characters)`,
      );
    }
    if (seo.description.length < rule.suggestedLength.description.min) {
      errors.push(
        `Description is too short (minimum ${rule.suggestedLength.description.min} characters)`,
      );
    }
    if (seo.description.length > rule.suggestedLength.description.max) {
      errors.push(
        `Description is too long (maximum ${rule.suggestedLength.description.max} characters)`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // 生成H标签建议
  generateHeadingSuggestions(
    pageType: PageType,
    variables: Record<string, any>,
  ): string[] {
    const rule = this.rules[pageType];
    return rule.h2Templates.map((template) =>
      this.replaceVariables(template, variables),
    );
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

  // 提取关键词
  private extractKeywords(variables: Record<string, any>): string[] {
    const keywords: string[] = [];

    if (variables.keyword) keywords.push(variables.keyword);
    if (variables.category) keywords.push(variables.category);
    if (variables.productName) keywords.push(variables.productName);

    return keywords;
  }
}

// 导出单例
export const seoEngine = new SEORuleEngine();
