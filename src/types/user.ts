export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
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
  role: 'admin' | 'editor' | 'viewer';
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'viewer';
  status?: 'active' | 'inactive' | 'suspended';
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
