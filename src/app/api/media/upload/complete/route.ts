import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";
import { MediaFile } from "@/lib/cms-types";
import { writeFile, readFile, mkdir, access, rm } from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";

// 存储上传的临时分块
const uploadsDir = path.join(process.cwd(), "public", "uploads");
const chunksDir = path.join(uploadsDir, "chunks");

// 确保目录存在
async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

// 安全读取目录
async function readdirSafe(dir: string) {
  try {
    const fs = await import("fs/promises");
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

// 合并分块
async function mergeChunks(chunks: string[], chunksDir: string, outputPath: string) {
  const fs = await import("fs/promises");
  const outputStream = createWriteStream(outputPath);

  // 按分块索引排序
  const sortedChunks = chunks
    .filter(chunk => chunk.startsWith("chunk_"))
    .sort((a, b) => {
      const indexA = parseInt(a.split("_")[1], 10);
      const indexB = parseInt(b.split("_")[1], 10);
      return indexA - indexB;
    });

  for (const chunk of sortedChunks) {
    const chunkPath = path.join(chunksDir, chunk);
    const chunkData = await fs.readFile(chunkPath);
    await outputStream.write(chunkData);
  }

  await outputStream.end();
}

// 根据文件扩展名获取MIME类型
function getFileTypeByExtension(ext: string) {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
  };
  return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
}

// POST /api/media/upload/complete - 完成上传，合并分块
export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName } = await request.json();

    if (!fileId || !fileName) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const fileChunksDir = path.join(chunksDir, fileId);
    const chunks = await readdirSafe(fileChunksDir);

    if (chunks.length === 0) {
      return NextResponse.json(
        { success: false, error: "No chunks found" },
        { status: 400 },
      );
    }

    // 确保uploads目录存在
    await ensureDir(uploadsDir);

    // 生成最终文件名
    const timestamp = Date.now();
    const ext = fileName.split(".").pop();
    const finalFilename = `${timestamp}-${fileName}`;
    const finalPath = path.join(uploadsDir, finalFilename);

    // 合并分块
    await mergeChunks(chunks, fileChunksDir, finalPath);

    // 清理临时分块
    await rm(fileChunksDir, { recursive: true, force: true });

    // 读取文件信息
    const fileStats = await readFile(finalPath);
    const fileSize = fileStats.length;
    const fileType = getFileTypeByExtension(ext || "");

    // 获取图片尺寸（如果是图片）
    let width: number | undefined;
    let height: number | undefined;

    if (fileType?.startsWith("image/")) {
      try {
        // 这里可以添加图片尺寸检测逻辑
        // 简化处理：如果需要尺寸，可以使用sharp库
      } catch (e) {
        console.error("Failed to get image dimensions:", e);
      }
    }

    // 创建媒体记录
    const mediaData: Omit<MediaFile, "id" | "uploadedAt"> = {
      type: fileType?.startsWith("video/") ? "video" : "image",
      name: fileName,
      url: `/uploads/${finalFilename}`,
      size: fileSize,
      width,
      height,
      alt: fileName,
      uploadedBy: "admin", // 实际应从session获取
      tags: [],
      
    };

    const media = await (contentStore as any).createMedia(mediaData);

    return NextResponse.json({ success: true, data: media }, { status: 201 });
  } catch (error) {
    console.error("Complete upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete upload" },
      { status: 500 },
    );
  }
}
