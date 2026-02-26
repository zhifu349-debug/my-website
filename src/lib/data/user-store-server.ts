import { User, UserLoginHistory, UserActivity, CreateUserDto, UpdateUserDto } from '@/types/user';
import fs from 'fs';
import path from 'path';

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGIN_HISTORY_FILE = path.join(DATA_DIR, 'login-history.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

class UserStoreServer {
  private users: User[] = [];
  private loginHistories: UserLoginHistory[] = [];
  private activities: UserActivity[] = [];
  private initialized = false;

  constructor() {
    this.ensureDataDir();
    this.loadData();
    
    // 如果没有用户，初始化默认管理员
    if (this.users.length === 0) {
      this.initializeDefaultUser();
    }
    
    this.initialized = true;
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData() {
    try {
      if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        this.users = JSON.parse(data);
      }
      if (fs.existsSync(LOGIN_HISTORY_FILE)) {
        const data = fs.readFileSync(LOGIN_HISTORY_FILE, 'utf-8');
        this.loginHistories = JSON.parse(data);
      }
      if (fs.existsSync(ACTIVITIES_FILE)) {
        const data = fs.readFileSync(ACTIVITIES_FILE, 'utf-8');
        this.activities = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private saveUsers() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private saveLoginHistories() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(LOGIN_HISTORY_FILE, JSON.stringify(this.loginHistories, null, 2));
    } catch (error) {
      console.error('Error saving login histories:', error);
    }
  }

  private saveActivities() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(this.activities, null, 2));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }

  private initializeDefaultUser() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || this.generateRandomPassword();
    
    // 如果使用的是默认密码，打印警告
    if (!process.env.ADMIN_PASSWORD) {
      console.warn('⚠️  Warning: Using randomly generated admin password. Please set ADMIN_PASSWORD in .env.local');
      console.warn(`🔑  Generated password: ${adminPassword}`);
    }
    
    const defaultAdmin: User = {
      id: '1',
      username: adminUsername,
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.users.push(defaultAdmin);
    this.saveUsers();
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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
    this.saveUsers();
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

    this.saveUsers();
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    this.saveUsers();
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

    this.saveUsers();
    return this.users[index];
  }

  updateLastLogin(id: string): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      lastLogin: new Date().toISOString()
    };

    this.saveUsers();
    return this.users[index];
  }

  // 登录历史相关操作
  addLoginHistory(history: Omit<UserLoginHistory, 'id'>): UserLoginHistory {
    const newHistory: UserLoginHistory = {
      id: Date.now().toString(),
      ...history
    };

    this.loginHistories.push(newHistory);
    this.saveLoginHistories();
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
    this.saveActivities();
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
export const userStoreServer = new UserStoreServer();
