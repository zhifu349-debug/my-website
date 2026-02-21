import { AdSlot, AdSlotType, AdDisplayRule } from "@/types/advertising";

// A/B测试变体类型
interface ABTestVariant {
  id: string;
  adCode: string;
  traffic: number;
}

// A/B测试配置
interface ABTestConfig {
  enabled: boolean;
  variants: ABTestVariant[];
}

// 广告管理引擎
export class AdManager {
  private adSlots: Map<string, AdSlot> = new Map();
  private displayRules: AdDisplayRule[] = [];

  constructor() {
    this.initializeDefaultAdSlots();
  }

  // 初始化默认广告位
  private initializeDefaultAdSlots() {
    const defaultSlots: AdSlot[] = [
      {
        id: "in-content-1",
        name: "In-Content Ad 1",
        type: AdSlotType.IN_CONTENT,
        adCode: '<div class="ad-placeholder">In-Content Ad Slot</div>',
        enabled: true,
      },
      {
        id: "sidebar-1",
        name: "Sidebar Ad 1",
        type: AdSlotType.SIDEBAR,
        adCode: '<div class="ad-placeholder">Sidebar Ad Slot</div>',
        enabled: true,
      },
      {
        id: "below-title",
        name: "Below Title",
        type: AdSlotType.BELOW_TITLE,
        adCode: '<div class="ad-placeholder">Below Title Ad</div>',
        enabled: true,
      },
      {
        id: "above-fold",
        name: "Above Fold",
        type: AdSlotType.ABOVE_FOLD,
        adCode: '<div class="ad-placeholder">Above Fold Ad</div>',
        enabled: false,
      },
    ];

    defaultSlots.forEach((slot) => this.adSlots.set(slot.id, slot));
  }

  // 添加广告位
  addAdSlot(slot: AdSlot): void {
    this.adSlots.set(slot.id, slot);
  }

  // 更新广告位
  updateAdSlot(id: string, updates: Partial<AdSlot>): boolean {
    const slot = this.adSlots.get(id);
    if (!slot) return false;

    const updated = { ...slot, ...updates };
    this.adSlots.set(id, updated);
    return true;
  }

  // 获取广告位
  getAdSlot(id: string): AdSlot | undefined {
    return this.adSlots.get(id);
  }

  // 根据页面类型获取可用广告位
  getAdSlotsByPageType(pageType: string): AdSlot[] {
    const rules = this.displayRules.filter(
      (rule) => rule.pageType === pageType,
    );
    const slotIds = new Set(rules.map((rule) => rule.adSlotId));

    return Array.from(this.adSlots.values())
      .filter(
        (slot) => slot.enabled && (slotIds.has(slot.id) || slotIds.size === 0),
      )
      .sort((a, b) => {
        const ruleA = rules.find((r) => r.adSlotId === a.id);
        const ruleB = rules.find((r) => r.adSlotId === b.id);
        return (ruleA?.position || 0) - (ruleB?.position || 0);
      });
  }

  // 添加展示规则
  addDisplayRule(rule: AdDisplayRule): void {
    this.displayRules.push(rule);
  }

  // 更新广告RPM数据
  updateSlotRPM(slotId: string, rpm: number): boolean {
    const slot = this.adSlots.get(slotId);
    if (!slot) return false;

    slot.rpm = rpm;
    this.adSlots.set(slotId, slot);
    return true;
  }

  // A/B测试 - 获取变体
  getAdVariant(slotId: string): string {
    const slot = this.adSlots.get(slotId);
    if (!slot || !slot.abTest?.enabled) {
      return slot?.adCode || "";
    }

    const abTest = slot.abTest as ABTestConfig;

    // 根据流量分配返回变体
    const random = Math.random() * 100;
    let accumulated = 0;

    for (const variant of abTest.variants) {
      accumulated += variant.traffic;
      if (random <= accumulated) {
        return variant.adCode;
      }
    }

    return slot.adCode;
  }

  // 启用A/B测试
  enableABTest(slotId: string, variants: ABTestVariant[]): boolean {
    const slot = this.adSlots.get(slotId);
    if (!slot) return false;

    const abTestConfig: ABTestConfig = {
      enabled: true,
      variants,
    };

    slot.abTest = abTestConfig;
    this.adSlots.set(slotId, slot);
    return true;
  }

  // 禁用A/B测试
  disableABTest(slotId: string): boolean {
    const slot = this.adSlots.get(slotId);
    if (!slot) return false;

    slot.abTest = undefined;
    this.adSlots.set(slotId, slot);
    return true;
  }
}

// 导出单例
export const adManager = new AdManager();
