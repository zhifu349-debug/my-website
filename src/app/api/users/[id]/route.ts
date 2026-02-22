import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/data/user-store';
import { UpdateUserDto } from '@/types/user';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return !!token;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = userStore.getUserById(params.id);
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userData: UpdateUserDto = await request.json();
    const updatedUser = userStore.updateUser(params.id, userData);

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 不允许删除默认管理员
    if (params.id === '1') {
      return NextResponse.json({ error: 'Cannot delete default admin user' }, { status: 403 });
    }

    const success = userStore.deleteUser(params.id);
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
