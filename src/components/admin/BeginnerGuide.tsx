'use client'

import { useState } from 'react'

interface GuideStep {
  title: string
  description: string
  icon: string
}

export default function BeginnerGuide() {
  const [showGuide, setShowGuide] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const steps: GuideStep[] = [
    {
      title: '欢迎使用内容管理系统！',
      description: '这是一个专门为非技术人员设计的简单工具。只需3步，你就可以管理网站的所有内容。',
      icon: '👋'
    },
    {
      title: '第1步：上传图片',
      description: '点击【媒体库】标签，然后点击【上传图片/视频】按钮。你可以从电脑选择任何图片或视频文件，或者直接把文件拖进来。就是这么简单！',
      icon: '📸'
    },
    {
      title: '第2步：写文章',
      description: '点击【内容管理】标签，然后点击【+ 创建新内容】按钮。选择文章类型，填写标题，就可以开始写了。像用Word一样简单！',
      icon: '✍️'
    },
    {
      title: '第3步：发布',
      description: '写完文章后，点击【发布】按钮。文章就会立即出现在网站上，所有人都能看到了！',
      icon: '🚀'
    },
    {
      title: '你需要帮助吗？',
      description: '如果在操作中遇到问题，随时查看右上角的【帮助】按钮。里面有详细的操作说明。',
      icon: '❓'
    }
  ]

  if (!showGuide) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">新手快速入门</h2>
            <button
              onClick={() => setShowGuide(false)}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-8">
          {/* 当前步骤 */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">{steps[currentStep].icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {steps[currentStep].title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600 w-8'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← 上一步
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={() => setShowGuide(false)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                开始使用 →
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                下一步 →
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
  )
}
