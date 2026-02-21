"use client";

import { useState } from "react";
import { CMSContent, ContentStatus } from "@/lib/cms-types";
import MediaLibrary from "./MediaLibrary";

interface SimpleEditorProps {
  content?: CMSContent;
  onSave: (content: Partial<CMSContent>) => Promise<void>;
  onCancel: () => void;
}

export default function SimpleEditor({
  content,
  onSave,
  onCancel,
}: SimpleEditorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // 步骤1：基本信息
  const [type, setType] = useState(content?.type || "recommendation");
  const [title, setTitle] = useState(content?.title.en || "");
  const [status, setStatus] = useState<ContentStatus>(
    content?.status || "draft",
  );

  // 步骤2：内容
  const [intro, setIntro] = useState(content?.content.en.intro || "");
  const [mainContent, setMainContent] = useState(
    content?.content.en.sections.map((s) => s.content).join("\n\n") || "",
  );
  const [featuredImage, setFeaturedImage] = useState(
    content?.featuredImage || "",
  );

  // 步骤3：确认
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const typeOptions = [
    {
      value: "recommendation",
      label: "推荐文章",
      icon: "⭐",
      desc: '推荐多个产品，像"最好的VPS主机"',
    },
    {
      value: "review",
      label: "产品评测",
      icon: "📊",
      desc: "深度评测一个产品",
    },
    {
      value: "comparison",
      label: "产品对比",
      icon: "⚖️",
      desc: "对比两个或多个产品",
    },
    {
      value: "tutorial",
      label: "教程指南",
      icon: "📚",
      desc: '分步教程，如"如何使用V2Ray"',
    },
    {
      value: "resource",
      label: "资源分享",
      icon: "📦",
      desc: "分享付费资源或工具",
    },
  ];

  const handleSave = async (publish: boolean = false) => {
    setIsSaving(true);

    const sections = mainContent
      .split("\n\n")
      .filter(Boolean)
      .map((text, index) => ({
        id: `section-${index}`,
        type: "text" as const,
        content: text.trim(),
        order: index,
      }));

    const contentToSave: Partial<CMSContent> = {
      type,
      title: { en: title, zh: title },
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
      status: publish ? "published" : "draft",
      seo: {
        title: { en: title, zh: title },
        description: { en: intro, zh: intro },
        keywords: { en: "", zh: "" },
        canonical: "",
      },
      content: {
        en: { intro, sections, faq: [] },
        zh: { intro, sections, faq: [] },
      },
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
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl">
          {/* 头部 */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {content ? "编辑文章" : "创建新文章"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">步骤 {step} / 3</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
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

          {/* 进度条 */}
          <div className="bg-gray-100 px-8 py-2">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    s <= step
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 步骤内容 */}
          <div className="p-8">
            {step === 1 && (
              <Step1BasicInfo
                type={type}
                title={title}
                status={status}
                onTypeChange={setType}
                onTitleChange={setTitle}
                onStatusChange={setStatus}
                onNext={() => setStep(2)}
                onCancel={onCancel}
              />
            )}

            {step === 2 && (
              <Step2Content
                intro={intro}
                mainContent={mainContent}
                featuredImage={featuredImage}
                onIntroChange={setIntro}
                onMainContentChange={setMainContent}
                onFeaturedImageChange={setFeaturedImage}
                onOpenMedia={() => setShowMediaLibrary(true)}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <Step3Review
                type={type}
                title={title}
                intro={intro}
                featuredImage={featuredImage}
                status={status}
                onBack={() => setStep(2)}
                onSave={() => handleSave(false)}
                onPublish={() => handleSave(true)}
                isSaving={isSaving}
              />
            )}
          </div>
        </div>
      </div>

      {/* 媒体库 */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 z-[60] overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">选择封面图片</h2>
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

// 步骤1：基本信息
function Step1BasicInfo({
  type,
  title,
  status,
  onTypeChange,
  onTitleChange,
  onStatusChange,
  onNext,
  onCancel,
}: any) {
  const typeOptions = [
    {
      value: "recommendation",
      label: "推荐文章",
      icon: "⭐",
      desc: '推荐多个产品，像"最好的VPS主机"',
    },
    {
      value: "review",
      label: "产品评测",
      icon: "📊",
      desc: "深度评测一个产品",
    },
    {
      value: "comparison",
      label: "产品对比",
      icon: "⚖️",
      desc: "对比两个或多个产品",
    },
    {
      value: "tutorial",
      label: "教程指南",
      icon: "📚",
      desc: '分步教程，如"如何使用V2Ray"',
    },
    {
      value: "resource",
      label: "资源分享",
      icon: "📦",
      desc: "分享付费资源或工具",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">选择文章类型</h2>
        <p className="text-gray-600">选择最适合你内容的类型</p>
      </div>

      {/* 类型选择 */}
      <div className="grid md:grid-cols-2 gap-4">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              type === option.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{option.icon}</span>
              <span className="font-bold text-lg text-gray-900">
                {option.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-12">{option.desc}</p>
          </button>
        ))}
      </div>

      {/* 标题输入 */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          文章标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="例如：2026年最好的VPS主机推荐"
          className="w-full text-xl px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
        />
        {title.length > 0 && (
          <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            标题已填写
          </p>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
        >
          取消
        </button>
        <button
          onClick={onNext}
          disabled={!title}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          下一步：填写内容 →
        </button>
      </div>
    </div>
  );
}

// 步骤2：填写内容
function Step2Content({
  intro,
  mainContent,
  featuredImage,
  onIntroChange,
  onMainContentChange,
  onFeaturedImageChange,
  onOpenMedia,
  onNext,
  onBack,
}: any) {
  return (
    <div className="space-y-6">
      {/* 引言 */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          📝 文章引言
        </label>
        <textarea
          value={intro}
          onChange={(e) => onIntroChange(e.target.value)}
          placeholder="写一段简短的介绍，让读者知道这篇文章是关于什么的..."
          rows={3}
          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none transition-all resize-none"
        />
      </div>

      {/* 主要内容 */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          📄 文章正文
        </label>
        <textarea
          value={mainContent}
          onChange={(e) => onMainContentChange(e.target.value)}
          placeholder="在这里写你的文章内容...

提示：
• 每写完一个段落，按两次回车分段
• 可以随时保存，不会丢失
• 支持复制粘贴其他文章"
          rows={12}
          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none transition-all resize-none text-base leading-relaxed"
        />
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>当前字数：{mainContent.length}</span>
          <span>•</span>
          <span>建议：1000字以上</span>
        </div>
      </div>

      {/* 封面图 */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          🖼️ 封面图片
        </label>
        {featuredImage ? (
          <div className="relative">
            <img
              src={featuredImage}
              alt="封面"
              className="w-full h-64 object-cover rounded-xl"
            />
            <button
              onClick={() => onFeaturedImageChange("")}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              删除图片
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenMedia}
            className="w-full py-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-600 transition-colors"
          >
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
              <p className="text-lg text-gray-600">点击选择封面图片</p>
              <p className="text-sm text-gray-400 mt-2">
                或者从媒体库拖拽图片到这里
              </p>
            </div>
          </button>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
        >
          ← 上一步
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
        >
          下一步：预览 →
        </button>
      </div>
    </div>
  );
}

// 步骤3：确认发布
function Step3Review({
  type,
  title,
  intro,
  featuredImage,
  status,
  onBack,
  onSave,
  onPublish,
  isSaving,
}: any) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">准备发布！</h2>
        <p className="text-gray-600">请确认你的文章内容，然后选择发布方式</p>
      </div>

      {/* 预览卡片 */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        {featuredImage && (
          <img
            src={featuredImage}
            alt="封面"
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
            {type}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 line-clamp-3">{intro}</p>
        </div>
      </div>

      {/* 发布选项 */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-2xl text-left hover:bg-yellow-100 transition-all disabled:opacity-50"
        >
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-bold text-gray-900 mb-1">保存为草稿</h3>
          <p className="text-sm text-gray-600">暂存文章，以后可以继续编辑</p>
        </button>

        <button
          onClick={onPublish}
          disabled={isSaving}
          className="p-6 bg-green-50 border-2 border-green-300 rounded-2xl text-left hover:bg-green-100 transition-all disabled:opacity-50"
        >
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold text-gray-900 mb-1">立即发布</h3>
          <p className="text-sm text-gray-600">文章立即上线，所有访客可见</p>
        </button>
      </div>

      {/* 状态指示 */}
      {isSaving && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-blue-600 font-medium">正在保存中...</span>
          </div>
        </div>
      )}

      {/* 底部按钮 */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isSaving}
          className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          ← 返回修改
        </button>
      </div>
    </div>
  );
}
