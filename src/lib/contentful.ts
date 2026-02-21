import { createClient } from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;

// 创建 Contentful 客户端
const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

// 内容类型定义
export interface ContentfulContent {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: { en: string; "zh-CN"?: string };
    slug?: { en: string; "zh-CN"?: string };
    description?: { en: string; "zh-CN"?: string };
    content?: { en: any; "zh-CN"?: any };
    coverImage?: {
      fields: {
        title?: string;
        description?: string;
        file: {
          url: string;
          details: {
            size: number;
            image: {
              width: number;
              height: number;
            };
          };
          fileName: string;
          contentType: string;
        };
      };
    };
    type?: string;
    status?: string;
    locale?: string;
  };
}

// 获取所有内容
export async function getAllContents() {
  try {
    const response = await client.getEntries({
      content_type: "content",
      locale: "zh-CN",
    });

    return response.items as unknown as ContentfulContent[];
  } catch (error) {
    console.error("Error fetching contents:", error);
    return [];
  }
}

// 获取指定类型的内容
export async function getContentsByType(type: string) {
  try {
    const response = await client.getEntries({
      content_type: "content",
      "fields.type": type,
      locale: "zh-CN",
    });

    return response.items as unknown as ContentfulContent[];
  } catch (error) {
    console.error("Error fetching contents by type:", error);
    return [];
  }
}

// 根据 slug 获取内容
export async function getContentBySlug(slug: string, locale: string = "zh-CN") {
  try {
    const response = await client.getEntries({
      content_type: "content",
      "fields.slug": slug,
      locale: locale === "zh" ? "zh-CN" : locale,
      limit: 1,
    });

    return response.items[0] as unknown as ContentfulContent;
  } catch (error) {
    console.error("Error fetching content by slug:", error);
    return null;
  }
}

// 根据 ID 获取内容
export async function getContentById(id: string, locale: string = "zh-CN") {
  try {
    const entry = await client.getEntry(id, {
      locale: locale === "zh" ? "zh-CN" : locale,
    });

    return entry as unknown as ContentfulContent;
  } catch (error) {
    console.error("Error fetching content by id:", error);
    return null;
  }
}

export default client;
