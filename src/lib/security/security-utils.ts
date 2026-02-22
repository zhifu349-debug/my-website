import { UserLoginHistory } from '@/types/user';

// IP地址工具类
export class IpUtils {
  // 检查IP是否在指定IP段内
  static isIpInRange(ip: string, cidr: string): boolean {
    const [range, mask] = cidr.split('/');
    const ipNum = this.ipToNumber(ip);
    const rangeNum = this.ipToNumber(range);
    const maskNum = Math.pow(2, 32) - Math.pow(2, 32 - parseInt(mask));
    
    return (ipNum & maskNum) === (rangeNum & maskNum);
  }

  // 将IP地址转换为数字
  private static ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
  }

  // 验证IP地址格式
  static isValidIp(ip: string): boolean {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const octets = ip.split('.').map(octet => parseInt(octet));
    return octets.every(octet => octet >= 0 && octet <= 255);
  }
}

// 验证码工具类
export class CaptchaUtils {
  // 生成验证码
  static generateCaptcha(length: number = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < length; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  }

  // 验证验证码
  static verifyCaptcha(input: string, expected: string): boolean {
    return input.toUpperCase() === expected.toUpperCase();
  }
}

// 登录尝试限制工具类
export class LoginAttemptLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number; lockedUntil: number }> = new Map();
  private maxAttempts = 5;
  private lockoutDuration = 15 * 60 * 1000; // 15分钟
  private attemptWindow = 30 * 60 * 1000; // 30分钟内的尝试

  // 记录登录尝试
  recordAttempt(username: string, ip: string): boolean {
    const key = `${username}:${ip}`;
    const now = Date.now();
    
    if (!this.attempts.has(key)) {
      this.attempts.set(key, { count: 1, lastAttempt: now, lockedUntil: 0 });
    } else {
      const attempt = this.attempts.get(key)!;
      
      // 检查是否在尝试窗口内
      if (now - attempt.lastAttempt > this.attemptWindow) {
        // 重置尝试计数
        attempt.count = 1;
        attempt.lastAttempt = now;
        attempt.lockedUntil = 0;
      } else {
        // 增加尝试计数
        attempt.count++;
        attempt.lastAttempt = now;
        
        // 检查是否达到最大尝试次数
        if (attempt.count >= this.maxAttempts) {
          attempt.lockedUntil = now + this.lockoutDuration;
        }
      }
    }
    
    const currentAttempt = this.attempts.get(key)!;
    return now < currentAttempt.lockedUntil;
  }

  // 检查是否被锁定
  isLocked(username: string, ip: string): boolean {
    const key = `${username}:${ip}`;
    const now = Date.now();
    
    if (!this.attempts.has(key)) {
      return false;
    }
    
    const attempt = this.attempts.get(key)!;
    return now < attempt.lockedUntil;
  }

  // 重置尝试计数
  resetAttempts(username: string, ip: string): void {
    const key = `${username}:${ip}`;
    this.attempts.delete(key);
  }

  // 获取剩余尝试次数
  getRemainingAttempts(username: string, ip: string): number {
    const key = `${username}:${ip}`;
    const now = Date.now();
    
    if (!this.attempts.has(key)) {
      return this.maxAttempts;
    }
    
    const attempt = this.attempts.get(key)!;
    if (now - attempt.lastAttempt > this.attemptWindow) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - attempt.count);
  }
}

// 敏感操作验证工具类
export class SensitiveActionValidator {
  private pendingActions: Map<string, { action: string; timestamp: number; token: string }> = new Map();
  private tokenExpiry = 10 * 60 * 1000; // 10分钟

  // 生成敏感操作令牌
  generateActionToken(userId: string, action: string): string {
    const token = btoa(`${userId}:${action}:${Date.now()}:${Math.random()}`);
    this.pendingActions.set(userId, {
      action,
      timestamp: Date.now(),
      token
    });
    return token;
  }

  // 验证敏感操作令牌
  validateActionToken(userId: string, action: string, token: string): boolean {
    const pendingAction = this.pendingActions.get(userId);
    const now = Date.now();
    
    if (!pendingAction) {
      return false;
    }
    
    // 检查令牌是否过期
    if (now - pendingAction.timestamp > this.tokenExpiry) {
      this.pendingActions.delete(userId);
      return false;
    }
    
    // 检查令牌是否匹配
    if (pendingAction.action === action && pendingAction.token === token) {
      this.pendingActions.delete(userId);
      return true;
    }
    
    return false;
  }

  // 检查是否有未完成的敏感操作
  hasPendingAction(userId: string): boolean {
    return this.pendingActions.has(userId);
  }
}

// 导出单例实例
export const loginAttemptLimiter = new LoginAttemptLimiter();
export const sensitiveActionValidator = new SensitiveActionValidator();
