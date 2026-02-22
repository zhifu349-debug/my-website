import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";

// GET /api/contents/[id] - 获取单个内容
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const content = await contentStore.getContentById(id);

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: content });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

// PUT /api/contents/[id] - 更新内容
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { updatedBy = 'system', comment, ...updates } = body;
    const updatedContent = await contentStore.updateContent(id, updates, updatedBy, comment);

    if (!updatedContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedContent });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 },
    );
  }
}

// DELETE /api/contents/[id] - 删除内容
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const success = await contentStore.deleteContent(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 },
    );
  }
}
