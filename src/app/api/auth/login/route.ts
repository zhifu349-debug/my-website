import { NextRequest, NextResponse } from 'next/server';
import { userStoreServer } from '@/lib/data/user-store-server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = userStoreServer.getUserByUsername(username);

    if (user && user.password === password && user.status === 'active') {
      // 更新最后登录时间
      userStoreServer.updateLastLogin(user.id);
      
      // 记录登录历史
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '127.0.0.1';
      
      userStoreServer.addLoginHistory({
        userId: user.id,
        timestamp: new Date().toISOString(),
        ipAddress,
        userAgent: request.headers.get('user-agent') || '',
        status: 'success'
      });

      // 返回用户信息（不包含密码）
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        success: true,
        user: userWithoutPassword
      });
    } else {
      // 记录失败登录
      if (user) {
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         '127.0.0.1';
        
        userStoreServer.addLoginHistory({
          userId: user.id,
          timestamp: new Date().toISOString(),
          ipAddress,
          userAgent: request.headers.get('user-agent') || '',
          status: 'failed',
          errorMessage: 'Invalid password'
        });
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
