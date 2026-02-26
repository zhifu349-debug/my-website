import { User, UserLoginHistory, UserActivity, CreateUserDto, UpdateUserDto } from '@/types/user';

// 客户端使用的用户存储（通过 API 与服务器通信）
class UserStore {
  // 用户相关操作 - 客户端通过 API 调用
  async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return data.users || [];
  }

  async getUserById(id: string): Promise<User | undefined> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return undefined;
    const data = await response.json();
    return data.user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.username === username);
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const response = await fetch(`/api/users/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
      },
      body: JSON.stringify({ newPassword })
    });
    return response.ok;
  }

  // 登录验证 - 通过 API 进行
  async validateCredentials(username: string, password: string): Promise<User | null> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.user || null;
  }
}

// 导出单例实例
export const userStore = new UserStore();
