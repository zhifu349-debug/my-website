// 内容存储（使用Supabase数据库）

import {
  CMSContent,
  MediaFile,
  Category,
  Tag,
  ContentStatus,
  ContentVersion,
} from "./cms-types";
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found. Using in-memory storage as fallback.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// 内容存储
class ContentStore {
  // 内存存储作为备用
  private contents: Map<string, CMSContent> = new Map();
  private versions: Map<string, ContentVersion[]> = new Map();
  private media: Map<string, MediaFile> = new Map();
  private categories: Map<string, Category> = new Map();
  private tags: Map<string, Tag> = new Map();

  constructor() {
    // 初始化示例数据（仅当使用内存存储时）
    if (!supabase) {
      this.initSampleData();
    }
  }

  private initSampleData() {
    // 示例类别
    const categories: Category[] = [
      {
        id: "cat-1",
        name: { en: "VPS Hosting", zh: "VPS主机" },
        slug: "vps",
        description: {
          en: "VPS hosting reviews and comparisons",
          zh: "VPS主机评测和对比",
        },
        order: 1,
        icon: "🚀",
        gradient: "from-blue-500 to-blue-600",
      },
      {
        id: "cat-2",
        name: { en: "AI Tools", zh: "AI工具" },
        slug: "ai-tools",
        description: { en: "AI software and tools", zh: "AI软件和工具" },
        order: 2,
        icon: "🤖",
        gradient: "from-green-500 to-green-600",
      },
      {
        id: "cat-3",
        name: { en: "Tutorials", zh: "教程" },
        slug: "tutorials",
        description: {
          en: "Technical tutorials and guides",
          zh: "技术教程和指南",
        },
        order: 3,
        icon: "📚",
        gradient: "from-purple-500 to-purple-600",
      },
    ];

    categories.forEach((cat) => this.categories.set(cat.id, cat));

    // 示例标签
    const tags: Tag[] = [
      { id: "tag-1", name: "VPS", slug: "vps", count: 5 },
      { id: "tag-2", name: "Cloud", slug: "cloud", count: 3 },
      { id: "tag-3", name: "AI", slug: "ai", count: 4 },
      { id: "tag-4", name: "Tutorial", slug: "tutorial", count: 6 },
    ];

    tags.forEach((tag) => this.tags.set(tag.id, tag));
  }

  // ========== 内容管理 ==========

