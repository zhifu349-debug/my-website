import { PageType } from "@/types/content";
import { internalLinkEngine } from "@/lib/internal-links";
import { autoInternalLinkSystem } from "@/lib/auto-internal-links";

describe('Internal Link System', () => {
  beforeEach(() => {
    // 重置测试数据
    autoInternalLinkSystem.addPages([
      {
        slug: 'best-vps-providers',
        title: 'Best VPS Providers',
        pageType: PageType.RECOMMENDATION,
        keywords: ['vps', 'vps providers', 'best vps'],
      },
      {
        slug: 'digitalocean-review',
        title: 'DigitalOcean Review',
        pageType: PageType.REVIEW,
        keywords: ['digitalocean', 'digitalocean review', 'vps review'],
      },
      {
        slug: 'vps-comparison',
        title: 'VPS Comparison',
        pageType: PageType.COMPARISON,
        keywords: ['vps comparison', 'vps vs dedicated', 'vps options'],
      },
      {
        slug: 'how-to-setup-vps',
        title: 'How to Setup VPS',
        pageType: PageType.TUTORIAL,
        keywords: ['setup vps', 'vps tutorial', 'vps setup guide'],
      },
      {
        slug: 'vps-resources',
        title: 'VPS Resources',
        pageType: PageType.RESOURCE,
        keywords: ['vps resources', 'vps guides', 'vps documentation'],
      },
    ]);
  });

  test('should generate internal links based on rules', () => {
    const links = autoInternalLinkSystem.generateLinksForPage('how-to-setup-vps');
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link.fromPageId).toBe('how-to-setup-vps');
      expect(link.linkType).toBe('auto');
    });
  });

  test('should validate internal links', () => {
    const validation = internalLinkEngine.validateInternalLink(
      'how-to-setup-vps',
      'best-vps-providers',
      'Best VPS providers for beginners'
    );
    expect(validation.valid).toBe(true);
    expect(validation.score).toBeGreaterThanOrEqual(50);
  });

  test('should reject self-links', () => {
    const validation = internalLinkEngine.validateInternalLink(
      'how-to-setup-vps',
      'how-to-setup-vps',
      'Learn more'
    );
    expect(validation.valid).toBe(false);
    expect(validation.issues).toContain('Cannot link to the same page');
  });

  test('should reject generic anchor text', () => {
    const validation = internalLinkEngine.validateInternalLink(
      'how-to-setup-vps',
      'best-vps-providers',
      'click here'
    );
    expect(validation.valid).toBe(false);
    expect(validation.issues).toContain('Avoid generic anchor text');
  });

  test('should insert internal links into content', () => {
    const content = 'Looking for the best VPS providers? This tutorial will show you how to setup a VPS.';
    const result = autoInternalLinkSystem.insertInternalLinks(content, 'how-to-setup-vps');
    expect(result.content).toContain('<a href="/best-vps-providers"');
    expect(result.insertedLinks.length).toBeGreaterThan(0);
  });

  test('should track link performance', () => {
    const links = autoInternalLinkSystem.generateLinksForPage('how-to-setup-vps');
    const linkId = links[0].id;
    
    // 模拟点击和展示
    internalLinkEngine.recordLinkImpression(linkId);
    internalLinkEngine.recordLinkClick(linkId);
    
    const performance = internalLinkEngine.getLinkPerformance(linkId);
    expect(performance).not.toBeNull();
    expect(performance?.clicks).toBe(1);
    expect(performance?.impressions).toBe(1);
    expect(performance?.ctr).toBe(100);
  });

  test('should generate comprehensive report', () => {
    const report = autoInternalLinkSystem.generateReport();
    expect(report).toContain('Internal Link Report');
    expect(report).toContain('Total Pages');
    expect(report).toContain('Total Generated Links');
  });

  test('should manage link rules', () => {
    const initialRules = internalLinkEngine.getLinkRules();
    expect(initialRules.length).toBeGreaterThan(0);
    
    // 添加新规则
    internalLinkEngine.addLinkRule({
      from: PageType.TUTORIAL,
      to: PageType.RESOURCE,
      priority: 3,
      anchorTemplate: 'Useful {keyword} resources',
      minKeywordMatch: 0.2,
    });
    
    const updatedRules = internalLinkEngine.getLinkRules();
    expect(updatedRules.length).toBe(initialRules.length + 1);
  });

  test('should generate rules report', () => {
    const report = autoInternalLinkSystem.generateRulesReport();
    expect(report).toContain('Internal Link Rules Report');
    expect(report).toContain('Total Rules');
  });

  test('should calculate keyword match score', () => {
    // 测试关键词匹配度计算
    const sourceKeywords = ['vps', 'setup'];
    const targetKeywords = ['vps providers', 'best vps'];
    
    // 这里我们间接测试，通过生成链接来验证
    const links = autoInternalLinkSystem.generateLinksForPage('how-to-setup-vps');
    expect(links.length).toBeGreaterThan(0);
  });
});
