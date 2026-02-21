import { PageType, InternalLink } from "@/types/content";
import { internalLinkEngine } from "@/lib/internal-links";

// 页面链接数据存储
interface PageLinkData {
  slug: string;
  title: string;
  pageType: PageType;
  keywords: string[];
}

// 自动内链生成系统
export class AutoInternalLinkSystem {
  private pages: PageLinkData[] = [];

  // 添加页面到系统
  addPage(page: PageLinkData): void {
    const existingIndex = this.pages.findIndex((p) => p.slug === page.slug);
    if (existingIndex >= 0) {
      this.pages[existingIndex] = page;
    } else {
      this.pages.push(page);
    }
  }

  // 批量添加页面
  addPages(pages: PageLinkData[]): void {
    pages.forEach((page) => this.addPage(page));
  }

  // 为指定页面生成内链建议
  generateLinksForPage(pageSlug: string, maxLinks: number = 3): InternalLink[] {
    const currentPage = this.pages.find((p) => p.slug === pageSlug);
    if (!currentPage) return [];

    const availablePages = this.pages.filter((p) => p.slug !== pageSlug);
    const suggestions = internalLinkEngine.getSuggestedLinks(
      currentPage.pageType,
      availablePages,
      maxLinks,
    );

    return suggestions.map((suggestion) => ({
      id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromPageId: pageSlug,
      toPageId: suggestion.slug,
      anchorText: suggestion.anchorText,
      linkType: "auto" as const,
      priority: suggestion.priority,
    }));
  }

  // 为所有页面批量生成内链
  generateAllInternalLinks(): Map<string, InternalLink[]> {
    const linksMap = new Map<string, InternalLink[]>();

    this.pages.forEach((page) => {
      const links = this.generateLinksForPage(page.slug);
      linksMap.set(page.slug, links);
    });

    return linksMap;
  }

  // 在内容中自动插入内链
  insertInternalLinks(
    content: string,
    pageSlug: string,
    maxInsertions: number = 3,
  ): { content: string; insertedLinks: InternalLink[] } {
    const links = this.generateLinksForPage(pageSlug, maxInsertions);
    let modifiedContent = content;
    const insertedLinks: InternalLink[] = [];

    links.forEach((link) => {
      const anchorText = link.anchorText;
      const linkHtml = `<a href="/${link.toPageId}" class="text-primary hover:underline">${anchorText}</a>`;

      // 尝试在内容中找到自然的插入点
      const insertionRegex = new RegExp(`(\\b${anchorText}\\b)`, "gi");

      if (
        insertionRegex.test(modifiedContent) &&
        insertedLinks.length < maxInsertions
      ) {
        modifiedContent = modifiedContent.replace(
          insertionRegex,
          (match, p1, offset) => {
            // 避免重复替换同一位置
            const before = modifiedContent.substring(0, offset);
            if (before.includes("<a href=") && !before.includes("</a>")) {
              return match; // 已在链接内，不替换
            }

            insertedLinks.push({ ...link });
            return linkHtml;
          },
        );
      }
    });

    return {
      content: modifiedContent,
      insertedLinks,
    };
  }

  // 验证现有内链质量
  validateAllLinks(): Array<{
    from: string;
    to: string;
    anchor: string;
    valid: boolean;
    score: number;
    issues: string[];
  }> {
    const results: Array<{
      from: string;
      to: string;
      anchor: string;
      valid: boolean;
      score: number;
      issues: string[];
    }> = [];

    this.pages.forEach((fromPage) => {
      const suggestions = this.generateLinksForPage(fromPage.slug);

      suggestions.forEach((link) => {
        const validation = internalLinkEngine.validateInternalLink(
          fromPage.slug,
          link.toPageId,
          link.anchorText,
        );

        results.push({
          from: fromPage.slug,
          to: link.toPageId,
          anchor: link.anchorText,
          valid: validation.valid,
          score: validation.score,
          issues: validation.issues,
        });
      });
    });

    return results;
  }

  // 获取内链统计
  getLinkStatistics(): {
    totalPages: number;
    totalGeneratedLinks: number;
    averageLinksPerPage: number;
    linksByType: Record<PageType, number>;
  } {
    const linksMap = this.generateAllInternalLinks();
    let totalLinks = 0;
    const linksByType: Record<string, number> = {};

    Object.keys(PageType).forEach((type) => {
      linksByType[type] = 0;
    });

    linksMap.forEach((links, slug) => {
      const page = this.pages.find((p) => p.slug === slug);
      if (page) {
        linksByType[page.pageType] += links.length;
      }
      totalLinks += links.length;
    });

    return {
      totalPages: this.pages.length,
      totalGeneratedLinks: totalLinks,
      averageLinksPerPage:
        this.pages.length > 0 ? totalLinks / this.pages.length : 0,
      linksByType: linksByType as Record<PageType, number>,
    };
  }

  // 导出内链配置
  exportLinks(): string {
    const linksMap = this.generateAllInternalLinks();
    const data = Object.fromEntries(linksMap);
    return JSON.stringify(data, null, 2);
  }

  // 生成内链报告
  generateReport(): string {
    const stats = this.getLinkStatistics();
    const validationResults = this.validateAllLinks();
    const invalidLinks = validationResults.filter((r) => !r.valid);

    let report = "=== Internal Link Report ===\n\n";
    report += `Total Pages: ${stats.totalPages}\n`;
    report += `Total Generated Links: ${stats.totalGeneratedLinks}\n`;
    report += `Average Links Per Page: ${stats.averageLinksPerPage.toFixed(2)}\n\n`;

    report += "Links by Page Type:\n";
    Object.entries(stats.linksByType).forEach(([type, count]) => {
      report += `  ${type}: ${count}\n`;
    });

    report += "\n";
    if (invalidLinks.length > 0) {
      report += `Invalid Links Found: ${invalidLinks.length}\n`;
      invalidLinks.forEach((link) => {
        report += `  ${link.from} → ${link.to} (${link.issues.join(", ")})\n`;
      });
    } else {
      report += "All links are valid!\n";
    }

    return report;
  }
}

// 导出单例
export const autoInternalLinkSystem = new AutoInternalLinkSystem();
