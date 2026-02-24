import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";
// import { CMSContent, MediaFile, Category, Tag, Template, TemplateInstance } from "@/lib/cms-types";
import { readFile, mkdir, access } from "fs/promises";
import path from "path";
import { createGunzip } from "zlib";
import { pipeline } from "stream/promises";

// 备份目录
const backupDir = path.join(process.cwd(), "backups");

// 确保备份目录存在
async function ensureBackupDir() {
  try {
    await access(backupDir);
  } catch {
    await mkdir(backupDir, { recursive: true });
  }
}

// POST /api/backup/restore - 恢复备份
export async function POST(request: NextRequest) {
  try {
    await ensureBackupDir();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // 读取上传的备份文件
    const backupBuffer = Buffer.from(await file.arrayBuffer());

    // 解压缩备份文件
    const { PassThrough } = await import("stream");
    const passThrough = new PassThrough();
    passThrough.end(backupBuffer);

    const gunzip = createGunzip();
    let jsonString = "";

    gunzip.on("data", (chunk) => {
      jsonString += chunk.toString();
    });

    await pipeline(passThrough, gunzip);

    // 解析备份数据
    const backupData = JSON.parse(jsonString);

    if (!backupData.data) {
      return NextResponse.json(
        { success: false, error: "Invalid backup file format" },
        { status: 400 },
      );
    }

    const { contents, media, categories, tags, templates, templateInstances } = backupData.data;

    // 开始恢复数据
    // 注意：这里的恢复逻辑是简单的覆盖，实际生产环境可能需要更复杂的冲突处理

    // 恢复分类
    if (categories && Array.isArray(categories)) {
      for (const category of categories) {
        try {
          await (contentStore as any).createCategory(category);
        } catch (error) {
          console.warn(`Failed to restore category ${category.name.en}:`, error);
        }
      }
    }

    // 恢复标签
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        try {
          await (contentStore as any).createTag(tag);
        } catch (error) {
          console.warn(`Failed to restore tag ${tag.name}:`, error);
        }
      }
    }

    // 恢复媒体文件
    if (media && Array.isArray(media)) {
      for (const mediaItem of media) {
        try {
          await (contentStore as any).createMedia(mediaItem);
        } catch (error) {
          console.warn(`Failed to restore media ${mediaItem.name}:`, error);
        }
      }
    }

    // 恢复模板
    if (templates && Array.isArray(templates)) {
      for (const template of templates) {
        try {
          await (contentStore as any).createTemplate(template);
        } catch (error) {
          console.warn(`Failed to restore template ${template.name}:`, error);
        }
      }
    }

    // 恢复模板实例
    if (templateInstances && Array.isArray(templateInstances)) {
      for (const instance of templateInstances) {
        try {
          await (contentStore as any).createTemplateInstance(instance);
        } catch (error) {
          console.warn(`Failed to restore template instance ${instance.name}:`, error);
        }
      }
    }

    // 恢复内容
    if (contents && Array.isArray(contents)) {
      for (const content of contents) {
        try {
          await (contentStore as any).createContent(content);
        } catch (error) {
          console.warn(`Failed to restore content ${content.title.en}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Backup restored successfully" });
  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore backup" },
      { status: 500 },
    );
  }
}
