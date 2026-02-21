"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageType } from "@/types/content";
import { seoEngine } from "@/lib/seo-engine";
import ContentEditor from "@/components/admin/ContentEditor";
import MediaLibrary from "@/components/admin/MediaLibrary";
import SimpleEditor from "@/components/admin/SimpleEditor";
import BeginnerGuide from "@/components/admin/BeginnerGuide";
import HelpPanel from "@/components/admin/HelpPanel";
import { CMSContent } from "@/lib/cms-types";

function AdminContent() {
  const searchParams = useSearchParams();
  const editPageId = searchParams?.get("edit");

  const [activeTab, setActiveTab] = useState<
    "content" | "media" | "seo" | "analytics" | "homepage"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 新手引导 */}
      <BeginnerGuide />

      {/* 帮助面板 */}
      <HelpPanel />

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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: "content", label: "内容管理" },
              { id: "media", label: "媒体库" },
              { id: "seo", label: "SEO工具" },
              { id: "analytics", label: "数据分析" },
              { id: "homepage", label: "首页设置" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "content" && (
          <ContentManagementTab
            contents={contents}
            onCreate={handleCreateContent}
            onEdit={handleEditContent}
            onDelete={handleDeleteContent}
          />
        )}
        {activeTab === "media" && <MediaManagementTab />}
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
    </div>
  );
}

function ContentManagementTab({ contents, onCreate, onEdit, onDelete }: any) {
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    暂无内容，点击上方按钮创建
                  </td>
                </tr>
              ) : (
                contents.map((content: CMSContent) => (
                  <tr key={content.id}>
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
              "V2Ray Setup" has high traffic but low conversions. Consider
              updating CTAs.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800">High Performing Page</h3>
            <p className="text-sm text-green-700 mt-1">
              "Best VPS 2026" is performing well. Consider creating similar
              content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomepageSettingsTab({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
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
          修改首页内容后，点击"保存更改"按钮。修改会在刷新页面后生效。
        </p>
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
