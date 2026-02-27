/**
 * 数据模块单元测试
 */

import { describe, it, expect } from '@jest/globals';
import {
  vpsData,
  getAllVPS,
  getVPSBySlug,
  aiToolsData,
  getAllAITools,
  getAIToolBySlug,
  tutorialsData,
  getAllTutorials,
  getTutorialBySlug,
  getLocalizedText,
  getLocalizedArray,
} from '../src/lib/data';
import { Locale } from '../src/lib/i18n-config';

describe('VPS Data Module', () => {
  it('should have vps data', () => {
    expect(Object.keys(vpsData).length).toBeGreaterThan(0);
  });

  it('should return all VPS as array', () => {
    const allVPS = getAllVPS();
    expect(Array.isArray(allVPS)).toBe(true);
    expect(allVPS.length).toBe(Object.keys(vpsData).length);
  });

  it('should return VPS by slug', () => {
    const vultr = getVPSBySlug('vultr');
    expect(vultr).toBeDefined();
    expect(vultr?.name).toBe('Vultr');
  });

  it('should return undefined for non-existent slug', () => {
    const notFound = getVPSBySlug('non-existent-vps');
    expect(notFound).toBeUndefined();
  });

  it('should have required VPS properties', () => {
    const vps = getVPSBySlug('vultr');
    expect(vps).toHaveProperty('id');
    expect(vps).toHaveProperty('name');
    expect(vps).toHaveProperty('slug');
    expect(vps).toHaveProperty('rating');
    expect(vps).toHaveProperty('description');
    expect(vps?.description).toHaveProperty('en');
    expect(vps?.description).toHaveProperty('zh');
  });
});

describe('AI Tools Data Module', () => {
  it('should have AI tools data', () => {
    expect(Object.keys(aiToolsData).length).toBeGreaterThan(0);
  });

  it('should return all AI tools as array', () => {
    const allTools = getAllAITools();
    expect(Array.isArray(allTools)).toBe(true);
    expect(allTools.length).toBe(Object.keys(aiToolsData).length);
  });

  it('should return AI tool by slug', () => {
    const chatgpt = getAIToolBySlug('chatgpt');
    expect(chatgpt).toBeDefined();
    expect(chatgpt?.name).toBe('ChatGPT');
  });

  it('should have required AI tool properties', () => {
    const tool = getAIToolBySlug('chatgpt');
    expect(tool).toHaveProperty('id');
    expect(tool).toHaveProperty('name');
    expect(tool).toHaveProperty('rating');
    expect(tool).toHaveProperty('website');
  });
});

describe('Tutorials Data Module', () => {
  it('should have tutorials data', () => {
    expect(Object.keys(tutorialsData).length).toBeGreaterThan(0);
  });

  it('should return all tutorials as array', () => {
    const allTutorials = getAllTutorials();
    expect(Array.isArray(allTutorials)).toBe(true);
  });

  it('should return tutorial by slug', () => {
    const tutorial = getTutorialBySlug('v2ray-setup');
    expect(tutorial).toBeDefined();
    expect(tutorial?.id).toBe('v2ray-setup');
  });

  it('should have localized content', () => {
    const tutorial = getTutorialBySlug('v2ray-setup');
    expect(tutorial?.title).toHaveProperty('en');
    expect(tutorial?.title).toHaveProperty('zh');
    expect(tutorial?.content).toHaveProperty('en');
    expect(tutorial?.content).toHaveProperty('zh');
  });
});

describe('Localization Helpers', () => {
  it('should return English text for English locale', () => {
    const text = { en: 'Hello', zh: '你好' };
    expect(getLocalizedText(text, 'en')).toBe('Hello');
  });

  it('should return Chinese text for Chinese locale', () => {
    const text = { en: 'Hello', zh: '你好' };
    expect(getLocalizedText(text, 'zh')).toBe('你好');
  });

  it('should fallback to English for missing Chinese', () => {
    const text = { en: 'Hello', zh: '' };
    expect(getLocalizedText(text, 'zh')).toBe('Hello');
  });

  it('should return English array for English locale', () => {
    const enArray = ['a', 'b', 'c'];
    const zhArray = ['一', '二', '三'];
    expect(getLocalizedArray(enArray, zhArray, 'en')).toEqual(enArray);
  });

  it('should return Chinese array for Chinese locale', () => {
    const enArray = ['a', 'b', 'c'];
    const zhArray = ['一', '二', '三'];
    expect(getLocalizedArray(enArray, zhArray, 'zh')).toEqual(zhArray);
  });
});
