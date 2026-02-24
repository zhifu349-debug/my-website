import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";
import { createWriteStream } from "fs";
import { readFile, mkdir, access } from "fs/promises";
import path from "path";
import { createGzip } from "zlib";
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

// POST /api/backup - 创建备份
export async function POST(request: NextRequest) {
  try {
    await ensureBackupDir();

    // 获取所有数据
    const contents = await (contentStore as any).getAllContents();
    const media = await (contentStore as any).getAllMedia();
    const categories = await (contentStore as any).getAllCategories();
    const tags = await (contentStore as any).getAllTags();
    const templates = await (contentStore as any).getAllTemplates();
    const templateInstances = await (contentStore as any).getAllTemplateInstances();

    // 创建备份数据
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        contents,
        media,
        categories,
        tags,
        templates,
        templateInstances,
      },
    };

    // 生成备份文件名
    const timestamp = Date.now();
    const backupFileName = `backup-${timestamp}.json.gz`;
    const backupFilePath = path.join(backupDir, backupFileName);

    // 写入备份文件（压缩）
    const jsonString = JSON.stringify(backupData, null, 2);
    const gzip = createGzip();
    const writeStream = createWriteStream(backupFilePath);

    // 使用stream pipeline来处理压缩和写入
    const { PassThrough } = await import("stream");
    const passThrough = new PassThrough();
    passThrough.end(jsonString);

    await pipeline(passThrough, gzip, writeStream);

    // 读取生成的文件
    const backupFile = await readFile(backupFilePath);

    return new NextResponse(backupFile, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=${backupFileName}`,
        "Content-Type": "application/gzip",
        "Content-Length": backupFile.length.toString(),
      },
    });
  } catch (error) {
    console.error("Backup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create backup" },
      { status: 500 },
    );
  }
}

// GET /api/backup - 获取备份列表
export async function GET(request: NextRequest) {
  try {
    await ensureBackupDir();

    const fs = await import("fs/promises");
    const files = await fs.readdir(backupDir);
    
    // 过滤备份文件并按时间排序
    const backupFiles = files
      .filter(file => file.startsWith("backup-") && file.endsWith(".json.gz"))
      .map(file => {
        const timestamp = parseInt(file.replace("backup-", "").replace(".json.gz", ""), 10);
        return {
          fileName: file,
          timestamp,
          date: new Date(timestamp).toISOString(),
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ success: true, data: backupFiles });
  } catch (error) {
    console.error("Get backups error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get backups" },
      { status: 500 },
    );
  }
}
