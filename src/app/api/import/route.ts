import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";
// Types removed due to missing exports - using any
import { createGunzip } from "zlib";
import { pipeline } from "stream/promises";

// POST /api/import - 导入内容
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // 读取上传的导入文件
    const importBuffer = Buffer.from(await file.arrayBuffer());

    // 解压缩导入文件
    const { PassThrough } = await import("stream");
    const passThrough = new PassThrough();
    passThrough.end(importBuffer);

    const gunzip = createGunzip();
    let jsonString = "";

    gunzip.on("data", (chunk) => {
      jsonString += chunk.toString();
    });

    await pipeline(passThrough, gunzip);

    // 解析导入数据
    const importData = JSON.parse(jsonString);

    if (!importData.data) {
      return NextResponse.json(
        { success: false, error: "Invalid import file format" },
        { status: 400 },
      );
    }

    const { contents, media, categories, tags, templates, templateInstances } = importData.data;
    const importedCounts = {
      contents: 0,
      media: 0,
      categories: 0,
      tags: 0,
      templates: 0,
      templateInstances: 0,
    };

    // 开始导入数据
    // 注意：这里的导入逻辑是简单的创建，实际生产环境可能需要更复杂的冲突处理

    // 导入分类
    if (categories && Array.isArray(categories)) {
      for (const category of categories) {
        try {
          await (contentStore as any).createCategory(category);
          importedCounts.categories++;
        } catch (error) {
          console.warn(`Failed to import category ${category.name.en}:`, error);
        }
      }
    }

    // 导入标签
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        try {
          await (contentStore as any).createTag(tag);
          importedCounts.tags++;
        } catch (error) {
          console.warn(`Failed to import tag ${tag.name}:`, error);
        }
      }
    }

    // 导入媒体文件
    if (media && Array.isArray(media)) {
      for (const mediaItem of media) {
        try {
          await (contentStore as any).createMedia(mediaItem);
          importedCounts.media++;
        } catch (error) {
          console.warn(`Failed to import media ${mediaItem.name}:`, error);
        }
      }
    }

    // 导入模板
    if (templates && Array.isArray(templates)) {
      for (const template of templates) {
        try {
          await (contentStore as any).createTemplate(template);
          importedCounts.templates++;
        } catch (error) {
          console.warn(`Failed to import template ${template.name}:`, error);
        }
      }
    }

    // 导入模板实例
    if (templateInstances && Array.isArray(templateInstances)) {
      for (const instance of templateInstances) {
        try {
          await (contentStore as any).createTemplateInstance(instance);
          importedCounts.templateInstances++;
        } catch (error) {
          console.warn(`Failed to import template instance ${instance.name}:`, error);
        }
      }
    }

    // 导入内容
    if (contents && Array.isArray(contents)) {
      for (const content of contents) {
        try {
          await (contentStore as any).createContent(content);
          importedCounts.contents++;
        } catch (error) {
          console.warn(`Failed to import content ${content.title.en}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true, 
      message: "Content imported successfully",
      importedCounts
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import content" },
      { status: 500 },
    );
  }
}
