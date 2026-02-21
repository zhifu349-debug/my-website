"use client";

import { useState } from "react";

export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const faqs = [
    {
      question: "如何上传图片或视频？",
      answer:
        '点击"媒体库"标签，然后点击"上传图片/视频"按钮。选择文件后，文件会自动上传并显示在媒体库中。你也可以直接把文件拖拽到上传区域。',
      icon: "📸",
    },
    {
      question: "如何创建一篇文章？",
      answer:
        '点击"内容管理"标签，然后点击"+ 创建新内容"按钮。按照三个步骤填写信息：1. 选择文章类型和标题 2. 填写文章内容 3. 预览并发布。每个步骤都有清晰的说明。',
      icon: "✍️",
    },
    {
      question: "草稿和发布有什么区别？",
      answer:
        "草稿是保存但不发布的文章，只有你能在管理后台看到。发布后，文章就会出现在网站上，所有访客都能看到。建议先保存为草稿，检查没问题后再发布。",
      icon: "📝",
    },
    {
      question: "文章可以编辑吗？",
      answer:
        '当然可以！在"内容管理"页面找到你的文章，点击"编辑"按钮。修改完成后，可以保存为草稿或重新发布。已发布的文章编辑后不会自动重新上线，需要点击"发布"按钮。',
      icon: "✏️",
    },
    {
      question: "支持哪些图片和视频格式？",
      answer:
        "图片支持 JPG、PNG、GIF、WebP 格式。视频支持 MP4、WebM、MOV 格式。单个文件最大 10MB。",
      icon: "🎬",
    },
    {
      question: "如何删除不需要的内容？",
      answer:
        '在"内容管理"页面找到要删除的内容，点击"删除"按钮。系统会提示确认，确认后内容将被永久删除，无法恢复，请谨慎操作。',
      icon: "🗑️",
    },
    {
      question: "文章会自动保存吗？",
      answer:
        '不会自动保存。请记得点击"保存草稿"按钮来保存你的工作。建议每写一段就保存一次，避免意外丢失。',
      icon: "💾",
    },
    {
      question: "如何预览文章？",
      answer:
        "在创建或编辑文章的第三步，你可以看到文章的预览卡片，展示封面图、标题和引言。确认无误后再发布。",
      icon: "👀",
    },
  ];

  const tips = [
    { title: "标题要吸引人", desc: "好的标题能让更多人点击阅读" },
    { title: "内容要有价值", desc: "提供真正有用的信息，不要写废话" },
    { title: "适当使用图片", desc: "图文并茂的阅读体验更好" },
    { title: "定期更新内容", desc: "保持内容新鲜，吸引回头客" },
    { title: "注意排版", desc: "分段合理，段落不要太长" },
  ];

  return (
    <>
      {/* 帮助按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-40"
      >
        <span className="text-xl">❓</span>
        <span className="font-semibold">帮助</span>
      </button>

      {/* 帮助面板 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl">
              {/* 头部 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">使用帮助</h2>
                  <p className="text-white/80 mt-1">常见问题和操作技巧</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white text-3xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* 快速开始 */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    快速开始（3步）
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <h4 className="font-bold mb-1">上传图片</h4>
                      <p className="text-sm text-gray-600">先上传需要的图片</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-4xl mb-2">✍️</div>
                      <h4 className="font-bold mb-1">写文章</h4>
                      <p className="text-sm text-gray-600">填写标题和内容</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-4xl mb-2">🚀</div>
                      <h4 className="font-bold mb-1">发布</h4>
                      <p className="text-sm text-gray-600">立即上线</p>
                    </div>
                  </div>
                </section>

                {/* 常见问题 */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">❓</span>
                    常见问题
                  </h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="bg-gray-50 rounded-xl overflow-hidden"
                      >
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-3">
                          <span className="text-2xl">{faq.icon}</span>
                          <span className="font-semibold text-gray-900">
                            {faq.question}
                          </span>
                          <svg
                            className="w-5 h-5 ml-auto text-gray-500 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <div className="px-6 pb-4 pt-2 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>

                {/* 操作技巧 */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    操作技巧
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tips.map((tip, index) => (
                      <div key={index} className="bg-yellow-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                          <span className="text-lg">✨</span>
                          {tip.title}
                        </h4>
                        <p className="text-sm text-gray-600">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 联系支持 */}
                <section className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">📞</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    还有问题？
                  </h3>
                  <p className="text-gray-600">
                    如果你遇到的问题不在上面，可以查看详细文档或联系技术支持
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
