import { NextRequest, NextResponse } from 'next/server';

// 速率限制配置接口
interface RateLimitConfig {
  // 时间窗口（毫秒）
  windowMs: number;
  // 每个IP在时间窗口内允许的最大请求数
  maxRequests: number;
  // 是否启用速率限制
  enabled: boolean;
}

// 默认速率限制配置
const defaultRateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 100, // 每个IP每分钟100个请求
  enabled: true
};

class ApiSecurity {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private rateLimitConfig: RateLimitConfig;

  constructor(rateLimitConfig: Partial<RateLimitConfig> = {}) {
    this.rateLimitConfig = { ...defaultRateLimitConfig, ...rateLimitConfig };
  }

  // 验证请求是否来自已登录用户
  validateAuth(request: NextRequest): boolean {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    return !!token;
  }

  // 验证 CSRF 令牌
  validateCsrfToken(request: NextRequest): boolean {
    // 从请求头或请求体中获取 CSRF 令牌
    const csrfToken = request.headers.get('x-csrf-token') || 
                     request.cookies.get('XSRF-TOKEN')?.value;
    
    // 在实际项目中，应该验证令牌是否有效
    // 这里简化处理，只检查令牌是否存在
    return !!csrfToken;
  }

  // 验证输入数据
  validateInput(data: any, schema: any): { valid: boolean; errors: string[] } {
    // 在实际项目中，应该使用更复杂的验证库，如 Joi 或 Zod
    // 这里简化处理，只检查数据是否存在
    const errors: string[] = [];
    
    if (!data) {
      errors.push('No data provided');
      return { valid: false, errors };
    }

    return { valid: true, errors };
  }

  // 检查速率限制
  checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    if (!this.rateLimitConfig.enabled) {
      return { allowed: true, remaining: this.rateLimitConfig.maxRequests, resetTime: 0 };
    }

    const now = Date.now();
    const windowMs = this.rateLimitConfig.windowMs;
    const maxRequests = this.rateLimitConfig.maxRequests;

    if (!this.rateLimitStore.has(ip)) {
      this.rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    const rateLimit = this.rateLimitStore.get(ip)!;

    // 检查是否在时间窗口内
    if (now > rateLimit.resetTime) {
      // 重置速率限制
      rateLimit.count = 1;
      rateLimit.resetTime = now + windowMs;
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    // 检查是否超过最大请求数
    if (rateLimit.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: rateLimit.resetTime };
    }

    // 增加请求计数
    rateLimit.count++;
    return { allowed: true, remaining: maxRequests - rateLimit.count, resetTime: rateLimit.resetTime };
  }

  // 创建安全中间件
  createMiddleware() {
    return async (request: NextRequest, next: () => Promise<NextResponse>) => {
      // 获取客户端IP地址
      const ip = this.getClientIp(request);

      // 检查速率限制
      const rateLimitResult = this.checkRateLimit(ip);
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: 'Too many requests, please try again later' },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': this.rateLimitConfig.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': Math.floor(rateLimitResult.resetTime / 1000).toString()
            }
          }
        );
      }

      // 验证 CSRF 令牌（对于非 GET 请求）
      if (request.method !== 'GET') {
        const isValidCsrf = this.validateCsrfToken(request);
        if (!isValidCsrf) {
          return NextResponse.json(
            { error: 'CSRF token validation failed' },
            { status: 403 }
          );
        }
      }

      // 添加安全响应头
      const response = await next();
      
      // 添加速率限制响应头
      response.headers.set('X-RateLimit-Limit', this.rateLimitConfig.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.floor(rateLimitResult.resetTime / 1000).toString());

      // 添加安全响应头
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

      return response;
    };
  }

  // 从请求中获取客户端IP地址
  private getClientIp(request: NextRequest): string {
    // 尝试从各种头信息中获取IP地址
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'forwarded',
      'cf-connecting-ip'
    ];

    for (const header of ipHeaders) {
      const value = request.headers.get(header);
      if (value) {
        // 对于x-forwarded-for，可能包含多个IP地址，取第一个
        if (header === 'x-forwarded-for') {
          const ips = value.split(',');
          return ips[0].trim();
        }
        return value;
      }
    }

    // 如果无法从头信息中获取，使用默认值
    return '127.0.0.1';
  }
}

// 导出单例实例
export const apiSecurity = new ApiSecurity();
