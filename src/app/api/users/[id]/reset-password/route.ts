import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/data/user-store';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return !!token;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json({ error: 'New password is required' }, { status: 400 });
    }

    const updatedUser = userStore.updatePassword(id, newPassword);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 记录密码重置活动
    userStore.addActivity({
      userId: id,
      timestamp: new Date().toISOString(),
      action: 'password_reset',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || '',
      details: { initiatedBy: 'admin' }
    });

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
