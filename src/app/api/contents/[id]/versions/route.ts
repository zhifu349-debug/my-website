import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";

// GET /api/contents/[id]/versions - 获取内容的所有版本
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const versions = await contentStore.getContentVersions(id);

    return NextResponse.json({ success: true, data: versions });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch versions" },
      { status: 500 },
    );
  }
}

// POST /api/contents/[id]/versions/rollback - 版本回滚
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { versionId, updatedBy = 'system' } = body;

    if (!versionId) {
      return NextResponse.json(
        { success: false, error: "Version ID is required" },
        { status: 400 },
      );
    }

    const rolledBackContent = await contentStore.rollbackToVersion(id, versionId, updatedBy);

    if (!rolledBackContent) {
      return NextResponse.json(
        { success: false, error: "Failed to rollback version" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: rolledBackContent });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to rollback version" },
      { status: 500 },
    );
  }
}
