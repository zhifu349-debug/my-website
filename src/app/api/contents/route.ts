import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";
import { CMSContent } from "@/lib/cms-types";

// GET /api/contents - 获取所有内容
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let contents;

    if (type) {
      contents = await contentStore.getContentsByType(
        type as CMSContent["type"],
      );
    } else if (status) {
      contents = await contentStore.getContentsByStatus(status as any);
    } else {
      contents = await contentStore.getAllContents();
    }

    return NextResponse.json({ success: true, data: contents });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contents" },
      { status: 500 },
    );
  }
}

// POST /api/contents - 创建新内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newContent = await contentStore.createContent(body);

    return NextResponse.json(
      { success: true, data: newContent },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 },
    );
  }
}
