// SEO存储（使用Supabase数据库）

import { createClient } from '@supabase/supabase-js';

// SEO 类型定义
interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: string;
  cpc?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SEORule {
  id: string;
  pageType: string;
  titleTemplate: string;
  descriptionTemplate: string;
  h1Template: string;
  h2Templates: string[];
  requiredSections: string[];
  suggestedLength: {
    title: { min: number; max: number };
    description: { min: number; max: number };
    content: { min: number; max: number };
  };
}

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found. Using in-memory storage as fallback.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// SEO存储
class SEOStore {
  // 内存存储作为备用
  private keywords: Map<string, Keyword> = new Map();
  private seoRules: Map<string, SEORule> = new Map();
  private internalLinks: Map<string, any> = new Map();

  constructor() {
    // 初始化示例数据（仅当使用内存存储时）
    if (!supabase) {
      this.initSampleData();
    }
  }

  private initSampleData() {
    // 示例关键词
    const keywords: Keyword[] = [
      {
        id: 'keyword-1',
        keyword: 'best vps hosting',
        searchVolume: 10000,
        difficulty: 70,
        intent: 'commercial',
        cpc: 2.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'keyword-2',
        keyword: 'how to set up vps',
        searchVolume: 5000,
        difficulty: 40,
        intent: 'informational',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    keywords.forEach((keyword) => this.keywords.set(keyword.id, keyword));

    // 示例SEO规则
    const rules: SEORule[] = [
      {
        id: 'rule-1',
        pageType: 'recommendation',
        titleTemplate: '{{keyword}} - Top {{count}} Recommendations',
        descriptionTemplate: 'Find the best {{keyword}} for your needs. Our expert recommendations help you make the right choice.',
        h1Template: 'Best {{keyword}} in {{year}}',
        h2Templates: [
          'Top {{count}} {{keyword}}',
          'How We Selected These {{keyword}}',
          '{{keyword}} Buying Guide',
          'Frequently Asked Questions',
        ],
        requiredSections: ['introduction', 'recommendations', 'buying guide', 'faq'],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 1000, max: 3000 },
        },
      },
      {
        id: 'rule-2',
        pageType: 'review',
        titleTemplate: '{{product}} Review - Is It Worth It?',
        descriptionTemplate: 'A detailed review of {{product}}. Learn about its features, performance, and whether it\'s the right choice for you.',
        h1Template: '{{product}} Review: {{rating}}/10',
        h2Templates: [
          'What is {{product}}?',
          '{{product}} Features',
          '{{product}} Performance',
          '{{product}} Pricing',
          'Final Verdict',
        ],
        requiredSections: ['introduction', 'features', 'performance', 'pricing', 'conclusion'],
        suggestedLength: {
          title: { min: 50, max: 60 },
          description: { min: 150, max: 160 },
          content: { min: 1500, max: 4000 },
        },
      },
    ];

    rules.forEach((rule) => this.seoRules.set(rule.id, rule));
  }

  // ========== 关键词管理 ==========