  async getAllContents(): Promise<CMSContent[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching contents:', error);
        return [];
      }
      return data as CMSContent[];
    }
    return Array.from(this.contents.values());
  }

  async getContentsByType(type: CMSContent["type"]): Promise<CMSContent[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('type', type)
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching contents by type:', error);
        return [];
      }
      return data as CMSContent[];
    }
    return Array.from(this.contents.values()).filter((c) => c.type === type);
  }

  async getContentsByStatus(status: ContentStatus): Promise<CMSContent[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('status', status)
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching contents by status:', error);
        return [];
      }
      return data as CMSContent[];
    }
    return Array.from(this.contents.values()).filter((c) => c.status === status);
  }

  async getContentById(id: string): Promise<CMSContent | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching content by id:', error);
        return null;
      }
      return data as CMSContent;
    }
    return this.contents.get(id) || null;
  }

  async getContentBySlug(slug: string): Promise<CMSContent | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error('Error fetching content by slug:', error);
        return null;
      }
      return data as CMSContent;
    }
    return Array.from(this.contents.values()).find((c) => c.slug === slug) || null;
  }

  async createContent(
    content: Omit<CMSContent, "id" | "createdAt" | "updatedAt">,
  ): Promise<CMSContent> {
    const newContent: CMSContent = {
      ...content,
      id: `content-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .insert(newContent)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating content:', error);
        // 失败时回退到内存存储
        this.contents.set(newContent.id, newContent);
        return newContent;
      }
      return data as CMSContent;
    }

    this.contents.set(newContent.id, newContent);
    return newContent;
  }

  async updateContent(
    id: string,
    updates: Partial<CMSContent>,
    updatedBy: string = 'system',
    comment?: string,
  ): Promise<CMSContent | null> {
    const oldContent = await this.getContentById(id);
    if (!oldContent) return null;

    // 创建版本记录
    await this.createVersion(oldContent, updatedBy, comment);

    if (supabase) {
      const { data, error } = await supabase
        .from('contents')
        .update({ ...updates, updatedAt: new Date() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating content:', error);
        return null;
      }
      return data as CMSContent;
    }

    const updated = {
      ...oldContent,
      ...updates,
      updatedAt: new Date(),
    };
    this.contents.set(id, updated);
    return updated;
  }

  // 创建版本记录
  private async createVersion(
    content: CMSContent,
    updatedBy: string,
    comment?: string,
  ): Promise<ContentVersion> {
    // 获取当前最大版本号
    const versions = await this.getContentVersions(content.id);
    const nextVersion = versions.length > 0 ? Math.max(...versions.map(v => v.version)) + 1 : 1;

    const version: ContentVersion = {
      id: `version-${Date.now()}`,
      contentId: content.id,
      version: nextVersion,
      title: content.title,
      slug: content.slug,
      status: content.status,
      seo: content.seo,
      content: content.content,
      featuredImage: content.featuredImage,
      gallery: content.gallery,
      locale: content.locale,
      author: content.author,
      publishedAt: content.publishedAt,
      createdAt: new Date(),
      updatedBy,
      comment,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('content_versions')
        .insert(version)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating version:', error);
        // 失败时回退到内存存储
        const contentVersions = this.versions.get(content.id) || [];
        contentVersions.push(version);
        this.versions.set(content.id, contentVersions);
        return version;
      }
      return data as ContentVersion;
    }

    const contentVersions = this.versions.get(content.id) || [];
    contentVersions.push(version);
    this.versions.set(content.id, contentVersions);
    return version;
  }

  // 获取内容的所有版本
  async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('contentId', contentId)
        .order('version', { ascending: false });
      
      if (error) {
        console.error('Error fetching content versions:', error);
        return [];
      }
      return data as ContentVersion[];
    }
    return this.versions.get(contentId) || [];
  }

  // 获取指定版本
  async getContentVersionById(versionId: string): Promise<ContentVersion | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (error) {
        console.error('Error fetching content version:', error);
        return null;
      }
      return data as ContentVersion;
    }
    
    // 在内存存储中查找
    for (const versions of this.versions.values()) {
      const version = versions.find(v => v.id === versionId);
      if (version) return version;
    }
    return null;
  }

  // 版本回滚
  async rollbackToVersion(
    contentId: string,
    versionId: string,
    updatedBy: string = 'system',
  ): Promise<CMSContent | null> {
    const version = await this.getContentVersionById(versionId);
    if (!version || version.contentId !== contentId) {
      return null;
    }

    // 回滚内容
    const updates: Partial<CMSContent> = {
      title: version.title,
      slug: version.slug,
      status: version.status,
      seo: version.seo,
      content: version.content,
      featuredImage: version.featuredImage,
      gallery: version.gallery,
      locale: version.locale,
      author: version.author,
      publishedAt: version.publishedAt,
    };

    return this.updateContent(contentId, updates, updatedBy, `Rolled back to version ${version.version}`);
  }

  async deleteContent(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting content:', error);
        return false;
      }
      return true;
    }

    return this.contents.delete(id);
  }

  async publishContent(id: string): Promise<CMSContent | null> {
    return this.updateContent(id, {
      status: "published",
      publishedAt: new Date(),
    });
  }

  // ========== 媒体管理 ==========

  async getAllMedia(): Promise<MediaFile[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('uploadedAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching media:', error);
        return [];
      }
      return data as MediaFile[];
    }
    return Array.from(this.media.values());
  }

  async getMediaById(id: string): Promise<MediaFile | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching media by id:', error);
        return null;
      }
      return data as MediaFile;
    }
    return this.media.get(id) || null;
  }

  async createMedia(
    media: Omit<MediaFile, "id" | "uploadedAt">,
  ): Promise<MediaFile> {
    const newMedia: MediaFile = {
      ...media,
      id: `media-${Date.now()}`,
      uploadedAt: new Date(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('media')
        .insert(newMedia)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating media:', error);
        // 失败时回退到内存存储
        this.media.set(newMedia.id, newMedia);
        return newMedia;
      }
      return data as MediaFile;
    }

    this.media.set(newMedia.id, newMedia);
    return newMedia;
  }

  async updateMedia(
    id: string,
    updates: Partial<MediaFile>,
  ): Promise<MediaFile | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating media:', error);
        return null;
      }
      return data as MediaFile;
    }

    const media = this.media.get(id);
    if (!media) return null;

    const updated = { ...media, ...updates };
    this.media.set(id, updated);
    return updated;
  }

  async deleteMedia(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting media:', error);
        return false;
      }
      return true;
    }

    return this.media.delete(id);
  }

  // ========== 类别管理 ==========

  async getAllCategories(): Promise<Category[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      return data as Category[];
    }
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching category by id:', error);
        return null;
      }
      return data as Category;
    }
    return this.categories.get(id) || null;
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .insert(newCategory)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating category:', error);
        // 失败时回退到内存存储
        this.categories.set(newCategory.id, newCategory);
        return newCategory;
      }
      return data as Category;
    }

    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>,
  ): Promise<Category | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating category:', error);
        return null;
      }
      return data as Category;
    }

    const category = this.categories.get(id);
    if (!category) return null;

    const updated = { ...category, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting category:', error);
        return false;
      }
      return true;
    }

    return this.categories.delete(id);
  }

  // ========== 标签管理 ==========

  async getAllTags(): Promise<Tag[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('count', { ascending: false });
      
      if (error) {
        console.error('Error fetching tags:', error);
        return [];
      }
      return data as Tag[];
    }
    return Array.from(this.tags.values()).sort((a, b) => b.count - a.count);
  }

  async getTagById(id: string): Promise<Tag | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching tag by id:', error);
        return null;
      }
      return data as Tag;
    }
    return this.tags.get(id) || null;
  }

  async createTag(tag: Omit<Tag, "id" | "count">): Promise<Tag> {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
      count: 0,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('tags')
        .insert(newTag)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating tag:', error);
        // 失败时回退到内存存储
        this.tags.set(newTag.id, newTag);
        return newTag;
      }
      return data as Tag;
    }

    this.tags.set(newTag.id, newTag);
    return newTag;
  }

  async updateTag(id: string, updates: Partial<Tag>): Promise<Tag | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating tag:', error);
        return null;
      }
      return data as Tag;
    }

    const tag = this.tags.get(id);
    if (!tag) return null;

    const updated = { ...tag, ...updates };
    this.tags.set(id, updated);
    return updated;
  }

  async deleteTag(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting tag:', error);
        return false;
      }
      return true;
    }

    return this.tags.delete(id);
  }

  // ========== 统计 ==========

  async getStats() {
    if (supabase) {
      // 这里应该使用数据库查询来获取统计数据
      // 为了简单起见，我们先获取所有数据然后在客户端计算
      const contents = await this.getAllContents();
      const media = await this.getAllMedia();

      return {
        totalContents: contents.length,
        publishedContents: contents.filter((c) => c.status === "published").length,
        draftContents: contents.filter((c) => c.status === "draft").length,
        totalMedia: media.length,
        imagesCount: media.filter((m) => m.type === "image").length,
        videosCount: media.filter((m) => m.type === "video").length,
        totalStorage: media.reduce((sum, m) => sum + m.size, 0),
      };
    }

    const contents = Array.from(this.contents.values());
    const media = Array.from(this.media.values());

    return {
      totalContents: contents.length,
      publishedContents: contents.filter((c) => c.status === "published").length,
      draftContents: contents.filter((c) => c.status === "draft").length,
      totalMedia: media.length,
      imagesCount: media.filter((m) => m.type === "image").length,
      videosCount: media.filter((m) => m.type === "video").length,
      totalStorage: media.reduce((sum, m) => sum + m.size, 0),
    };
  }
}

// 导出单例实例
export const contentStore = new ContentStore();
