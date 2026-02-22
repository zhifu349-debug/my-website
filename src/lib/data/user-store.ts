import { User, UserLoginHistory, UserActivity, CreateUserDto, UpdateUserDto } from '@/types/user';

class UserStore {
  private users: User[] = [];
  private loginHistories: UserLoginHistory[] = [];
  private activities: UserActivity[] = [];

  constructor() {
    // 初始化默认管理员用户
    this.initializeDefaultUser();
  }

  private initializeDefaultUser() {
    const defaultAdmin: User = {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // 生产环境应该使用哈希密码
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.users.push(defaultAdmin);
  }

  // 用户相关操作
  createUser(userData: CreateUserDto): User {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.users.push(newUser);
    return newUser;
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  updateUser(id: string, userData: UpdateUserDto): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    };

    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  updatePassword(id: string, newPassword: string): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      password: newPassword,
      updatedAt: new Date().toISOString()
    };

    return this.users[index];
  }

  updateLastLogin(id: string): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      lastLogin: new Date().toISOString()
    };

    return this.users[index];
  }

  // 登录历史相关操作
  addLoginHistory(history: Omit<UserLoginHistory, 'id'>): UserLoginHistory {
    const newHistory: UserLoginHistory = {
      id: Date.now().toString(),
      ...history
    };

    this.loginHistories.push(newHistory);
    return newHistory;
  }

  getLoginHistories(userId: string, limit: number = 50): UserLoginHistory[] {
    return this.loginHistories
      .filter(history => history.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // 活动记录相关操作
  addActivity(activity: Omit<UserActivity, 'id'>): UserActivity {
    const newActivity: UserActivity = {
      id: Date.now().toString(),
      ...activity
    };

    this.activities.push(newActivity);
    return newActivity;
  }

  getActivities(userId: string, limit: number = 50): UserActivity[] {
    return this.activities
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getAllActivities(limit: number = 100): UserActivity[] {
    return this.activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

// 导出单例实例
export const userStore = new UserStore();
