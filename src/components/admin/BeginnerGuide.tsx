"use client";

import { useState, useEffect } from "react";
import { notify } from "./Notification";

interface GuideStep {
  title: string;
  description: string;
  icon: string;
  interactive?: boolean;
  actionText?: string;
  action?: () => void;
}

export default function BeginnerGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 检查是否首次访问
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      // 延迟显示，让页面先加载
      setTimeout(() => {
        setShowGuide(true);
      }, 1000);
    }
  }, []);

  const steps: GuideStep[] = [
    {
      title: "欢迎使用内容管理系统！",
      description:
        "这是一个专门为非技术人员设计的简单工具。只需3步，你就可以轻松管理网站的所有内容。让我们开始吧！",
      icon: "👋",
    },
    {
      title: "第1步：上传图片和媒体文件",
      description:
        "点击顶部的【媒体库】标签，然后点击【上传图片/视频】按钮。你可以从电脑选择任何图片或视频文件，或者直接把文件拖进来。支持JPG、PNG、GIF、WebP、MP4等常见格式。",
      icon: "📸",
      interactive: true,
      actionText: "查看媒体库位置",
      action: () => {
        // 模拟点击媒体库标签
        const mediaTab = document.querySelector('button[data-tab="media"]');
        if (mediaTab) {
          mediaTab.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加高亮效果
          mediaTab.classList.add('animate-pulse', 'bg-blue-100', 'ring-2', 'ring-blue-300');
          setTimeout(() => {
            mediaTab.classList.remove('animate-pulse', 'bg-blue-100', 'ring-2', 'ring-blue-300');
          }, 2000);
        }
      },
    },
    {
      title: "第2步：创建和编辑文章",
      description:
        "点击【内容管理】标签，然后点击【创建新内容】按钮。系统会引导你完成三个简单步骤：1. 选择文章类型和标题 2. 填写文章内容 3. 预览并发布。每一步都有清晰的说明。",
      icon: "✍️",
      interactive: true,
      actionText: "查看内容管理区域",
      action: () => {
        // 模拟点击内容管理标签
        const contentTab = document.querySelector('button[data-tab="content"]');
        if (contentTab) {
          contentTab.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加高亮效果
          contentTab.classList.add('animate-pulse', 'bg-blue-100', 'ring-2', 'ring-blue-300');
          setTimeout(() => {
            contentTab.classList.remove('animate-pulse', 'bg-blue-100', 'ring-2', 'ring-blue-300');
          }, 2000);
        }
      },
    },
    {
      title: "第3步：发布和管理内容",
      description:
        "写完文章后，点击【发布】按钮。文章就会立即出现在网站上，所有人都能看到了！你也可以选择【保存为草稿】，以后再继续编辑。",
      icon: "🚀",
      interactive: true,
      actionText: "了解发布选项",
      action: () => {
        // 显示发布相关的信息
        notify.info('发布后，你可以在内容管理页面查看和管理所有已发布的文章');
      },
    },
    {
      title: "高级功能介绍",
      description:
        "系统还提供了许多高级功能，如：批量操作、版本历史、定时发布、SEO工具等。这些功能可以帮助你更高效地管理网站内容。",
      icon: "⚡",
    },
    {
      title: "需要帮助？",
      description:
        "如果在操作中遇到问题，随时点击右上角的【帮助】按钮。里面有详细的操作指南、常见问题解答和视频教程。",
      icon: "❓",
      interactive: true,
      actionText: "查看帮助中心",
      action: () => {
        // 模拟点击帮助按钮
        const helpButton = document.querySelector('button:has(span:contains("帮助"))');
        if (helpButton) {
          helpButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加高亮效果
          helpButton.classList.add('animate-pulse', 'scale-105', 'ring-2', 'ring-blue-300');
          setTimeout(() => {
            helpButton.classList.remove('animate-pulse', 'scale-105', 'ring-2', 'ring-blue-300');
          }, 2000);
        }
      },
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleFinishGuide = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setIsAnimating(true);
    setTimeout(() => {
      setShowGuide(false);
    }, 300);
  };

  const handleSkipGuide = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setShowGuide(false);
  };

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 ease-in-out ${
        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">新手快速入门</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipGuide}
                className="text-white/80 hover:text-white text-sm font-medium py-1 px-3 rounded-full hover:bg-white/20 transition-colors"
              >
                跳过
              </button>
              <button
                onClick={() => setShowGuide(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-8">
          {/* 当前步骤 */}
          <div className={`text-center mb-8 transform transition-all duration-500 ease-in-out ${
            isAnimating ? 'translate-x-10 opacity-0' : 'translate-x-0 opacity-100'
          }`}>
            <div className="text-8xl mb-6 animate-bounce">{steps[currentStep].icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {steps[currentStep].title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {steps[currentStep].description}
            </p>

            {/* 交互式操作按钮 */}
            {steps[currentStep].interactive && steps[currentStep].action && (
              <button
                onClick={steps[currentStep].action}
                className="mt-6 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2 mx-auto"
              >
                <span>{steps[currentStep].actionText}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>

          {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentStep(index);
                  setIsAnimating(false);
                }, 300);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                index === currentStep
                  ? "bg-blue-600 w-12"
                  : index < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`跳转到步骤 ${index + 1}`}
            />
          ))}
        </div>

          {/* 导航按钮 */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>上一步</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleFinishGuide}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>开始使用</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>下一步</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-500">
            💡 提示：你可以随时点击右上角的【帮助】按钮重新查看这个引导
          </p>
        </div>
      </div>
    </div>
  );
}
