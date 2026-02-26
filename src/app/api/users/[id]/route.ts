import { NextRequest, NextResponse } from 'next/server';
import { userStoreServer } from '@/lib/data/user-store-server';
import { UpdateUserDto } from '@/types/user';
import { apiSecurity } from '@/lib/security/api-security';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  return apiSecurity.validateAuth(request);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const user = userStoreServer.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 移除密码字段
    const { password, ...safeUser } = user;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userData: UpdateUserDto = await request.json();
    const updatedUser = userStoreServer.updateUser(id, userData);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 移除密码字段
    const { password, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    // 不允许删除默认管理员
    if (id === '1') {
      return NextResponse.json({ error: 'Cannot delete default admin user' }, { status: 403 });
    }

    const success = userStoreServer.deleteUser(id);
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
