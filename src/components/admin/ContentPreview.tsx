"use client";

import { useState } from "react";
import { CMSContent, ContentSection } from "@/lib/cms-types";

interface ContentPreviewProps {
  content: Partial<CMSContent>;
  onClose: () => void;
}

export default function ContentPreview({ content, onClose }: ContentPreviewProps) {
  const [activeLocale, setActiveLocale] = useState<"en" | "zh">((content.locale as "en" | "zh") || "en");

  if (!content) {
    return null;
  }

  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case "text":
        return (
          <div key={section.id} className="prose max-w-none">
            {section.content.split('\n').map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        );
      case "image":
        return (
          <div key={section.id} className="my-8">
            <img 
              src={typeof section.content === "string" ? section.content : ''} 
              alt="" 
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        );
      case "list":
        return (
          <ul key={section.id} className="list-disc pl-6 space-y-2 my-4">
            {section.content.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
              <li key={i}>{item.trim()}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold">内容预览</h1>
            <button
              onClick={onClose}
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

          {/* 语言切换 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveLocale("en")}
              className={`flex-1 px-4 py-3 font-medium ${activeLocale === "en" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLocale("zh")}
              className={`flex-1 px-4 py-3 font-medium ${activeLocale === "zh" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            >
              中文
            </button>
          </div>

          {/* 预览内容 */}
          <div className="p-6">
            {/* 标题 */}
            <h1 className="text-3xl font-bold mb-4">
              {content.title?.[activeLocale] || ''}
            </h1>

            {/* 封面图 */}
            {content.featuredImage && (
              <div className="mb-8">
                <img 
                  src={content.featuredImage} 
                  alt="Featured" 
                  className="w-full h-64 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )}

            {/* 引言 */}
            {content.content?.[activeLocale]?.intro && (
              <div className="text-lg text-gray-700 mb-8">
                {content.content[activeLocale].intro}
              </div>
            )}

            {/* 内容区块 */}
            <div className="space-y-8">
              {content.content?.[activeLocale]?.sections?.map(renderSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
