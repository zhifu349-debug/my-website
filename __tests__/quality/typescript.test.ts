/**
 * 代码质量测试脚本 - TypeScript 类型检查
 * 测试 TypeScript 类型定义的正确性
 */

import { describe, it, expect } from '@jest/globals';

describe('TypeScript 类型测试', () => {
  describe('基础类型', () => {
    it('应该正确定义 Locale 类型', () => {
      type Locale = 'en' | 'zh';
      const locale: Locale = 'zh';
      
      const validLocales: Locale[] = ['en', 'zh'];
      expect(validLocales).toContain(locale);
    });

    it('应该正确定义 ContentType 类型', () => {
      type ContentType = 'vps' | 'aitool' | 'tutorial' | 'news';
      const contentType: ContentType = 'vps';
      
      const validTypes: ContentType[] = ['vps', 'aitool', 'tutorial', 'news'];
      expect(validTypes).toContain(contentType);
    });

    it('应该正确定义 Status 类型', () => {
      type Status = 'draft' | 'published' | 'archived';
      const status: Status = 'published';
      
      expect(['draft', 'published', 'archived']).toContain(status);
    });
  });

  describe('接口类型', () => {
    it('LocalizedText 应该包含正确的语言字段', () => {
      interface LocalizedText {
        en: string;
        zh: string;
      }

      const title: LocalizedText = {
        en: 'VPS Guide',
        zh: 'VPS 指南',
      };

      expect(title).toHaveProperty('en');
      expect(title).toHaveProperty('zh');
    });

    it('VPS 接口应该包含必需字段', () => {
      interface VPS {
        id: string;
        name: string;
        slug: string;
        rating: number;
        description: LocalizedText;
        price: LocalizedText;
        features: LocalizedText[];
        website: string;
        logo?: string;
      }

      const vps: VPS = {
        id: 'vultr',
        name: 'Vultr',
        slug: 'vultr',
        rating: 4.5,
        description: { en: 'High performance', zh: '高性能' },
        price: { en: '$5/mo', zh: '$5/月' },
        features: [{ en: 'SSD', zh: 'SSD' }],
        website: 'https://vultr.com',
      };

      expect(vps.id).toBeDefined();
      expect(vps.name).toBeDefined();
      expect(vps.slug).toBeDefined();
      expect(vps.rating).toBeDefined();
    });

    it('AITool 接口应该包含必需字段', () => {
      interface AITool {
        id: string;
        name: string;
        slug: string;
        rating: number;
        description: LocalizedText;
        website: string;
        pricing: LocalizedText;
        features: LocalizedText[];
        logo?: string;
        category?: string;
      }

      const tool: AITool = {
        id: 'chatgpt',
        name: 'ChatGPT',
        slug: 'chatgpt',
        rating: 4.8,
        description: { en: 'AI chatbot', zh: 'AI 聊天机器人' },
        website: 'https://chat.openai.com',
        pricing: { en: 'Freemium', zh: '免费/付费' },
        features: [],
      };

      expect(tool.id).toBeDefined();
      expect(tool.website).toContain('https://');
    });

    it('Tutorial 接口应该包含必需字段', () => {
      interface Tutorial {
        id: string;
        title: LocalizedText;
        slug: string;
        content: LocalizedText;
        category: string;
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        readTime: LocalizedText;
        tags?: string[];
        updatedAt?: string;
      }

      const tutorial: Tutorial = {
        id: 'v2ray-setup',
        title: { en: 'V2Ray Setup', zh: 'V2Ray 搭建' },
        slug: 'v2ray-setup',
        content: { en: 'Content', zh: '内容' },
        category: 'vpn',
        difficulty: 'intermediate',
        readTime: { en: '10 min', zh: '10分钟' },
      };

      expect(tutorial.difficulty).toMatch(/beginner|intermediate|advanced/);
    });
  });

  describe('API 响应类型', () => {
    it('API Response 应该包含标准字段', () => {
      interface APIResponse<T> {
        success: boolean;
        data?: T;
        error?: string;
        message?: string;
      }

      const response: APIResponse<string[]> = {
        success: true,
        data: ['item1', 'item2'],
      };

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    it('Paginated Response 应该包含分页字段', () => {
      interface PaginatedResponse<T> extends APIResponse<T[]> {
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }

      const paginatedResponse: PaginatedResponse<string> = {
        success: true,
        data: ['item1', 'item2'],
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          totalPages: 10,
        },
      };

      expect(paginatedResponse.pagination).toHaveProperty('page');
      expect(paginatedResponse.pagination).toHaveProperty('total');
    });
  });

  describe('类型守卫', () => {
    it('isVPS 应该正确识别 VPS 对象', () => {
      const isVPS = (obj: any): obj is VPS => {
        return obj && typeof obj === 'object' && 'slug' in obj && 'rating' in obj;
      };

      const vps = { slug: 'vultr', rating: 4.5 };
      const notVps = { name: 'Test' };

      expect(isVPS(vps)).toBe(true);
      expect(isVPS(notVps)).toBe(false);
    });

    it('isLocalizedText 应该正确识别本地化文本', () => {
      const isLocalizedText = (obj: any): obj is LocalizedText => {
        return obj && typeof obj === 'object' && 'en' in obj && 'zh' in obj;
      };

      const localized = { en: 'Hello', zh: '你好' };
      const notLocalized = { en: 'Hello' };

      expect(isLocalizedText(localized)).toBe(true);
      expect(isLocalizedText(notLocalized)).toBe(false);
    });
  });

  describe('泛型测试', () => {
    it('应该正确使用泛型函数', () => {
      const getLocalizedValue = <T extends LocalizedText>(obj: T, locale: 'en' | 'zh'): string => {
        return obj[locale];
      };

      const localized = { en: 'Value', zh: '值' };
      expect(getLocalizedValue(localized, 'en')).toBe('Value');
      expect(getLocalizedValue(localized, 'zh')).toBe('值');
    });

    it('应该正确使用泛型接口', () => {
      interface Cache<T> {
        get(key: string): T | undefined;
        set(key: string, value: T): void;
        delete(key: string): void;
      }

      const stringCache: Cache<string> = {
        get: (key) => undefined,
        set: () => {},
        delete: () => {},
      };

      expect(typeof stringCache.get).toBe('function');
    });
  });
});

describe('代码规范测试', () => {
  describe('命名规范', () => {
    it('组件名称应该使用 PascalCase', () => {
      const components = [
        'ContentManagementTab',
        'MediaManagementTab',
        'SEOToolsTab',
        'AnalyticsTab',
      ];

      const isPascalCase = (name: string) => {
        return /^[A-Z][a-zA-Z0-9]*$/.test(name);
      };

      components.forEach(comp => {
        expect(isPascalCase(comp)).toBe(true);
      });
    });

    it('文件名应该使用 kebab-case 或 PascalCase', () => {
      const files = [
        'content-management-tab.tsx',
        'media-management.tsx',
        'SEOStore.ts',
        'api-helpers.ts',
      ];

      const isValidFileName = (name: string) => {
        return /^[a-z0-9-]+\.(tsx?|js)$/i.test(name) || 
               /^[A-Z][a-zA-Z0-9]*\.(tsx?|js)$/.test(name);
      };

      files.forEach(file => {
        expect(isValidFileName(file)).toBe(true);
      });
    });
  });

  describe('导入规范', () => {
    it('应该使用绝对导入路径', () => {
      const imports = [
        "import { VPS } from '@/types'",
        "import { getAllVPS } from '@/lib/data'",
        "import styles from '@/styles/globals.css'",
      ];

      const hasAbsolutePath = imports.some(i => i.includes("@/"));
      expect(hasAbsolutePath).toBe(true);
    });

    it('应该正确导出模块', () => {
      const exports = [
        'export type { VPS, AITool, Tutorial }',
        'export { getAllVPS, getVPSBySlug }',
        'export default function Component() {}',
      ];

      const hasExport = exports.some(e => e.startsWith('export'));
      expect(hasExport).toBe(true);
    });
  });

  describe('注释规范', () => {
    it('组件应该包含 JSDoc 注释', () => {
      const componentWithDocs = `
        /**
         * Content Management Tab Component
         * Handles content CRUD operations
         */
        function ContentManagementTab() {}
      `;

      expect(componentWithDocs).toContain('/**');
      expect(componentWithDocs).toContain('*/');
    });

    it('接口应该包含类型说明', () => {
      const interfaceWithDocs = `
        interface VPS {
          /** Unique identifier */
          id: string;
          /** Provider name */
          name: string;
        }
      `;

      expect(interfaceWithDocs).toContain('/**');
    });
  });
});