  async getAllKeywords(): Promise<Keyword[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('search_volume', { ascending: false });
      
      if (error) {
        console.error('Error fetching keywords:', error);
        return [];
      }
      return data as Keyword[];
    }
    return Array.from(this.keywords.values());
  }

  async getKeywordsByIntent(intent: string): Promise<Keyword[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('intent', intent)
        .order('search_volume', { ascending: false });
      
      if (error) {
        console.error('Error fetching keywords by intent:', error);
        return [];
      }
      return data as Keyword[];
    }
    return Array.from(this.keywords.values()).filter((k) => k.intent === intent);
  }

  async getKeywordById(id: string): Promise<Keyword | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching keyword by id:', error);
        return null;
      }
      return data as Keyword;
    }
    return this.keywords.get(id) || null;
  }

  async createKeyword(keyword: Omit<Keyword, 'id' | 'createdAt' | 'updatedAt'>): Promise<Keyword> {
    const newKeyword: Keyword = {
      ...keyword,
      id: `keyword-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('keywords')
        .insert(newKeyword)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating keyword:', error);
        // 失败时回退到内存存储
        this.keywords.set(newKeyword.id, newKeyword);
        return newKeyword;
      }
      return data as Keyword;
    }

    this.keywords.set(newKeyword.id, newKeyword);
    return newKeyword;
  }

  async updateKeyword(id: string, updates: Partial<Keyword>): Promise<Keyword | null> {
    const oldKeyword = await this.getKeywordById(id);
    if (!oldKeyword) return null;

    if (supabase) {
      const { data, error } = await supabase
        .from('keywords')
        .update({ ...updates, updatedAt: new Date() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating keyword:', error);
        return null;
      }
      return data as Keyword;
    }

    const updated = {
      ...oldKeyword,
      ...updates,
      updatedAt: new Date(),
    };
    this.keywords.set(id, updated);
    return updated;
  }

  async deleteKeyword(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting keyword:', error);
        return false;
      }
      return true;
    }

    return this.keywords.delete(id);
  }

  // ========== SEO规则管理 ==========

  async getAllSEORules(): Promise<SEORule[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('seo_rules')
        .select('*');
      
      if (error) {
        console.error('Error fetching SEO rules:', error);
        return [];
      }
      return data as SEORule[];
    }
    return Array.from(this.seoRules.values());
  }

  async getSEORuleByPageType(pageType: string): Promise<SEORule | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('seo_rules')
        .select('*')
        .eq('page_type', pageType)
        .single();
      
      if (error) {
        console.error('Error fetching SEO rule by page type:', error);
        return null;
      }
      return data as SEORule;
    }
    return Array.from(this.seoRules.values()).find((rule) => rule.pageType === pageType) || null;
  }

  async createSEORule(rule: Omit<SEORule, 'id'>): Promise<SEORule> {
    const newRule: SEORule = {
      ...rule,
      id: `rule-${Date.now()}`,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('seo_rules')
        .insert(newRule)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating SEO rule:', error);
        // 失败时回退到内存存储
        this.seoRules.set(newRule.id, newRule);
        return newRule;
      }
      return data as SEORule;
    }

    this.seoRules.set(newRule.id, newRule);
    return newRule;
  }

  async updateSEORule(id: string, updates: Partial<SEORule>): Promise<SEORule | null> {
    const oldRule = await this.getSEORuleById(id);
    if (!oldRule) return null;

    if (supabase) {
      const { data, error } = await supabase
        .from('seo_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating SEO rule:', error);
        return null;
      }
      return data as SEORule;
    }

    const updated = { ...oldRule, ...updates };
    this.seoRules.set(id, updated);
    return updated;
  }

  async getSEORuleById(id: string): Promise<SEORule | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('seo_rules')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching SEO rule by id:', error);
        return null;
      }
      return data as SEORule;
    }
    return this.seoRules.get(id) || null;
  }

  async deleteSEORule(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('seo_rules')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting SEO rule:', error);
        return false;
      }
      return true;
    }

    return this.seoRules.delete(id);
  }

  // ========== 内链管理 ==========

  async getAllInternalLinks(): Promise<any[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('internal_links')
        .select('*');
      
      if (error) {
        console.error('Error fetching internal links:', error);
        return [];
      }
      return data;
    }
    return Array.from(this.internalLinks.values());
  }

  async getInternalLinksFromPage(pageId: string): Promise<any[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('internal_links')
        .select('*')
        .eq('from_page_id', pageId);
      
      if (error) {
        console.error('Error fetching internal links from page:', error);
        return [];
      }
      return data;
    }
    return Array.from(this.internalLinks.values()).filter((link) => link.fromPageId === pageId);
  }

  async createInternalLink(link: {
    fromPageId: string;
    toPageId: string;
    anchorText: string;
    linkType: 'manual' | 'auto';
    priority: number;
  }): Promise<any> {
    const newLink = {
      ...link,
      id: `link-${Date.now()}`,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('internal_links')
        .insert({
          id: newLink.id,
          from_page_id: newLink.fromPageId,
          to_page_id: newLink.toPageId,
          anchor_text: newLink.anchorText,
          link_type: newLink.linkType,
          priority: newLink.priority,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating internal link:', error);
        // 失败时回退到内存存储
        this.internalLinks.set(newLink.id, newLink);
        return newLink;
      }
      return data;
    }

    this.internalLinks.set(newLink.id, newLink);
    return newLink;
  }

  async deleteInternalLink(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('internal_links')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting internal link:', error);
        return false;
      }
      return true;
    }

    return this.internalLinks.delete(id);
  }

  // ========== SEO分析 ==========

  async getSEOAuditStats() {
    if (supabase) {
      // 这里应该使用数据库查询来获取SEO审计统计数据
      // 为了简单起见，我们先返回一些基本统计
      return {
        totalKeywords: (await this.getAllKeywords()).length,
        totalRules: (await this.getAllSEORules()).length,
        totalInternalLinks: (await this.getAllInternalLinks()).length,
      };
    }

    return {
      totalKeywords: this.keywords.size,
      totalRules: this.seoRules.size,
      totalInternalLinks: this.internalLinks.size,
    };
  }
}

// 导出单例实例
export const seoStore = new SEOStore();