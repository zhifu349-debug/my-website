import { NextRequest, NextResponse } from "next/server";
import { contentStore } from "@/lib/content-store";

// GET /api/media - 获取所有媒体文件
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    let media;

    if (type) {
      const allMedia = await contentStore.getAllMedia();
      media = allMedia.filter((m) => m.type === type);
    } else {
      media = await contentStore.getAllMedia();
    }

    return NextResponse.json({ success: true, data: media });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}
