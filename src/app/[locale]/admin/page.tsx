"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageType } from "@/types/content";
import { seoEngine } from "@/lib/seo-engine";
import BeginnerGuide from "@/components/admin/BeginnerGuide";
import HelpPanel from "@/components/admin/HelpPanel";
import { NotificationProvider, notify } from "@/components/admin/Notification";
import { CMSContent } from "@/lib/cms-types";

// 懒加载组件
const ContentEditor = lazy(() => import("@/components/admin/ContentEditor"));
const MediaLibrary = lazy(() => import("@/components/admin/MediaLibrary"));
const SimpleEditor = lazy(() => import("@/components/admin/SimpleEditor"));
const VersionHistory = lazy(() => import("@/components/admin/VersionHistory"));

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPageId = searchParams?.get("edit");

  // 检查登录状态
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminToken');
    if (!isLoggedIn) {
      router.push('/zh/admin/login');
    }
  }, [router]);

  const [activeTab, setActiveTab] = useState<
    "content" | "media" | "users" | "permissions" | "seo" | "analytics" | "homepage" | "settings"
  >("content");
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<
    CMSContent | undefined
  >();
  const [useSimpleEditor, setUseSimpleEditor] = useState(true);
  const [homepageData, setHomepageData] = useState({
    title: { en: "Find the Best Tools & Services", zh: "寻找最佳工具与服务" },
    subtitle: {
      en: "In-depth reviews, comparisons, and tutorials to help you make informed decisions",
      zh: "深度评测、对比和教程，帮助您做出明智决策",
    },
    stats: { users: "10,000+", reviews: "500+", rating: "4.8" },
  });
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string>('');
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contentCache, setContentCache] = useState<Record<string, CMSContent[]>>({});
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // 批量操作完成回调
  const handleBatchActionComplete = async () => {
    // 清除缓存以保证数据一致性
    setContentCache({});
    await fetchContents();
  };

  // 防抖函数
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    // 使用防抖减少频繁请求
    const debouncedFetch = debounce(fetchContents, 300);
    debouncedFetch();
  }, [currentPage, pageSize]);

  // 如果 URL 中有 edit 参数，自动打开编辑器
  useEffect(() => {
    if (editPageId && contents.length > 0) {
      const contentToEdit = contents.find((c) => c.id === editPageId);
      if (contentToEdit) {
        setEditingContent(contentToEdit);
        setShowEditor(true);
      }
    }
  }, [editPageId, contents]);

  const fetchContents = async () => {
    try {
      const cacheKey = `page-${currentPage}-size-${pageSize}`;
      const now = Date.now();
      const cacheExpiry = 60000; // 缓存过期时间：1分钟

      // 检查缓存
      if (contentCache[cacheKey] && (now - lastFetchTime) < cacheExpiry) {
        setContents(contentCache[cacheKey]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/contents?page=${currentPage}&pageSize=${pageSize}`);
      const data = await res.json();
      if (data.success) {
        const contentData = data.data.contents || data.data;
        setContents(contentData);
        setTotalItems(data.data.total || contents.length);
        
        // 更新缓存
        setContentCache(prev => ({
          ...prev,
          [cacheKey]: contentData
        }));
        setLastFetchTime(now);
      } else {
        notify.error(`获取内容失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("Failed to fetch contents:", error);
      notify.error("获取内容失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = () => {
    setEditingContent(undefined);
    setShowEditor(true);
  };

  const handleEditContent = (content: CMSContent) => {
    setEditingContent(content);
    setShowEditor(true);
  };

  const handleSaveContent = async (content: Partial<CMSContent>) => {
    try {
      const url = editingContent
        ? `/api/contents/${editingContent.id}`
        : "/api/contents";

      const method = editingContent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setShowEditor(false);
        // 清除缓存以保证数据一致性
        setContentCache({});
        // 重置到第一页以查看最新内容
        setCurrentPage(1);
        await fetchContents();
        notify.success(editingContent ? "内容更新成功！" : "内容创建成功！");
      } else {
        const errorData = await res.json();
        notify.error(`保存失败：${errorData.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      notify.error("保存失败，请重试");
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm("确定要删除这条内容吗？")) return;

    try {
      const res = await fetch(`/api/contents/${id}`, { method: "DELETE" });
      if (res.ok) {
        // 清除缓存以保证数据一致性
        setContentCache({});
        // 如果删除后当前页为空，且不是第一页，则跳转到前一页
        if (contents.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        await fetchContents();
        notify.success("内容删除成功！");
      } else {
        const errorData = await res.json();
        notify.error(`删除失败：${errorData.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
      notify.error("删除失败，请重试");
    }
  };

  const handleViewVersionHistory = (contentId: string) => {
    setCurrentContentId(contentId);
    setShowVersionHistory(true);
  };

  const handleCloseVersionHistory = () => {
    setShowVersionHistory(false);
    setCurrentContentId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 新手引导 */}
      <BeginnerGuide />

      {/* 帮助面板 */}
      <HelpPanel />

      {/* 版本历史页面 */}
      {showVersionHistory ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Suspense fallback={<div className="flex justify-center items-center h-64"><p className="text-gray-500">加载版本历史...</p></div>}>
            <VersionHistory
              contentId={currentContentId}
              onBack={handleCloseVersionHistory}
            />
          </Suspense>
        </div>
      ) : (
        <>
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">内容管理系统</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    简单易用的网站内容管理工具
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">编辑器模式：</span>
                  <button
                    onClick={() => {
                      setUseSimpleEditor(true);
                      // 如果编辑器已经打开，关闭并重新打开以应用新模式
                      if (showEditor) {
                        setShowEditor(false);
                        setTimeout(() => setShowEditor(true), 100);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      useSimpleEditor
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    简单模式
                  </button>
                  <button
                    onClick={() => {
                      setUseSimpleEditor(false);
                      // 如果编辑器已经打开，关闭并重新打开以应用新模式
                      if (showEditor) {
                        setShowEditor(false);
                        setTimeout(() => setShowEditor(true), 100);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !useSimpleEditor
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    专业模式
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('adminToken');
                      router.push('/zh/admin/login');
                    }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    登出
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tabs */}
            <div className="mb-8">
              {/* 桌面导航 */}
              <nav className="hidden md:flex space-x-8 border-b border-gray-200">
                {
                  [
                    { id: "content", label: "内容管理" },
                    { id: "scheduled", label: "定时发布" },
                    { id: "media", label: "媒体库" },
                    { id: "users", label: "用户管理" },
                    { id: "permissions", label: "权限管理" },
                    { id: "seo", label: "SEO工具" },
                    { id: "analytics", label: "数据分析" },
                    { id: "homepage", label: "首页设置" },
                    { id: "settings", label: "系统配置" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      data-tab={tab.id}
                      onClick={() => {
                        if (tab.id === "users") {
                          router.push('/zh/admin/users');
                        } else if (tab.id === "scheduled") {
                          router.push('/zh/admin/scheduled');
                        } else {
                          setActiveTab(tab.id as "content" | "media" | "permissions" | "seo" | "analytics" | "homepage" | "settings");
                        }
                      }}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))
                }
              </nav>
              
              {/* 移动端下拉菜单 */}
              <div className="md:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => {
                    const tabId = e.target.value;
                    if (tabId === "users") {
                      router.push('/zh/admin/users');
                    } else if (tabId === "scheduled") {
                      router.push('/zh/admin/scheduled');
                    } else {
                      setActiveTab(tabId as "content" | "media" | "permissions" | "seo" | "analytics" | "homepage" | "settings");
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="content">📝 内容管理</option>
                  <option value="scheduled">⏰ 定时发布</option>
                  <option value="media">🖼️ 媒体库</option>
                  <option value="users">👥 用户管理</option>
                  <option value="permissions">🔒 权限管理</option>
                  <option value="seo">🔍 SEO工具</option>
                  <option value="analytics">📊 数据分析</option>
                  <option value="homepage">🏠 首页设置</option>
                  <option value="settings">⚙️ 系统配置</option>
                </select>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "content" && (
              <ContentManagementTab
                contents={contents}
                onCreate={handleCreateContent}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onViewVersionHistory={handleViewVersionHistory}
                onBatchActionComplete={handleBatchActionComplete}
                loading={loading}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            )}
            {activeTab === "media" && <MediaManagementTab />}
            {activeTab === "permissions" && <PermissionManagementTab />}
            {activeTab === "seo" && <SEOToolsTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "homepage" && (
              <HomepageSettingsTab data={homepageData} onChange={setHomepageData} />
            )}
            {activeTab === "settings" && <SystemSettingsTab />}
          </div>

          {/* Content Editor Modal */}
          {showEditor && (
            <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-lg shadow-xl"><p className="text-gray-500">加载编辑器...</p></div></div>}>
              {useSimpleEditor ? (
                <SimpleEditor
                  content={editingContent}
                  onSave={handleSaveContent}
                  onCancel={() => setShowEditor(false)}
                />
              ) : (
                <ContentEditor
                  content={editingContent}
                  onSave={handleSaveContent}
                  onCancel={() => setShowEditor(false)}
                />
              )}
            </Suspense>
          )}
        </>
      )}
    </div>
  );
}

function ContentManagementTab({ contents, onCreate, onEdit, onDelete, onViewVersionHistory, onBatchActionComplete, loading, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }: {
  contents: CMSContent[];
  onCreate: () => void;
  onEdit: (content: CMSContent) => void;
  onDelete: (id: string) => void;
  onViewVersionHistory: (contentId: string) => void;
  onBatchActionComplete: () => void;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "publish" | "draft" | "archive" | null
  >(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    // 添加拖拽时的视觉效果
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
      e.currentTarget.style.transform = 'scale(1.02)';
    }
  };

  // 处理拖拽结束
  const handleDragEnd = (e: React.DragEvent) => {
    // 恢复元素样式
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'scale(1)';
    }
    setDraggingId(null);
    setDragOverId(null);
  };

  // 处理拖拽经过
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggingId) {
      setDragOverId(id);
    }
  };

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingId && draggingId !== id) {
      // 这里可以实现实际的排序逻辑，例如调用API更新顺序
      notify.success('内容排序已更新');
      // 重置拖拽状态
      setDraggingId(null);
      setDragOverId(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContentIds(contents.map((content) => content.id));
    } else {
      setSelectedContentIds([]);
    }
  };

  const handleSelectContent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedContentIds((prev) => [...prev, id]);
    } else {
      setSelectedContentIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBatchAction = async (action: "delete" | "publish" | "draft" | "archive") => {
    if (selectedContentIds.length === 0) return;

    if (action === "delete") {
      setConfirmAction("delete");
      setShowConfirmDialog(true);
    } else {
      await performBatchAction(action);
    }
  };

  const performBatchAction = async (action: "delete" | "publish" | "draft" | "archive") => {
    try {
      if (action === "delete") {
        const deletePromises = selectedContentIds.map((id) =>
          fetch(`/api/contents/${id}`, { method: "DELETE" })
        );
        await Promise.all(deletePromises);
      } else {
        const status = action === "publish" ? "published" : action === "draft" ? "draft" : "archived";
        const updatePromises = selectedContentIds.map((id) =>
          fetch(`/api/contents/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        );
        await Promise.all(updatePromises);
      }
      
      // 调用父组件的回调函数来刷新内容列表
      onBatchActionComplete();
      // 清空选择
      setSelectedContentIds([]);
      
      // 显示成功通知
      const actionText = {
        delete: "删除",
        publish: "发布",
        draft: "设为草稿",
        archive: "归档"
      };
      notify.success(`批量${actionText[action]}成功！`);
    } catch (error) {
      console.error("Failed to perform batch action:", error);
      notify.error("批量操作失败，请重试");
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction) {
      await performBatchAction(confirmAction);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg font-semibold">所有内容</h2>
              <p className="text-sm text-gray-500 mt-1">管理和编辑网站内容</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onCreate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                创建新内容
              </button>
              {selectedContentIds.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedContentIds([]);
                    notify.info('已取消选择');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  清除选择
                </button>
              )}
            </div>
          </div>

        {/* 批量操作工具栏 */}
        {selectedContentIds.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-700 font-medium">
              已选择 {selectedContentIds.length} 项
            </span>
            <button
              onClick={() => handleBatchAction("publish")}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              批量发布
            </button>
            <button
              onClick={() => handleBatchAction("draft")}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              批量设为草稿
            </button>
            <button
              onClick={() => handleBatchAction("archive")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              批量归档
            </button>
            <button
              onClick={() => handleBatchAction("delete")}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedContentIds([])}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 ml-auto"
            >
              取消选择
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedContentIds.length === contents.length && contents.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  标题
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                  类型
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  状态
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  更新时间
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : contents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    暂无内容，点击上方按钮创建
                  </td>
                </tr>
              ) : (
                contents.map((content: CMSContent) => (
                  <tr 
                    key={content.id} 
                    className={`${selectedContentIds.includes(content.id) ? "bg-blue-50" : ""} ${dragOverId === content.id ? "bg-gray-100 border-l-4 border-blue-500" : ""} ${draggingId === content.id ? "opacity-50 transform scale-102" : ""} transition-all duration-200 relative`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, content.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, content.id)}
                    onDrop={(e) => handleDrop(e, content.id)}
                  >
                    <td className="px-3 sm:px-4 py-4">
                      <div className="flex items-center">
                        <svg 
                          className="w-5 h-5 text-gray-400 mr-2 cursor-grab active:cursor-grabbing" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                        </svg>
                        <input
                          type="checkbox"
                          checked={selectedContentIds.includes(content.id)}
                          onChange={(e) => handleSelectContent(content.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {content.title.en}
                        </p>
                        <p className="text-sm text-gray-500">
                          {content.title.zh}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 capitalize hidden sm:table-cell">
                      {content.type}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          content.status === "published"
                            ? "bg-green-100 text-green-800"
                            : content.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {content.status === "published"
                          ? "已发布"
                          : content.status === "draft"
                            ? "草稿"
                            : "归档"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(content.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onEdit(content)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => onViewVersionHistory(content.id)}
                          className="text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-md hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        >
                          版本历史
                        </button>
                        <button
                          onClick={() => onDelete(content.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控件 */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-700">每页：</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500">
                共 {totalItems} 条
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="首页"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="上一页"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-gray-50 min-w-[50px] text-center">
              {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage * pageSize >= totalItems || loading}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="下一页"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => onPageChange(Math.ceil(totalItems / pageSize))}
              disabled={currentPage * pageSize >= totalItems || loading}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="末页"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">确认操作</h3>
            <p className="text-gray-600 mb-6">
              确定要删除选中的 {selectedContentIds.length} 条内容吗？此操作不可撤销。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaManagementTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">媒体库</h2>
        <Suspense fallback={<div className="flex justify-center items-center h-64"><p className="text-gray-500">加载媒体库...</p></div>}>
          <MediaLibrary />
        </Suspense>
      </div>
    </div>
  );
}

function SEOToolsTab() {
  const [selectedType, setSelectedType] = useState<PageType>(
    PageType.RECOMMENDATION,
  );
  const [keyword, setKeyword] = useState("");

  const generateSEO = () => {
    if (!keyword) return null;

    const seo = seoEngine.generateSEO(selectedType, {
      keyword,
      category: selectedType,
    });
    const schema = seoEngine.generateSchema(
      selectedType,
      { title: seo.title, description: seo.description, keyword },
      "/test",
    );
    const headings = seoEngine.generateHeadingSuggestions(selectedType, {
      keyword,
    });

    return { seo, schema, headings };
  };

  const generated = keyword ? generateSEO() : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">SEO Generator</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as PageType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {Object.values(PageType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., best vps 2026"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <button
            onClick={() => setKeyword(keyword)}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary"
          >
            Generate SEO
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Generated SEO Data</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Title</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {generated.seo.title}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {generated.seo.description}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Suggested Headings
              </h3>
              <ul className="space-y-1">
                {generated.headings.map((heading, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                  >
                    H2: {heading}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Schema.org Data
              </h3>
              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
                {JSON.stringify(generated.schema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Internal Link Generator</h2>
        <p className="text-sm text-gray-600 mb-4">
          Automatically generate internal links based on content relationships
        </p>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary">
          Generate Internal Links
        </button>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">24,567</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Ad Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">$1,234</p>
          <p className="text-xs text-green-600 mt-1">↑ 8% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Affiliate Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">$2,456</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">3.4%</p>
          <p className="text-xs text-red-600 mt-1">↓ 0.5% vs last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Top Performing Pages</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-medium text-sm sm:text-base">Best VPS 2026</h3>
              <p className="text-xs sm:text-sm text-gray-500">Recommendation Page</p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <p className="font-bold text-sm sm:text-base">5,234 views</p>
              <p className="text-xs sm:text-sm text-gray-500">$892 revenue</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-medium text-sm sm:text-base">Vultr Review</h3>
              <p className="text-xs sm:text-sm text-gray-500">Review Page</p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <p className="font-bold text-sm sm:text-base">3,456 views</p>
              <p className="text-xs sm:text-sm text-gray-500">$456 revenue</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="font-medium text-sm sm:text-base">V2Ray Setup</h3>
              <p className="text-xs sm:text-sm text-gray-500">Tutorial Page</p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <p className="font-bold text-sm sm:text-base">2,890 views</p>
              <p className="text-xs sm:text-sm text-gray-500">$234 revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Optimization Suggestions</h2>
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h3 className="font-medium text-yellow-800 text-sm sm:text-base">Low Conversion Rate</h3>
            <p className="text-xs sm:text-sm text-yellow-700 mt-1">
              &quot;V2Ray Setup&quot; has high traffic but low conversions. Consider updating CTAs.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h3 className="font-medium text-green-800 text-sm sm:text-base">High Performing Page</h3>
            <p className="text-xs sm:text-sm text-green-700 mt-1">
              &quot;Best VPS 2026&quot; is performing well. Consider creating similar content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HomepageData {
  title: {
    en: string;
    zh: string;
  };
  subtitle: {
    en: string;
    zh: string;
  };
  stats: {
    users: string;
    reviews: string;
    rating: string;
  };
}

function HomepageSettingsTab({
  data,
  onChange,
}: {
  data: HomepageData;
  onChange: (data: HomepageData) => void;
}) {
  const handleSave = () => {
    try {
      // 验证数据
      if (!data.title.en || !data.title.zh) {
        notify.error("请填写中英文标题");
        return;
      }
      
      if (!data.subtitle.en || !data.subtitle.zh) {
        notify.error("请填写中英文副标题");
        return;
      }

      localStorage.setItem("homepageData", JSON.stringify(data));
      notify.success("首页设置已保存！修改将在刷新页面后生效。");
    } catch (error) {
      console.error("Failed to save homepage settings:", error);
      notify.error('保存失败，请检查浏览器存储权限后重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">首页内容设置</h2>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all"
          >
            保存更改
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文标题
            </label>
            <input
              type="text"
              value={data.title.en}
              onChange={(e) =>
                onChange({
                  ...data,
                  title: { ...data.title, en: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="例如：Find the Best Tools & Services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文标题
            </label>
            <input
              type="text"
              value={data.title.zh}
              onChange={(e) =>
                onChange({
                  ...data,
                  title: { ...data.title, zh: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="例如：寻找最佳工具与服务"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文副标题
            </label>
            <textarea
              value={data.subtitle.en}
              onChange={(e) =>
                onChange({
                  ...data,
                  subtitle: { ...data.subtitle, en: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 text-sm"
              placeholder="例如：In-depth reviews, comparisons, and tutorials..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文副标题
            </label>
            <textarea
              value={data.subtitle.zh}
              onChange={(e) =>
                onChange({
                  ...data,
                  subtitle: { ...data.subtitle, zh: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 text-sm"
              placeholder="例如：深度评测、对比和教程..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户数量
              </label>
              <input
                type="text"
                value={data.stats.users}
                onChange={(e) =>
                  onChange({
                    ...data,
                    stats: { ...data.stats, users: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="例如：10,000+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评论数量
              </label>
              <input
                type="text"
                value={data.stats.reviews}
                onChange={(e) =>
                  onChange({
                    ...data,
                    stats: { ...data.stats, reviews: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="例如：500+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                平均评分
              </label>
              <input
                type="text"
                value={data.stats.rating}
                onChange={(e) =>
                  onChange({
                    ...data,
                    stats: { ...data.stats, rating: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="例如：4.8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 提示</h3>
        <p className="text-sm text-blue-700">
          修改首页内容后，点击&ldquo;保存更改&rdquo;按钮。修改会在刷新页面后生效。
        </p>
      </div>
    </div>
  );
}

function PermissionManagementTab() {
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [permissions, setPermissions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // 获取权限数据
  useEffect(() => {
    fetchPermissions();
  }, []);

  // 当选择角色变化时，更新权限数据
  useEffect(() => {
    if (rolePermissions.length > 0) {
      const rolePermission = rolePermissions.find(rp => rp.role === selectedRole);
      if (rolePermission) {
        setPermissions(rolePermission.permissions);
      }
    }
  }, [selectedRole, rolePermissions]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/permissions');
      const data = await response.json();
      if (data.success) {
        setRolePermissions(data.data);
        if (data.data.length > 0) {
          setSelectedRole(data.data[0].role);
          setPermissions(data.data[0].permissions);
        }
      } else {
        notify.error(`获取权限失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      notify.error('获取权限失败，请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (moduleId: string, actionId: string, value: boolean) => {
    setPermissions((prev: any) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [actionId]: value
      }
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: selectedRole,
          permissions
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // 重新获取权限数据以确保一致性
        fetchPermissions();
        notify.success('权限保存成功！');
      } else {
        notify.error(`保存失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error('Failed to save permissions:', error);
      notify.error('保存失败，请检查网络连接后重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">权限管理</h2>
            <div className="flex items-center gap-3">
              <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50">
                <div className="animate-pulse h-4 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    模块
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    查看
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    编辑
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    删除
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    管理
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    {['view', 'create', 'update', 'delete', 'manage'].map(actionId => (
                      <td key={actionId} className="px-4 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <div className="animate-pulse h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-blue-200 rounded w-32"></div>
            <div className="h-3 bg-blue-200 rounded w-64"></div>
            <div className="h-3 bg-blue-200 rounded w-56"></div>
            <div className="h-3 bg-blue-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">权限管理</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {rolePermissions.map(role => (
                <option key={role.role} value={role.role}>
                  {role.role === 'admin' ? '管理员' : role.role === 'editor' ? '编辑' : '查看者'}
                </option>
              ))}
            </select>
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'}`}
            >
              {saving ? '保存中...' : '保存权限'}
            </button>
          </div>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 rounded-lg p-4 mb-6">
            权限保存成功！
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  模块
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  查看
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  编辑
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  删除
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  管理
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(permissions).map(([moduleId, modulePermissions]) => (
                <tr key={moduleId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {moduleId === 'users' ? '用户管理' : 
                       moduleId === 'contents' ? '内容管理' : 
                       moduleId === 'media' ? '媒体管理' : 
                       moduleId === 'permissions' ? '权限管理' : 
                       moduleId === 'settings' ? '系统设置' : moduleId}
                    </div>
                  </td>
                  {['view', 'create', 'update', 'delete', 'manage'].map(actionId => (
                    <td key={actionId} className="px-4 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={(modulePermissions as any)[actionId] || false}
                          onChange={(e) => handlePermissionChange(moduleId, actionId, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 权限说明</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• <strong>管理员</strong>：拥有所有模块的所有权限</li>
          <li>• <strong>编辑</strong>：可以管理内容和媒体，但不能管理用户和权限</li>
          <li>• <strong>查看者</strong>：只能查看内容，不能进行修改操作</li>
          <li>• 您可以根据需要调整各角色的具体权限</li>
        </ul>
      </div>
    </div>
  );
}

function SystemSettingsTab() {
  const [activeSection, setActiveSection] = useState<"basic" | "third-party" | "ip-restriction">('basic');
  const [settings, setSettings] = useState({
    basic: {
      siteTitle: {
        en: "Find the Best Tools & Services",
        zh: "寻找最佳工具与服务"
      },
      siteDescription: {
        en: "In-depth reviews, comparisons, and tutorials to help you make informed decisions",
        zh: "深度评测、对比和教程，帮助您做出明智决策"
      },
      logo: {
        url: "/icon.svg",
        alt: "Website Logo"
      },
      contact: {
        email: "contact@example.com",
        phone: "+1 234 567 890",
        address: "123 Main St, City, Country"
      },
      timezone: "Asia/Shanghai",
      language: "zh"
    },
    thirdParty: {
      socialMedia: {
        facebook: "https://facebook.com/example",
        twitter: "https://twitter.com/example",
        instagram: "https://instagram.com/example",
        linkedin: "https://linkedin.com/company/example"
      },
      paymentGateways: {
        stripe: {
          enabled: false,
          apiKey: ""
        },
        paypal: {
          enabled: false,
          clientId: ""
        }
      },
      analytics: {
        googleAnalytics: "",
        googleTagManager: ""
      },
      otherServices: {
        mailchimp: "",
        sendgrid: ""
      }
    },
    ipRestriction: {
      enabled: false,
      allowedIPs: ["127.0.0.1"],
      blockedIPs: [] as string[],
      rateLimit: {
        enabled: false,
        requests: 100,
        windowMs: 60000
      }
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    // 模拟加载延迟，实际应用中可能需要从API获取数据
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="animate-pulse h-6 bg-gray-300 rounded w-32"></div>
            <div className="animate-pulse h-8 bg-gray-300 rounded-lg w-32"></div>
          </div>

          <div className="animate-pulse mb-6">
            <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>
          </div>

          {/* Navigation for settings sections */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-6">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="animate-pulse py-3 px-1">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
              ))}
            </nav>
          </div>

          {/* Basic Information Section Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="animate-pulse h-4 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((_, index) => (
                  <div key={index}>
                    <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="animate-pulse h-4 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((_, index) => (
                  <div key={index}>
                    <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="animate-pulse h-4 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index}>
                    <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-blue-200 rounded w-32"></div>
            <div className="h-3 bg-blue-200 rounded w-64"></div>
            <div className="h-3 bg-blue-200 rounded w-56"></div>
            <div className="h-3 bg-blue-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      notify.success('系统配置已保存！');
    } catch (error) {
      console.error('Failed to save settings:', error);
      notify.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAllowedIP = () => {
    setSettings(prev => ({
      ...prev,
      ipRestriction: {
        ...prev.ipRestriction,
        allowedIPs: [...prev.ipRestriction.allowedIPs, ""]
      }
    }));
  };

  const handleRemoveAllowedIP = (index: number) => {
    setSettings(prev => ({
      ...prev,
      ipRestriction: {
        ...prev.ipRestriction,
        allowedIPs: prev.ipRestriction.allowedIPs.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddBlockedIP = () => {
    setSettings(prev => ({
      ...prev,
      ipRestriction: {
        ...prev.ipRestriction,
        blockedIPs: [...prev.ipRestriction.blockedIPs, ""]
      }
    }));
  };

  const handleRemoveBlockedIP = (index: number) => {
    setSettings(prev => ({
      ...prev,
      ipRestriction: {
        ...prev.ipRestriction,
        blockedIPs: prev.ipRestriction.blockedIPs.filter((_, i) => i !== index)
      }
    }));
  };

  const handleIPChange = (type: 'allowed' | 'blocked', index: number, value: string) => {
    if (type === 'allowed') {
      setSettings(prev => {
        const newAllowedIPs = [...prev.ipRestriction.allowedIPs];
        newAllowedIPs[index] = value;
        return {
          ...prev,
          ipRestriction: {
            ...prev.ipRestriction,
            allowedIPs: newAllowedIPs
          }
        };
      });
    } else {
      setSettings(prev => {
        const newBlockedIPs = [...prev.ipRestriction.blockedIPs];
        newBlockedIPs[index] = value;
        return {
          ...prev,
          ipRestriction: {
            ...prev.ipRestriction,
            blockedIPs: newBlockedIPs
          }
        };
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">系统配置</h2>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'}`}
          >
            {saving ? '保存中...' : '保存配置'}
          </button>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 rounded-lg p-4 mb-6">
            配置保存成功！
          </div>
        )}

        {/* Navigation for settings sections */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-6">
            {[
              { id: "basic", label: "网站基本信息" },
              { id: "third-party", label: "第三方服务集成" },
              { id: "ip-restriction", label: "IP访问限制" }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as "basic" | "third-party" | "ip-restriction")}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeSection === section.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Information Section */}
        {activeSection === "basic" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">网站标题</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">英文标题</label>
                  <input
                    type="text"
                    value={settings.basic.siteTitle.en}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        siteTitle: {
                          ...prev.basic.siteTitle,
                          en: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">中文标题</label>
                  <input
                    type="text"
                    value={settings.basic.siteTitle.zh}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        siteTitle: {
                          ...prev.basic.siteTitle,
                          zh: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">网站描述</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">英文描述</label>
                  <textarea
                    value={settings.basic.siteDescription.en}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        siteDescription: {
                          ...prev.basic.siteDescription,
                          en: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">中文描述</label>
                  <textarea
                    value={settings.basic.siteDescription.zh}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        siteDescription: {
                          ...prev.basic.siteDescription,
                          zh: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">网站Logo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Logo URL</label>
                  <input
                    type="text"
                    value={settings.basic.logo.url}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        logo: {
                          ...prev.basic.logo,
                          url: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Logo Alt Text</label>
                  <input
                    type="text"
                    value={settings.basic.logo.alt}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        logo: {
                          ...prev.basic.logo,
                          alt: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    {settings.basic.logo.url && (
                      <img src={settings.basic.logo.url} alt={settings.basic.logo.alt} className="max-w-full max-h-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">当前Logo预览</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">联系方式</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">电子邮箱</label>
                  <input
                    type="email"
                    value={settings.basic.contact.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        contact: {
                          ...prev.basic.contact,
                          email: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">电话号码</label>
                  <input
                    type="tel"
                    value={settings.basic.contact.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        contact: {
                          ...prev.basic.contact,
                          phone: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">地址</label>
                  <input
                    type="text"
                    value={settings.basic.contact.address}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        contact: {
                          ...prev.basic.contact,
                          address: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">网站设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">时区</label>
                  <select
                    value={settings.basic.timezone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        timezone: e.target.value
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Asia/Shanghai">Asia/Shanghai (中国)</option>
                    <option value="America/New_York">America/New_York (美国东部)</option>
                    <option value="Europe/London">Europe/London (英国)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (日本)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">默认语言</label>
                  <select
                    value={settings.basic.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      basic: {
                        ...prev.basic,
                        language: e.target.value
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="zh">中文</option>
                    <option value="en">英文</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Third-party Services Section */}
        {activeSection === "third-party" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">社交媒体</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.thirdParty.socialMedia).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {key === 'facebook' ? 'Facebook' : 
                       key === 'twitter' ? 'Twitter' : 
                       key === 'instagram' ? 'Instagram' : 'LinkedIn'}
                    </label>
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        thirdParty: {
                          ...prev.thirdParty,
                          socialMedia: {
                            ...prev.thirdParty.socialMedia,
                            [key]: e.target.value
                          }
                        }
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder={`https://${key}.com/your-profile`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">支付网关</h3>
              <div className="space-y-6">
                {Object.entries(settings.thirdParty.paymentGateways).map(([key, gateway]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        {key === 'stripe' ? 'Stripe' : 'PayPal'}
                      </h4>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={gateway.enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            thirdParty: {
                              ...prev.thirdParty,
                              paymentGateways: {
                                ...prev.thirdParty.paymentGateways,
                                [key]: {
                                  ...gateway,
                                  enabled: e.target.checked
                                }
                              }
                            }
                          }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">启用</span>
                      </label>
                    </div>
                    {gateway.enabled && (
                      <div className="space-y-3">
                        {key === 'stripe' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">API Key</label>
                            <input
                              type="text"
                              value={(gateway as any).apiKey}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                thirdParty: {
                                  ...prev.thirdParty,
                                  paymentGateways: {
                                    ...prev.thirdParty.paymentGateways,
                                    stripe: {
                                      ...gateway,
                                      apiKey: e.target.value
                                    }
                                  }
                                }
                              }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="sk_live_..."
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Client ID</label>
                            <input
                              type="text"
                              value={(gateway as any).clientId}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                thirdParty: {
                                  ...prev.thirdParty,
                                  paymentGateways: {
                                    ...prev.thirdParty.paymentGateways,
                                    paypal: {
                                      ...gateway,
                                      clientId: e.target.value
                                    }
                                  }
                                }
                              }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="AeB..."
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">分析工具</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Google Analytics</label>
                  <input
                    type="text"
                    value={settings.thirdParty.analytics.googleAnalytics}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      thirdParty: {
                        ...prev.thirdParty,
                        analytics: {
                          ...prev.thirdParty.analytics,
                          googleAnalytics: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="UA-XXXXXXXX-X or G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Google Tag Manager</label>
                  <input
                    type="text"
                    value={settings.thirdParty.analytics.googleTagManager}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      thirdParty: {
                        ...prev.thirdParty,
                        analytics: {
                          ...prev.thirdParty.analytics,
                          googleTagManager: e.target.value
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">其他服务</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.thirdParty.otherServices).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {key === 'mailchimp' ? 'Mailchimp API Key' : 'SendGrid API Key'}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        thirdParty: {
                          ...prev.thirdParty,
                          otherServices: {
                            ...prev.thirdParty.otherServices,
                            [key]: e.target.value
                          }
                        }
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IP Restriction Section */}
        {activeSection === "ip-restriction" && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={settings.ipRestriction.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  ipRestriction: {
                    ...prev.ipRestriction,
                    enabled: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">启用IP访问限制</label>
            </div>

            {settings.ipRestriction.enabled && (
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-700">允许访问的IP地址</h3>
                    <button
                      onClick={handleAddAllowedIP}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      添加IP
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.ipRestriction.allowedIPs.map((ip, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={ip}
                          onChange={(e) => handleIPChange('allowed', index, e.target.value)}
                          placeholder="输入IP地址或CIDR范围"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                        />
                        <button
                          onClick={() => handleRemoveAllowedIP(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    提示：留空允许所有IP访问。您可以输入单个IP地址（如 192.168.1.1）或CIDR范围（如 192.168.1.0/24）。
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-700">阻止访问的IP地址</h3>
                    <button
                      onClick={handleAddBlockedIP}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      添加IP
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.ipRestriction.blockedIPs.map((ip, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={ip}
                          onChange={(e) => handleIPChange('blocked', index, e.target.value)}
                          placeholder="输入IP地址或CIDR范围"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                        />
                        <button
                          onClick={() => handleRemoveBlockedIP(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">速率限制</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.ipRestriction.rateLimit.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        ipRestriction: {
                          ...prev.ipRestriction,
                          rateLimit: {
                            ...prev.ipRestriction.rateLimit,
                            enabled: e.target.checked
                          }
                        }
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">启用速率限制</label>
                  </div>
                  {settings.ipRestriction.rateLimit.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">时间窗口内的最大请求数</label>
                        <input
                          type="number"
                          value={settings.ipRestriction.rateLimit.requests}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            ipRestriction: {
                              ...prev.ipRestriction,
                              rateLimit: {
                                ...prev.ipRestriction.rateLimit,
                                requests: parseInt(e.target.value) || 0
                              }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">时间窗口（毫秒）</label>
                        <input
                          type="number"
                          value={settings.ipRestriction.rateLimit.windowMs}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            ipRestriction: {
                              ...prev.ipRestriction,
                              rateLimit: {
                                ...prev.ipRestriction.rateLimit,
                                windowMs: parseInt(e.target.value) || 0
                              }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 配置说明</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• 所有配置更改需要点击"保存配置"按钮才能生效</li>
          <li>• 网站基本信息将应用于整个网站的标题、描述等元数据</li>
          <li>• 第三方服务集成需要正确填写API密钥等信息</li>
          <li>• IP访问限制可以保护网站免受未授权访问</li>
          <li>• 在生产环境中，请确保启用适当的安全设置</li>
        </ul>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <NotificationProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminContent />
      </Suspense>
    </NotificationProvider>
  );
}
