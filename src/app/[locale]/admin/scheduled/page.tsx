"use client";

import { CMSContent } from '@/lib/cms-types';
import { useState, useEffect, useCallback } from 'react';

// 模拟获取待发布内容
const fetchScheduledContent = async (): Promise<CMSContent[]> => {
  // 实际项目中应该从API获取
  return [
    {
      id: '1',
      type: 'recommendation',
      title: { en: 'Test Content 1', zh: '测试内容 1' },
      slug: 'test-content-1',
      status: 'scheduled',
      locale: 'zh',
      seo: {
        title: { en: '', zh: '' },
        description: { en: '', zh: '' },
        keywords: { en: '', zh: '' },
        canonical: ''
      },
      content: {
        en: { intro: '', sections: [] },
        zh: { intro: '', sections: [] }
      },
      author: 'admin',
      scheduledPublishAt: new Date(Date.now() + 3600000), // 1小时后
      updatedAt: new Date(),
      createdAt: new Date()
    },
    {
      id: '2',
      type: 'review',
      title: { en: 'Test Content 2', zh: '测试内容 2' },
      slug: 'test-content-2',
      status: 'scheduled',
      locale: 'zh',
      seo: {
        title: { en: '', zh: '' },
        description: { en: '', zh: '' },
        keywords: { en: '', zh: '' },
        canonical: ''
      },
      content: {
        en: { intro: '', sections: [] },
        zh: { intro: '', sections: [] }
      },
      author: 'admin',
      scheduledPublishAt: new Date(Date.now() + 7200000), // 2小时后
      updatedAt: new Date(),
      createdAt: new Date()
    }
  ];
};

// 格式化日期时间
const formatDateTime = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 计算剩余时间
const getTimeRemaining = (date: Date | string) => {
  const now = new Date();
  const scheduledTime = new Date(date);
  const diff = scheduledTime.getTime() - now.getTime();
  
  if (diff <= 0) return '已到期';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟后`;
  } else {
    return `${minutes}分钟后`;
  }
};

export default function ScheduledContentPage() {
  const [scheduledContent, setScheduledContent] = useState<CMSContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 加载内容
  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const content = await fetchScheduledContent();
      setScheduledContent(content);
      setFilteredContent(content);
    } catch (error) {
      console.error('Failed to load scheduled content:', error);
      setNotification({ type: 'error', message: '加载定时发布内容失败' });
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载和定时刷新
  useEffect(() => {
    loadContent();
    
    // 每30秒刷新一次数据
    const intervalId = setInterval(loadContent, 30000);
    
    return () => clearInterval(intervalId);
  }, [loadContent]);

  // 搜索和过滤
  useEffect(() => {
    let result = [...scheduledContent];
    
    // 搜索
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(content => 
        content.title.en.toLowerCase().includes(term) ||
        content.title.zh.toLowerCase().includes(term) ||
        content.slug.toLowerCase().includes(term)
      );
    }
    
    // 按类型过滤
    if (filterType !== 'all') {
      result = result.filter(content => content.type === filterType);
    }
    
    // 排序
    if (sortBy === 'time') {
      result.sort((a, b) => {
        const dateA = a.scheduledPublishAt ? new Date(a.scheduledPublishAt).getTime() : 0;
        const dateB = b.scheduledPublishAt ? new Date(b.scheduledPublishAt).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortBy === 'title') {
      result.sort((a, b) => {
        const titleA = a.title.zh || a.title.en;
        const titleB = b.title.zh || b.title.en;
        return titleA.localeCompare(titleB);
      });
    }
    
    setFilteredContent(result);
  }, [scheduledContent, searchTerm, filterType, sortBy]);

  // 处理取消定时发布
  const handleCancelScheduled = (id: string) => {
    if (confirm('确定要取消这个定时发布任务吗？')) {
      // 实际项目中应该调用API取消
      setScheduledContent(prev => prev.filter(content => content.id !== id));
      setNotification({ type: 'success', message: '定时发布任务已取消' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              window.history.back();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回管理中心
          </button>
          <h1 className="text-2xl font-bold">定时发布管理</h1>
        </div>
        <button
          onClick={loadContent}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {/* 通知 */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              搜索
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索标题或slug..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容类型
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">全部类型</option>
              <option value="recommendation">推荐页</option>
              <option value="review">评测页</option>
              <option value="comparison">对比页</option>
              <option value="tutorial">教程页</option>
              <option value="resource">资源页</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序方式
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="time">按发布时间</option>
              <option value="title">按标题</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-600">{searchTerm || filterType !== 'all' ? '没有找到匹配的定时发布任务' : '暂无待发布的内容'}</p>
          {searchTerm || filterType !== 'all' && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内容标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    剩余时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {content.title.zh || content.title.en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {content.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {content.type === 'recommendation' && '推荐页'}
                        {content.type === 'review' && '评测页'}
                        {content.type === 'comparison' && '对比页'}
                        {content.type === 'tutorial' && '教程页'}
                        {content.type === 'resource' && '资源页'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.scheduledPublishAt && formatDateTime(content.scheduledPublishAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        content.scheduledPublishAt && getTimeRemaining(content.scheduledPublishAt) === '已到期'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {content.scheduledPublishAt && getTimeRemaining(content.scheduledPublishAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          编辑
                        </button>
                        <button 
                          onClick={() => handleCancelScheduled(content.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              共 {filteredContent.length} 个定时发布任务
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
