// 模板渲染引擎

import { Template, TemplateInstance, CMSContent } from './cms-types';
import { contentStore } from './content-store';

// 模板渲染引擎类
class TemplateEngine {
  // 渲染模板为内容
  async renderTemplate(templateId: string, variables: Record<string, any>): Promise<Partial<CMSContent>> {
    const template = await contentStore.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    // 验证必填变量
    const missingVariables = template.variables
      .filter(v => v.required)
      .filter(v => !variables.hasOwnProperty(v.name));

    if (missingVariables.length > 0) {
      throw new Error(`Missing required variables: ${missingVariables.map(v => v.name).join(', ')}`);
    }

    // 合并默认值和提供的变量
    const mergedVariables = this.mergeVariables(template, variables);

    // 创建内容结构
    const content = this.generateContentFromTemplate(template, mergedVariables);

    return content;
  }

  // 合并默认值和提供的变量
  private mergeVariables(template: Template, providedVariables: Record<string, any>): Record<string, any> {
    const merged: Record<string, any> = {};

    template.variables.forEach(variable => {
      merged[variable.name] = providedVariables.hasOwnProperty(variable.name)
        ? providedVariables[variable.name]
        : variable.defaultValue;
    });

    return merged;
  }

  // 从模板生成内容
  private generateContentFromTemplate(template: Template, variables: Record<string, any>): Partial<CMSContent> {
    // 生成标题（使用变量替换）
    const title = {
      en: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'title')?.content?.en || '', variables),
      zh: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'title')?.content?.zh || '', variables),
    };

    // 生成slug（使用标题的英文版本）
    const slug = this.generateSlug(title.en);

    // 生成SEO内容
    const seo = {
      title: {
        en: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'seo-title')?.content?.en || title.en, variables),
        zh: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'seo-title')?.content?.zh || title.zh, variables),
      },
      description: {
        en: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'seo-description')?.content?.en || '', variables),
        zh: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'seo-description')?.content?.zh || '', variables),
      },
      keywords: {
        en: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'seo-keywords')?.content?.en || '', variables),
        zh: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'seo-keywords')?.content?.zh || '', variables),
      },
      canonical: '',
    };

    // 生成页面内容
    const content = {
      en: {
        intro: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'intro')?.content?.en || '', variables),
        sections: template.structure?.sections
          ?.filter(s => s.type !== 'title' && s.type !== 'seo-title' && s.type !== 'seo-description' && s.type !== 'seo-keywords')
          ?.map(section => ({
            id: section.id,
            type: section.type as "text" | "image" | "video" | "comparison-table" | "list" | "quote",
            content: typeof section.content === 'string'
              ? this.replaceVariables(section.content, variables)
              : typeof section.content === 'object' && section.content !== null
              ? {
                  en: this.replaceVariables(section.content.en || '', variables),
                  zh: this.replaceVariables(section.content.zh || '', variables),
                }
              : section.content,
            order: section.order,
          })) || [],
      },
      zh: {
        intro: this.replaceVariables(template.structure?.sections?.find(s => s.type === 'intro')?.content?.zh || '', variables),
        sections: template.structure?.sections
          ?.filter(s => s.type !== 'title' && s.type !== 'seo-title' && s.type !== 'seo-description' && s.type !== 'seo-keywords')
          ?.map(section => ({
            id: section.id,
            type: section.type as "text" | "image" | "video" | "comparison-table" | "list" | "quote",
            content: typeof section.content === 'string'
              ? this.replaceVariables(section.content, variables)
              : typeof section.content === 'object' && section.content !== null
              ? {
                  en: this.replaceVariables(section.content.en || '', variables),
                  zh: this.replaceVariables(section.content.zh || '', variables),
                }
              : section.content,
            order: section.order,
          })) || [],
      },
    };

    return {
      type: template.type,
      title,
      slug,
      seo,
      content,
      status: 'draft',
      locale: 'en', // 默认语言，可以根据需要调整
      author: 'system',
    };
  }

  // 替换文本中的变量
  private replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, variableName) => {
      return variables[variableName] !== undefined ? variables[variableName] : match;
    });
  }

  // 生成slug
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  // 从模板实例创建内容
  async createContentFromTemplateInstance(instanceId: string): Promise<CMSContent> {
    const instance = await contentStore.getTemplateInstanceById(instanceId);
    if (!instance) {
      throw new Error(`Template instance with id ${instanceId} not found`);
    }

    // 渲染模板
    const contentData = await this.renderTemplate(instance.templateId, instance.variables);

    // 创建内容
    const content = await contentStore.createContent(contentData as Omit<CMSContent, 'id' | 'createdAt' | 'updatedAt'>);

    // 更新模板实例，关联内容ID
    await contentStore.updateTemplateInstance(instanceId, { contentId: content.id });

    return content;
  }

  // 预览模板渲染结果
  async previewTemplate(templateId: string, variables: Record<string, any>): Promise<Partial<CMSContent>> {
    return this.renderTemplate(templateId, variables);
  }
}

// 导出单例实例
export const templateEngine = new TemplateEngine();
