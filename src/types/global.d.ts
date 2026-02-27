/**
 * 全局类型定义
 * 扩展 Window 接口以支持第三方库和自定义功能
 */

declare global {
  interface Window {
    // Google Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];

    // 通知系统
    addNotification?: (notification: Omit<Notification, 'id'>) => string;
    removeNotification?: (id: string) => void;
    clearAllNotifications?: () => void;

    // 其他第三方库
    clarity?: (...args: any[]) => void;
  }

  // 通知类型
  interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }

  // Content Store 类型
  interface ContentStore {
    contents: Map<string, CMSContent>;
    templates: Map<string, ContentTemplate>;
    media: MediaFile[];
    
    // 内容操作
    getContent(slug: string): CMSContent | undefined;
    getAllContents(): CMSContent[];
    createContent(content: CMSContent): CMSContent;
    updateContent(slug: string, content: Partial<CMSContent>): CMSContent | null;
    deleteContent(slug: string): boolean;
    
    // 模板操作
    getTemplate(id: string): ContentTemplate | undefined;
    getAllTemplates(): ContentTemplate[];
    createTemplate(template: ContentTemplate): ContentTemplate;
    updateTemplate(id: string, template: Partial<ContentTemplate>): ContentTemplate | null;
    deleteTemplate(id: string): boolean;
    
    // 媒体操作
    getMedia(id: string): MediaFile | undefined;
    getAllMedia(): MediaFile[];
    createMedia(media: MediaFile): MediaFile;
    deleteMedia(id: string): boolean;
  }

  // CMS 内容类型
  interface CMSContent {
    id: string;
    slug: string;
    type: 'tutorial' | 'vps' | 'ai-tool' | 'comparison' | 'resource' | 'article';
    title: {
      en: string;
      zh: string;
    };
    description: {
      en: string;
      zh: string;
    };
    content: {
      en: string;
      zh: string;
    };
    seo: {
      title: { en: string; zh: string };
      description: { en: string; zh: string };
      keywords: { en: string[]; zh: string[] };
    };
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    author?: string;
    tags?: string[];
    featuredImage?: string;
  }

  // 内容模板类型
  interface ContentTemplate {
    id: string;
    name: string;
    description: string;
    type: CMSContent['type'];
    sections: TemplateSection[];
    variables: TemplateVariable[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface TemplateSection {
    id: string;
    name: string;
    type: 'text' | 'markdown' | 'image' | 'code' | 'list' | 'table';
    required: boolean;
    placeholder?: string;
  }

  interface TemplateVariable {
    key: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
    defaultValue?: string | number | boolean | string[];
    options?: { label: string; value: string }[];
    required: boolean;
  }

  // 媒体文件类型
  interface MediaFile {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    alt?: string;
    caption?: string;
    uploadedBy?: string;
    uploadedAt: Date;
  }

  // 翻译类型
  type Locale = 'en' | 'zh';
  
  interface Translations {
    [key: string]: {
      en: string;
      zh: string;
    };
  }
}

export {};
