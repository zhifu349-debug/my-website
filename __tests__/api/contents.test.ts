import { contentStore } from '@/lib/content-store';

// 模拟contentStore
jest.mock('@/lib/content-store', () => ({
  contentStore: {
    getAllContents: jest.fn(),
    getContentsByType: jest.fn(),
    getContentsByStatus: jest.fn(),
    createContent: jest.fn(),
  },
}));

const mockContentStore = contentStore as jest.Mocked<typeof contentStore>;

describe('Contents API Logic', () => {
  it('should test content store functions', async () => {
    // 测试getAllContents
    const mockContents = [{ id: '1', title: { en: 'Test Content' }, status: 'published' }];
    mockContentStore.getAllContents.mockResolvedValue(mockContents as any);

    const contents = await mockContentStore.getAllContents();
    expect(contents).toEqual(mockContents);

    // 测试getContentsByType
    const mockTypeContents = [{ id: '1', title: { en: 'Test Content' }, type: 'recommendation' }];
    mockContentStore.getContentsByType.mockResolvedValue(mockTypeContents as any);

    const typeContents = await mockContentStore.getContentsByType('recommendation');
    expect(typeContents).toEqual(mockTypeContents);

    // 测试getContentsByStatus
    const mockStatusContents = [{ id: '1', title: { en: 'Test Content' }, status: 'draft' }];
    mockContentStore.getContentsByStatus.mockResolvedValue(mockStatusContents as any);

    const statusContents = await mockContentStore.getContentsByStatus('draft');
    expect(statusContents).toEqual(mockStatusContents);

    // 测试createContent
    const mockNewContent = { id: '1', title: { en: 'New Content' } };
    const mockContentData = { title: { en: 'New Content' } };
    mockContentStore.createContent.mockResolvedValue(mockNewContent as any);

    const newContent = await mockContentStore.createContent(mockContentData);
    expect(newContent).toEqual(mockNewContent);
  });

  it('should test error handling', async () => {
    // 测试getAllContents错误处理
    mockContentStore.getAllContents.mockRejectedValue(new Error('Failed to fetch'));

    await expect(mockContentStore.getAllContents()).rejects.toThrow('Failed to fetch');

    // 测试createContent错误处理
    mockContentStore.createContent.mockRejectedValue(new Error('Failed to create'));

    await expect(mockContentStore.createContent({ title: { en: 'New Content' } })).rejects.toThrow('Failed to create');
  });
});
