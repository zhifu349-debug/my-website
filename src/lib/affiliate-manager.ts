import { AffiliateLink } from '@/types/advertising'

// 联盟链接管理引擎
export class AffiliateManager {
  private links: Map<string, AffiliateLink> = new Map()

  constructor() {
    this.initializeDefaultLinks()
  }

  // 初始化默认联盟链接
  private initializeDefaultLinks() {
    const defaultLinks: AffiliateLink[] = [
      {
        id: 'vultr-main',
        name: 'Vultr Affiliate',
        url: 'https://www.vultr.com/?ref=example123',
        productId: 'vultr',
        ctaText: 'Get Started with Vultr',
        enabled: true,
        clickTracking: {
          totalClicks: 0
        }
      },
      {
        id: 'do-main',
        name: 'DigitalOcean Affiliate',
        url: 'https://www.digitalocean.com/?refcode=example456',
        productId: 'digitalocean',
        ctaText: 'Try DigitalOcean',
        enabled: true,
        clickTracking: {
          totalClicks: 0
        }
      },
      {
        id: 'linode-main',
        name: 'Linode Affiliate',
        url: 'https://www.linode.com/?r=example789',
        productId: 'linode',
        ctaText: 'Deploy on Linode',
        enabled: true,
        clickTracking: {
          totalClicks: 0
        }
      }
    ]

    defaultLinks.forEach(link => this.links.set(link.id, link))
  }

  // 添加联盟链接
  addLink(link: AffiliateLink): void {
    this.links.set(link.id, link)
  }

  // 更新联盟链接
  updateLink(id: string, updates: Partial<AffiliateLink>): boolean {
    const link = this.links.get(id)
    if (!link) return false

    const updated = { ...link, ...updates }
    this.links.set(id, updated)
    return true
  }

  // 获取联盟链接
  getLink(id: string): AffiliateLink | undefined {
    return this.links.get(id)
  }

  // 根据产品ID获取联盟链接
  getLinkByProductId(productId: string): AffiliateLink | undefined {
    return Array.from(this.links.values()).find(
      link => link.productId === productId && link.enabled
    )
  }

  // 获取所有启用的链接
  getEnabledLinks(): AffiliateLink[] {
    return Array.from(this.links.values()).filter(link => link.enabled)
  }

  // 记录点击
  recordClick(linkId: string): boolean {
    const link = this.links.get(linkId)
    if (!link) return false

    link.clickTracking.totalClicks += 1
    link.clickTracking.lastClickAt = new Date()
    this.links.set(linkId, link)

    // 这里可以集成第三方跟踪服务
    this.trackClickExternally(link)

    return true
  }

  // 记录转化
  recordConversion(linkId: string, revenue: number): boolean {
    const link = this.links.get(linkId)
    if (!link) return false

    if (!link.conversionTracking) {
      link.conversionTracking = {
        totalConversions: 0,
        revenue: 0
      }
    }

    link.conversionTracking.totalConversions += 1
    link.conversionTracking.revenue += revenue
    link.conversionTracking.lastConversionAt = new Date()
    this.links.set(linkId, link)

    // 这里可以集成第三方跟踪服务
    this.trackConversionExternally(link, revenue)

    return true
  }

  // 转化率计算
  getConversionRate(linkId: string): number {
    const link = this.links.get(linkId)
    if (!link || link.clickTracking.totalClicks === 0) return 0

    const conversions = link.conversionTracking?.totalConversions || 0
    return (conversions / link.clickTracking.totalClicks) * 100
  }

  // 检测失效链接
  async checkLinkHealth(): Promise<Array<{ id: string; healthy: boolean; status?: number }>> {
    const results: Array<{ id: string; healthy: boolean; status?: number }> = []

    for (const [id, link] of this.links) {
      try {
        const response = await fetch(link.url, { method: 'HEAD' })
        const healthy = response.status >= 200 && response.status < 400
        results.push({ id, healthy, status: response.status })
      } catch (error) {
        results.push({ id, healthy: false })
      }
    }

    return results
  }

  // 外部点击跟踪
  private trackClickExternally(link: AffiliateLink): void {
    // 集成 Google Analytics 或其他分析服务
    console.log(`Tracking click for ${link.name}: ${link.url}`)

    // 示例: Google Analytics 事件跟踪
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        link_name: link.name,
        product_id: link.productId
      })
    }
  }

  // 外部转化跟踪
  private trackConversionExternally(link: AffiliateLink, revenue: number): void {
    // 集成 Google Analytics 或其他分析服务
    console.log(`Tracking conversion for ${link.name}: $${revenue}`)

    // 示例: Google Analytics 事件跟踪
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: link.id,
        value: revenue,
        currency: 'USD'
      })
    }
  }

  // 导出链接数据（用于备份/分析）
  exportLinksData(): string {
    const data = Array.from(this.links.values())
    return JSON.stringify(data, null, 2)
  }

  // 导入链接数据
  importLinksData(json: string): boolean {
    try {
      const data: AffiliateLink[] = JSON.parse(json)
      data.forEach(link => this.links.set(link.id, link))
      return true
    } catch (error) {
      console.error('Failed to import links data:', error)
      return false
    }
  }
}

// 导出单例
export const affiliateManager = new AffiliateManager()
