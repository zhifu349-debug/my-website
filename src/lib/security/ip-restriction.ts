import { NextRequest, NextResponse } from 'next/server';
import { IpUtils } from './security-utils';

// IP限制配置接口
interface IpRestrictionConfig {
  // 允许的IP地址列表
  allowedIps: string[];
  // 允许的IP段列表（CIDR格式）
  allowedIpRanges: string[];
  // 禁止的IP地址列表
  blockedIps: string[];
  // 禁止的IP段列表（CIDR格式）
  blockedIpRanges: string[];
  // 允许的国家/地区代码列表
  allowedCountries: string[];
  // 禁止的国家/地区代码列表
  blockedCountries: string[];
  // 是否启用IP限制
  enabled: boolean;
}

// 默认IP限制配置
const defaultConfig: IpRestrictionConfig = {
  allowedIps: [],
  allowedIpRanges: [],
  blockedIps: [],
  blockedIpRanges: [],
  allowedCountries: [],
  blockedCountries: [],
  enabled: false
};

class IpRestriction {
  private config: IpRestrictionConfig;

  constructor(config: Partial<IpRestrictionConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // 更新配置
  updateConfig(config: Partial<IpRestrictionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // 获取当前配置
  getConfig(): IpRestrictionConfig {
    return this.config;
  }

  // 检查IP是否被允许
  async isAllowed(ip: string): Promise<boolean> {
    // 如果IP限制未启用，直接允许
    if (!this.config.enabled) {
      return true;
    }

    // 检查是否在禁止列表中
    if (this.config.blockedIps.includes(ip)) {
      return false;
    }

    // 检查是否在禁止的IP段中
    for (const range of this.config.blockedIpRanges) {
      if (IpUtils.isIpInRange(ip, range)) {
        return false;
      }
    }

    // 检查是否在允许列表中
    if (this.config.allowedIps.length > 0 && !this.config.allowedIps.includes(ip)) {
      // 检查是否在允许的IP段中
      let inAllowedRange = false;
      for (const range of this.config.allowedIpRanges) {
        if (IpUtils.isIpInRange(ip, range)) {
          inAllowedRange = true;
          break;
        }
      }
      if (!inAllowedRange) {
        return false;
      }
    }

    // 检查地理区域限制（模拟实现，实际项目中应使用真实的IP地理位置服务）
    if (this.config.allowedCountries.length > 0 || this.config.blockedCountries.length > 0) {
      const country = await this.getIpCountry(ip);
      if (country) {
        // 检查是否在禁止的国家/地区中
        if (this.config.blockedCountries.includes(country)) {
          return false;
        }

        // 检查是否在允许的国家/地区中
        if (this.config.allowedCountries.length > 0 && !this.config.allowedCountries.includes(country)) {
          return false;
        }
      }
    }

    return true;
  }

  // 获取IP对应的国家/地区代码（模拟实现）
  private async getIpCountry(ip: string): Promise<string | null> {
    // 实际项目中，应该使用IP地理位置服务，如MaxMind GeoIP2、IP2Location等
    // 这里使用模拟数据
    const mockCountryMap: Record<string, string> = {
      '127.0.0.1': 'CN',
      '192.168.1.1': 'CN',
      '10.0.0.1': 'CN',
      '8.8.8.8': 'US',
      '8.8.4.4': 'US'
    };

    return mockCountryMap[ip] || null;
  }

  // 创建IP限制中间件
  createMiddleware() {
    return async (request: NextRequest) => {
      // 获取客户端IP地址
      const ip = this.getClientIp(request);
      
      // 检查IP是否被允许
      const allowed = await this.isAllowed(ip);
      
      if (!allowed) {
        return NextResponse.json(
          { error: 'Access denied. Your IP address is not allowed.' },
          { status: 403 }
        );
      }
      
      return NextResponse.next();
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
          const clientIp = ips[0].trim();
          if (IpUtils.isValidIp(clientIp)) {
            return clientIp;
          }
        } else if (IpUtils.isValidIp(value)) {
          return value;
        }
      }
    }

    // 如果无法从头信息中获取，使用默认值
    return '127.0.0.1';
  }
}

// 导出单例实例
export const ipRestriction = new IpRestriction();
