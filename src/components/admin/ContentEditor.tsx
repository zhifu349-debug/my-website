"use client";

import { useState, useEffect } from "react";
import {
  CMSContent,
  CMSPageContent,
  ContentSection,
  ContentStatus,
} from "@/lib/cms-types";
import MediaLibrary from "./MediaLibrary";

interface ContentEditorProps {
  content?: CMSContent;
  onSave: (content: Partial<CMSContent>) => Promise<void>;
  onCancel: () => void;
}

export default function ContentEditor({
  content,
  onSave,
  onCancel,
}: ContentEditorProps) {
  const [type, setType] = useState(content?.type || "recommendation");
  const [title, setTitle] = useState({
    en: content?.title.en || "",
    zh: content?.title.zh || "",
  });
  const [slug, setSlug] = useState(content?.slug || "");
  const [status, setStatus] = useState<ContentStatus>(
    content?.status || "draft",
  );
  const [seoTitle, setSeoTitle] = useState({
    en: content?.seo.title.en || "",
    zh: content?.seo.title.zh || "",
  });
  const [seoDesc, setSeoDesc] = useState({
    en: content?.seo.description.en || "",
    zh: content?.seo.description.zh || "",
  });
  const [featuredImage, setFeaturedImage] = useState(
    content?.featuredImage || "",
  );
  const [activeTab, setActiveTab] = useState<"en" | "zh">("en");

  // 内容编辑
  const [pageContent, setPageContent] = useState<{
    en: CMSPageContent;
    zh: CMSPageContent;
  }>({
    en: content?.content.en || { intro: "", sections: [] },
    zh: content?.content.zh || { intro: "", sections: [] },
  });

  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (locale: "en" | "zh", value: string) => {
    setTitle((prev) => ({ ...prev, [locale]: value }));
    if (locale === "en" && !content) {
      setSlug(generateSlug(value));
    }
  };

  const addSection = (type: ContentSection["type"]) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type,
      content: "",
      order: pageContent[activeTab].sections.length,
    };
    setPageContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sections: [...prev[activeTab].sections, newSection],
      },
    }));
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<ContentSection>,
  ) => {
    setPageContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sections: prev[activeTab].sections.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s,
        ),
      },
    }));
  };

  const deleteSection = (sectionId: string) => {
    setPageContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sections: prev[activeTab].sections.filter((s) => s.id !== sectionId),
      },
    }));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const sections = [...pageContent[activeTab].sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sections.length) return;

    [sections[index], sections[newIndex]] = [
      sections[newIndex],
      sections[index],
    ];

    setPageContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        sections: sections.map((s, i) => ({ ...s, order: i })),
      },
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    setIsSaving(true);

    const contentToSave: Partial<CMSContent> = {
      type,
      title,
      slug,
      status: publish ? "published" : "draft",
      seo: {
        title: seoTitle,
        description: seoDesc,
        keywords: { en: "", zh: "" },
        canonical: "",
      },
      content: pageContent,
      featuredImage,
      author: "admin",
      locale: "en",
    };

    try {
      await onSave(contentToSave);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold">
              {content ? "编辑内容" : "创建新内容"}
            </h1>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 基本设置 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容类型
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  disabled={!!content}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="recommendation">推荐页</option>
                  <option value="review">评测页</option>
                  <option value="comparison">对比页</option>
                  <option value="tutorial">教程页</option>
                  <option value="resource">资源页</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                  <option value="archived">归档</option>
                </select>
              </div>
            </div>

            {/* 标题 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  英文标题
                </label>
                <input
                  type="text"
                  value={title.en}
                  onChange={(e) => handleTitleChange("en", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter English title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  中文标题
                </label>
                <input
                  type="text"
                  value={title.zh}
                  onChange={(e) => handleTitleChange("zh", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="输入中文标题..."
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <div className="flex">
                <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500">
                  /{type}/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2"
                  placeholder="url-slug"
                />
              </div>
            </div>

            {/* 封面图 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                封面图片
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFeaturedImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMediaLibrary(true)}
                    className="w-full py-8 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    选择封面图片
                  </button>
                )}
              </div>
            </div>

            {/* SEO设置 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4">SEO 设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    英文标题
                  </label>
                  <input
                    type="text"
                    value={seoTitle.en}
                    onChange={(e) =>
                      setSeoTitle((prev) => ({ ...prev, en: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    建议长度: 50-60字符
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    英文描述
                  </label>
                  <textarea
                    value={seoDesc.en}
                    onChange={(e) =>
                      setSeoDesc((prev) => ({ ...prev, en: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={2}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    建议长度: 150-160字符
                  </p>
                </div>
              </div>
            </div>

            {/* 内容编辑 */}
            <div className="border border-gray-200 rounded-lg">
              {/* 语言切换 */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("en")}
                  className={`flex-1 px-4 py-3 font-medium ${
                    activeTab === "en"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveTab("zh")}
                  className={`flex-1 px-4 py-3 font-medium ${
                    activeTab === "zh"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                >
                  中文
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* 引言 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    引言
                  </label>
                  <textarea
                    value={pageContent[activeTab].intro}
                    onChange={(e) =>
                      setPageContent((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab],
                          intro: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                    placeholder="添加一段引言文字..."
                  />
                </div>

                {/* 内容区块 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    内容区块
                  </label>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => addSection("text")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      + 文本
                    </button>
                    <button
                      onClick={() => addSection("image")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      + 图片
                    </button>
                    <button
                      onClick={() => addSection("video")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      + 视频
                    </button>
                    <button
                      onClick={() => addSection("list")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      + 列表
                    </button>
                  </div>

                  {pageContent[activeTab].sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="border border-gray-200 rounded-lg p-4 mb-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {section.type}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveSection(index, "up")}
                            disabled={index === 0}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveSection(index, "down")}
                            disabled={
                              index ===
                              pageContent[activeTab].sections.length - 1
                            }
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>

                      {section.type === "text" && (
                        <textarea
                          value={section.content}
                          onChange={(e) =>
                            updateSection(section.id, {
                              content: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          rows={4}
                          placeholder="输入文本内容..."
                        />
                      )}

                      {section.type === "image" && (
                        <div>
                          {typeof section.content === "string" &&
                          section.content ? (
                            <img
                              src={section.content}
                              alt=""
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ) : (
                            <button
                              onClick={() => setShowMediaLibrary(true)}
                              className="w-full py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"
                            >
                              选择图片
                            </button>
                          )}
                          <input
                            type="text"
                            value={section.content || ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                content: e.target.value,
                              })
                            }
                            className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="图片URL"
                          />
                        </div>
                      )}

                      {section.type === "list" && (
                        <textarea
                          value={section.content}
                          onChange={(e) =>
                            updateSection(section.id, {
                              content: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          rows={4}
                          placeholder="每行一个列表项"
                        />
                      )}
                    </div>
                  ))}

                  {pageContent[activeTab].sections.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      点击上方按钮添加内容区块
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {isSaving ? "保存中..." : "保存草稿"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50"
            >
              {isSaving ? "发布中..." : "发布"}
            </button>
          </div>
        </div>
      </div>

      {/* 媒体库模态框 */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">媒体库</h2>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <MediaLibrary
                  onSelect={(media) => {
                    setFeaturedImage(media.url);
                    setShowMediaLibrary(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
