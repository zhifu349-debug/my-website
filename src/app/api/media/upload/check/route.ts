import { NextRequest, NextResponse } from "next/server";
import { access, readdir } from "fs/promises";
import path from "path";

// 存储上传的临时分块
const uploadsDir = path.join(process.cwd(), "public", "uploads");
const chunksDir = path.join(uploadsDir, "chunks");

// 安全读取目录
async function readdirSafe(dir: string) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

// POST /api/media/upload/check - 检查已上传的分块
export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "Missing fileId" },
        { status: 400 },
      );
    }

    const fileChunksDir = path.join(chunksDir, fileId);
    let uploadedChunks = 0;

    try {
      await access(fileChunksDir);
      uploadedChunks = (await readdirSafe(fileChunksDir)).length;
    } catch {
      // 目录不存在，已上传分块数为0
    }

    return NextResponse.json({
      success: true,
      uploadedChunks,
    });
  } catch (error) {
    console.error("Check upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check upload" },
      { status: 500 },
    );
  }
}
