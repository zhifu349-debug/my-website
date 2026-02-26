import { NextRequest, NextResponse } from 'next/server';
import { userStoreServer } from '@/lib/data/user-store-server';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return !!token;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const limit = request.nextUrl.searchParams.get('limit') ? parseInt(request.nextUrl.searchParams.get('limit')!) : 50;
    const loginHistories = userStoreServer.getLoginHistories(id, limit);
    return NextResponse.json({ success: true, data: loginHistories });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
