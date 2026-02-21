// 本地内容存储（模拟数据库）
// 在生产环境中，应该替换为真实的数据库（CloudBase/Supabase/MySQL等）

import {
  CMSContent,
  MediaFile,
  Category,
  Tag,
  ContentStatus,
} from "./cms-types";

// 内容存储
class ContentStore {
  private contents: Map<string, CMSContent> = new Map();
  private media: Map<string, MediaFile> = new Map();
  private categories: Map<string, Category> = new Map();
  private tags: Map<string, Tag> = new Map();

  constructor() {
    // 初始化示例数据
    this.initSampleData();
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
    return Array.from(this.contents.values());
  }

  async getContentsByType(type: CMSContent["type"]): Promise<CMSContent[]> {
    return Array.from(this.contents.values()).filter((c) => c.type === type);
  }

  async getContentsByStatus(status: ContentStatus): Promise<CMSContent[]> {
    return Array.from(this.contents.values()).filter(
      (c) => c.status === status,
    );
  }

  async getContentById(id: string): Promise<CMSContent | null> {
    return this.contents.get(id) || null;
  }

  async getContentBySlug(slug: string): Promise<CMSContent | null> {
    return (
      Array.from(this.contents.values()).find((c) => c.slug === slug) || null
    );
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
    this.contents.set(newContent.id, newContent);
    return newContent;
  }

  async updateContent(
    id: string,
    updates: Partial<CMSContent>,
  ): Promise<CMSContent | null> {
    const content = this.contents.get(id);
    if (!content) return null;

    const updated = {
      ...content,
      ...updates,
      updatedAt: new Date(),
    };
    this.contents.set(id, updated);
    return updated;
  }

  async deleteContent(id: string): Promise<boolean> {
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
    return Array.from(this.media.values());
  }

  async getMediaById(id: string): Promise<MediaFile | null> {
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
    this.media.set(newMedia.id, newMedia);
    return newMedia;
  }

  async updateMedia(
    id: string,
    updates: Partial<MediaFile>,
  ): Promise<MediaFile | null> {
    const media = this.media.get(id);
    if (!media) return null;

    const updated = { ...media, ...updates };
    this.media.set(id, updated);
    return updated;
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.media.delete(id);
  }

  // ========== 类别管理 ==========

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort(
      (a, b) => a.order - b.order,
    );
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categories.get(id) || null;
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>,
  ): Promise<Category | null> {
    const category = this.categories.get(id);
    if (!category) return null;

    const updated = { ...category, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // ========== 标签管理 ==========

  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values()).sort((a, b) => b.count - a.count);
  }

  async getTagById(id: string): Promise<Tag | null> {
    return this.tags.get(id) || null;
  }

  async createTag(tag: Omit<Tag, "id" | "count">): Promise<Tag> {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
      count: 0,
    };
    this.tags.set(newTag.id, newTag);
    return newTag;
  }

  async updateTag(id: string, updates: Partial<Tag>): Promise<Tag | null> {
    const tag = this.tags.get(id);
    if (!tag) return null;

    const updated = { ...tag, ...updates };
    this.tags.set(id, updated);
    return updated;
  }

  async deleteTag(id: string): Promise<boolean> {
    return this.tags.delete(id);
  }

  // ========== 统计 ==========

  async getStats() {
    const contents = Array.from(this.contents.values());
    const media = Array.from(this.media.values());

    return {
      totalContents: contents.length,
      publishedContents: contents.filter((c) => c.status === "published")
        .length,
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
