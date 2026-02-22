import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/lib/data/user-store';
import { CreateUserDto, UpdateUserDto } from '@/types/user';
import { apiSecurity } from '@/lib/security/api-security';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  return apiSecurity.validateAuth(request);
}

export async function GET(request: NextRequest) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = userStore.getUsers();
    // 移除密码字段
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json({ success: true, data: safeUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userData: CreateUserDto = await request.json();

    // 验证数据
    if (!userData.username || !userData.email || !userData.password || !userData.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 检查用户名是否已存在
    if (userStore.getUserByUsername(userData.username)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const newUser = userStore.createUser(userData);
    // 移除密码字段
    const { password, ...safeUser } = newUser;

    return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
