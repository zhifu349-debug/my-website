import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";
import { createWriteStream } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";

// 导出目录
const exportDir = path.join(process.cwd(), "exports");

// 确保导出目录存在
async function ensureExportDir() {
  const fs = await import("fs/promises");
  try {
    await fs.access(exportDir);
  } catch {
    await fs.mkdir(exportDir, { recursive: true });
  }
}

// POST /api/export - 导出内容
export async function POST(request: NextRequest) {
  
  try {
    await ensureExportDir();

    const { types, format = "json" } = await request.json();

    // 验证请求参数
    if (!types || !Array.isArray(types) || types.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please specify content types to export" },
        { status: 400 }
      );
    }

    // 收集要导出的数据
    const exportData: any = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {}
    };

    // 根据类型导出数据
    if (types.includes("contents")) {
      exportData.data.contents = await (contentStore as any).getAllContents();
    }

    if (types.includes("media")) {
      exportData.data.media = await (contentStore as any).getAllMedia();
    }

    if (types.includes("categories")) {
      exportData.data.categories = await (contentStore as any).getAllCategories();
    }

    if (types.includes("tags")) {
      exportData.data.tags = await (contentStore as any).getAllTags();
    }

    if (types.includes("templates")) {
      exportData.data.templates = await (contentStore as any).getAllTemplates();
    }

    if (types.includes("templateInstances")) {
      exportData.data.templateInstances = await (contentStore as any).getAllTemplateInstances();
    }

    // 生成导出文件名
    const timestamp = Date.now();
    const exportFileName = `export-${timestamp}.${format === "json" ? "json.gz" : format}`;
    const exportFilePath = path.join(exportDir, exportFileName);

    // 写入导出文件
    if (format === "json") {
      const jsonString = JSON.stringify(exportData, null, 2);
      const gzip = createGzip();
      const writeStream = createWriteStream(exportFilePath);

      // 使用stream pipeline来处理压缩和写入
      const { PassThrough } = await import("stream");
      const passThrough = new PassThrough();
      passThrough.end(jsonString);

      await pipeline(passThrough, gzip, writeStream);

      // 读取生成的文件
      const exportFile = await readFile(exportFilePath);

      return new NextResponse(exportFile, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=${exportFileName}`,
          "Content-Type": "application/gzip",
          "Content-Length": exportFile.length.toString(),
        },
      });
    } else {
      // 支持其他格式（如CSV）的导出逻辑可以在这里添加
      return NextResponse.json(
        { success: false, error: "Unsupported export format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export content" },
      { status: 500 },
    );
  }
}

// GET /api/export - 获取导出列表
export async function GET(request: NextRequest) {
  try {
    await ensureExportDir();

    const fs = await import("fs/promises");
    const files = await fs.readdir(exportDir);
    
    // 过滤导出文件并按时间排序
    const exportFiles = files
      .filter(file => file.startsWith("export-") && (file.endsWith(".json.gz") || file.endsWith(".csv")))
      .map(file => {
        const timestamp = parseInt(file.replace("export-", "").split(".")[0], 10);
        return {
          fileName: file,
          timestamp,
          date: new Date(timestamp).toISOString(),
          format: file.endsWith(".json.gz") ? "json" : "csv",
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ success: true, data: exportFiles });
  } catch (error) {
    console.error("Get exports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get exports" },
      { status: 500 },
    );
  }
}
