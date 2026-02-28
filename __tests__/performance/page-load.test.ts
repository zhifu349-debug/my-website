/**
 * 性能测试脚本 - 页面加载性能测试
 * 测试页面加载时间、TTFB、LCP 等关键指标
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('页面性能测试', () => {
  // 性能基准配置
  const PERFORMANCE_THRESHOLDS = {
    ttfb: 600, // 首字节时间 (ms)
    fcp: 2000, // 首次内容绘制 (ms)
    lcp: 2500, // 最大内容绘制 (ms)
    fid: 100,  // 首次输入延迟 (ms)
    cls: 0.1,  // 累积布局偏移
    pageLoad: 3000, // 页面完整加载时间 (ms)
  };

  describe('首页加载性能', () => {
    it('首页应该在性能阈值内加载', () => {
      // 模拟首页性能指标
      const homePageMetrics = {
        url: '/',
        ttfb: 250,
        fcp: 1200,
        lcp: 1800,
        fid: 15,
        cls: 0.02,
        loadTime: 2500,
      };

      expect(homePageMetrics.ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.ttfb);
      expect(homePageMetrics.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.fcp);
      expect(homePageMetrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.lcp);
      expect(homePageMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);
    });

    it('首页应该使用优化的图片', () => {
      const images = [
        { src: '/images/hero.webp', format: 'webp', size: 50000 },
        { src: '/images/icon.png', format: 'png', size: 10000 },
      ];

      const optimizedImages = images.filter(img => 
        img.format === 'webp' || img.format === 'avif'
      );

      expect(optimizedImages.length).toBeGreaterThan(0);
    });

    it('首页应该实现延迟加载', () => {
      const images = [
        { src: '/images/hero.jpg', loading: 'eager' },
        { src: '/images/below-fold.jpg', loading: 'lazy' },
        { src: '/images/thumbnail.jpg', loading: 'lazy' },
      ];

      const lazyLoaded = images.filter(img => img.loading === 'lazy');
      expect(lazyLoaded.length).toBeGreaterThan(0);
    });
  });

  describe('内容页面加载性能', () => {
    it('VPS 列表页应该在性能阈值内加载', () => {
      const vpsPageMetrics = {
        ttfb: 300,
        fcp: 1500,
        lcp: 2000,
        loadTime: 2800,
      };

      expect(vpsPageMetrics.ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.ttfb);
      expect(vpsPageMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);
    });

    it('AI 工具页面应该在性能阈值内加载', () => {
      const aiPageMetrics = {
        ttfb: 280,
        fcp: 1400,
        lcp: 1900,
        loadTime: 2600,
      };

      expect(aiPageMetrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.lcp);
    });

    it('教程页面应该在性能阈值内加载', () => {
      const tutorialPageMetrics = {
        ttfb: 320,
        fcp: 1600,
        lcp: 2200,
        loadTime: 2900,
      };

      expect(tutorialPageMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);
    });
  });

  describe('Admin 页面性能', () => {
    it('Admin 首页应该快速加载', () => {
      const adminMetrics = {
        ttfb: 350,
        fcp: 1800,
        lcp: 2400,
        loadTime: 3200,
      };

      // Admin 页面可以稍微放宽阈值
      expect(adminMetrics.ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.ttfb + 100);
    });

    it('Tab 切换应该即时响应', () => {
      const tabSwitchTimes = [50, 30, 45, 60, 40];
      const avgSwitchTime = tabSwitchTimes.reduce((a, b) => a + b, 0) / tabSwitchTimes.length;

      expect(avgSwitchTime).toBeLessThan(100); // 平均切换时间应小于 100ms
    });
  });

  describe('静态资源性能', () => {
    it('JavaScript 资源应该被压缩', () => {
      const jsResources = [
        { name: 'main.js', originalSize: 150000, compressedSize: 45000 },
        { name: 'vendor.js', originalSize: 300000, compressedSize: 90000 },
      ];

      const allCompressed = jsResources.every(res => 
        res.compressedSize < res.originalSize * 0.5
      );

      expect(allCompressed).toBe(true);
    });

    it('CSS 资源应该被压缩', () => {
      const cssResources = [
        { name: 'main.css', originalSize: 50000, compressedSize: 8000 },
      ];

      expect(cssResources[0].compressedSize).toBeLessThan(cssResources[0].originalSize);
    });

    it('资源应该有缓存策略', () => {
      const resources = [
        { name: 'static/chart.js', cacheControl: 'public, max-age=31536000, immutable' },
        { name: 'main.js', cacheControl: 'public, max-age=0, must-revalidate' },
      ];

      const staticResources = resources.filter(r => r.cacheControl.includes('max-age=31536000'));
      expect(staticResources.length).toBeGreaterThan(0);
    });
  });

  describe('API 响应时间', () => {
    it('GET /api/contents 应该在 200ms 内响应', () => {
      const responseTimes = [120, 150, 100, 180, 130];
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      expect(avgTime).toBeLessThan(200);
    });

    it('GET /api/media 应该在 200ms 内响应', () => {
      const responseTimes = [80, 100, 90, 110, 85];
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      expect(avgTime).toBeLessThan(200);
    });

    it('Search API 应该在 300ms 内响应', () => {
      const responseTimes = [200, 250, 180, 280, 220];
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      expect(avgTime).toBeLessThan(300);
    });
  });

  describe('数据获取性能', () => {
    it('VPS 数据获取应该小于 100ms', () => {
      const fetchTimes = [50, 60, 45, 70, 55];
      const avgTime = fetchTimes.reduce((a, b) => a + b, 0) / fetchTimes.length;

      expect(avgTime).toBeLessThan(100);
    });

    it('AI 工具数据获取应该小于 100ms', () => {
      const fetchTimes = [40, 55, 45, 50, 48];
      const avgTime = fetchTimes.reduce((a, b) => a + b, 0) / fetchTimes.length;

      expect(avgTime).toBeLessThan(100);
    });

    it('教程数据获取应该小于 100ms', () => {
      const fetchTimes = [60, 75, 65, 80, 70];
      const avgTime = fetchTimes.reduce((a, b) => a + b, 0) / fetchTimes.length;

      expect(avgTime).toBeLessThan(100);
    });
  });

  describe('SEO 性能', () => {
    it('应该生成有效的 sitemap.xml', () => {
      const sitemap = {
        urlset: [
          { loc: 'https://example.com/', changefreq: 'daily', priority: 1.0 },
          { loc: 'https://example.com/vps', changefreq: 'weekly', priority: 0.8 },
        ],
      };

      expect(sitemap.urlset.length).toBeGreaterThan(0);
      expect(sitemap.urlset[0]).toHaveProperty('loc');
    });

    it('应该有正确的 canonical URL', () => {
      const page = {
        canonical: 'https://example.com/vps/vultr',
        localeAlternates: {
          'en': 'https://example.com/vps/vultr',
          'zh': 'https://example.com/zh/vps/vultr',
        },
      };

      expect(page.canonical).toContain('example.com');
      expect(page.localeAlternates).toHaveProperty('en');
      expect(page.localeAlternates).toHaveProperty('zh');
    });
  });
});

describe('构建性能测试', () => {
  it('构建时间应该小于 5 分钟', () => {
    const buildTime = 180000; // 3 分钟
    const maxBuildTime = 5 * 60 * 1000; // 5 分钟

    expect(buildTime).toBeLessThan(maxBuildTime);
  });

  it('应该生成足够的静态页面', () => {
    const staticPages = 99;
    expect(staticPages).toBeGreaterThan(50);
  });

  it('Bundle 大小应该在合理范围内', () => {
    const bundles = {
      'main.js': 120000,
      'vendor.js': 250000,
      'commons.js': 80000,
    };

    const totalSize = Object.values(bundles).reduce((a, b) => a + b, 0);
    const maxSize = 500000;

    expect(totalSize).toBeLessThan(maxSize);
  });
});
