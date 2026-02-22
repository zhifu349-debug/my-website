// 权限模块定义
export interface PermissionModule {
  id: string;
  name: string;
  description: string;
}

// 权限操作定义
export interface PermissionAction {
  id: string;
  name: string;
  description: string;
}

// 角色权限定义
export interface RolePermission {
  role: 'admin' | 'editor' | 'viewer';
  permissions: {
    [moduleId: string]: {
      [actionId: string]: boolean;
    };
  };
}

// 预定义角色
export type RoleType = 'admin' | 'editor' | 'viewer';

// 预定义模块
export const PERMISSION_MODULES: PermissionModule[] = [
  { id: 'users', name: '用户管理', description: '管理系统用户' },
  { id: 'contents', name: '内容管理', description: '管理网站内容' },
  { id: 'media', name: '媒体管理', description: '管理媒体文件' },
  { id: 'permissions', name: '权限管理', description: '管理系统权限' },
  { id: 'settings', name: '系统设置', description: '管理系统设置' },
];

// 预定义操作
export const PERMISSION_ACTIONS: PermissionAction[] = [
  { id: 'view', name: '查看', description: '查看资源' },
  { id: 'create', name: '创建', description: '创建资源' },
  { id: 'update', name: '编辑', description: '编辑资源' },
  { id: 'delete', name: '删除', description: '删除资源' },
  { id: 'manage', name: '管理', description: '完全管理权限' },
];

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: RoleType;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface UserLoginHistory {
  id: string;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: RoleType;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: RoleType;
  status?: 'active' | 'inactive' | 'suspended';
}

// 权限更新DTO
export interface UpdateRolePermissionDto {
  role: RoleType;
  permissions: {
    [moduleId: string]: {
      [actionId: string]: boolean;
    };
  };
}

export interface ResetPasswordDto {
  userId: string;
  newPassword: string;
}

export interface LoginAttemptDto {
  username: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}
