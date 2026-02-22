"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageType } from "@/types/content";
import { seoEngine } from "@/lib/seo-engine";
import ContentEditor from "@/components/admin/ContentEditor";
import MediaLibrary from "@/components/admin/MediaLibrary";
import SimpleEditor from "@/components/admin/SimpleEditor";
import VersionHistory from "@/components/admin/VersionHistory";
import BeginnerGuide from "@/components/admin/BeginnerGuide";
import HelpPanel from "@/components/admin/HelpPanel";
import { CMSContent } from "@/lib/cms-types";

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
    "content" | "media" | "users" | "permissions" | "seo" | "analytics" | "homepage"
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

  useEffect(() => {
    fetchContents();
  }, []);

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
      const res = await fetch("/api/contents");
      const data = await res.json();
      if (data.success) {
        setContents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch contents:", error);
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
        await fetchContents();
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      alert("保存失败，请重试");
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm("确定要删除这条内容吗？")) return;

    try {
      const res = await fetch(`/api/contents/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchContents();
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
      alert("删除失败，请重试");
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
          <VersionHistory
            contentId={currentContentId}
            onBack={handleCloseVersionHistory}
          />
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
                    onClick={() => setUseSimpleEditor(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      useSimpleEditor
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    简单模式
                  </button>
                  <button
                    onClick={() => setUseSimpleEditor(false)}
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
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex space-x-8">
                {
                  [
                    { id: "content", label: "内容管理" },
                    { id: "media", label: "媒体库" },
                    { id: "users", label: "用户管理" },
                    { id: "permissions", label: "权限管理" },
                    { id: "seo", label: "SEO工具" },
                    { id: "analytics", label: "数据分析" },
                    { id: "homepage", label: "首页设置" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === "users") {
                          router.push('/zh/admin/users');
                        } else {
                          setActiveTab(tab.id as "content" | "media" | "permissions" | "seo" | "analytics" | "homepage");
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
            </div>

            {/* Tab Content */}
            {activeTab === "content" && (
              <ContentManagementTab
                contents={contents}
                onCreate={handleCreateContent}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onViewVersionHistory={handleViewVersionHistory}
                onBatchActionComplete={fetchContents}
              />
            )}
            {activeTab === "media" && <MediaManagementTab />}
            {activeTab === "permissions" && <PermissionManagementTab />}
            {activeTab === "seo" && <SEOToolsTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "homepage" && (
              <HomepageSettingsTab data={homepageData} onChange={setHomepageData} />
            )}
          </div>

          {/* Content Editor Modal */}
          {showEditor && (
            <>
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
            </>
          )}
        </>
      )}
    </div>
  );
}

function ContentManagementTab({ contents, onCreate, onEdit, onDelete, onViewVersionHistory, onBatchActionComplete }: {
  contents: CMSContent[];
  onCreate: () => void;
  onEdit: (content: CMSContent) => void;
  onDelete: (id: string) => void;
  onViewVersionHistory: (contentId: string) => void;
  onBatchActionComplete: () => void;
}) {
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "publish" | "draft" | "archive" | null
  >(null);

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
    } catch (error) {
      console.error("Failed to perform batch action:", error);
      alert("批量操作失败，请重试");
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">所有内容</h2>
          <button
            onClick={onCreate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all"
          >
            + 创建新内容
          </button>
        </div>

        {/* 批量操作工具栏 */}
        {selectedContentIds.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-700">
              已选择 {selectedContentIds.length} 项
            </span>
            <button
              onClick={() => handleBatchAction("publish")}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
            >
              批量发布
            </button>
            <button
              onClick={() => handleBatchAction("draft")}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
            >
              批量设为草稿
            </button>
            <button
              onClick={() => handleBatchAction("archive")}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              批量归档
            </button>
            <button
              onClick={() => handleBatchAction("delete")}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedContentIds([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors ml-auto"
            >
              取消选择
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedContentIds.length === contents.length && contents.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  更新时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.length === 0 ? (
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
                  <tr key={content.id} className={selectedContentIds.includes(content.id) ? "bg-blue-50" : ""}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedContentIds.includes(content.id)}
                        onChange={(e) => handleSelectContent(content.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {content.title.en}
                        </p>
                        <p className="text-sm text-gray-500">
                          {content.title.zh}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {content.type}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(content.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(content)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => onViewVersionHistory(content.id)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          版本历史
                        </button>
                        <button
                          onClick={() => onDelete(content.id)}
                          className="text-red-600 hover:text-red-800"
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
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">确认操作</h3>
            <p className="text-gray-600 mb-6">
              确定要删除选中的 {selectedContentIds.length} 条内容吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
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
        <MediaLibrary />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">24,567</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Ad Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$1,234</p>
          <p className="text-sm text-green-600 mt-2">↑ 8% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Affiliate Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$2,456</p>
          <p className="text-sm text-green-600 mt-2">↑ 15% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">3.4%</p>
          <p className="text-sm text-red-600 mt-2">↓ 0.5% vs last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Top Performing Pages</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h3 className="font-medium">Best VPS 2026</h3>
              <p className="text-sm text-gray-500">Recommendation Page</p>
            </div>
            <div className="text-right">
              <p className="font-bold">5,234 views</p>
              <p className="text-sm text-gray-500">$892 revenue</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h3 className="font-medium">Vultr Review</h3>
              <p className="text-sm text-gray-500">Review Page</p>
            </div>
            <div className="text-right">
              <p className="font-bold">3,456 views</p>
              <p className="text-sm text-gray-500">$456 revenue</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">V2Ray Setup</h3>
              <p className="text-sm text-gray-500">Tutorial Page</p>
            </div>
            <div className="text-right">
              <p className="font-bold">2,890 views</p>
              <p className="text-sm text-gray-500">$234 revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Optimization Suggestions</h2>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800">Low Conversion Rate</h3>
            <p className="text-sm text-yellow-700 mt-1">
              &quot;V2Ray Setup&quot; has high traffic but low conversions. Consider
              updating CTAs.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800">High Performing Page</h3>
            <p className="text-sm text-green-700 mt-1">
              &quot;Best VPS 2026&quot; is performing well. Consider creating similar
              content.
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
    localStorage.setItem("homepageData", JSON.stringify(data));
    alert("首页设置已保存！");
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
              className="w-full border border-gray-300 rounded-md px-3 py-2"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
              placeholder="例如：深度评测、对比和教程..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (moduleId: string, actionId: string, value: boolean) => {
    setPermissions(prev => ({
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
      } else {
        alert('保存失败：' + data.error);
      }
    } catch (error) {
      console.error('Failed to save permissions:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">加载权限数据中...</p>
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
                          checked={modulePermissions[actionId] || false}
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

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
}
