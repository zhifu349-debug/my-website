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
    {
      question: "如何使用SEO工具？",
      answer:
        '点击"SEO工具"标签，在"SEO Generator"部分输入关键词，选择页面类型，然后点击"Generate SEO"按钮。系统会自动生成标题、描述和结构化数据，帮助你的页面在搜索引擎中获得更好的排名。',
      icon: "🔍",
    },
    {
      question: "如何管理用户权限？",
      answer:
        '点击"权限管理"标签，选择要编辑的角色（管理员、编辑或查看者），然后根据需要调整各个模块的权限。设置完成后点击"保存权限"按钮。',
      icon: "👥",
    },
    {
      question: "如何设置首页内容？",
      answer:
        '点击"首页设置"标签，修改首页的标题、副标题和统计数据。修改完成后点击"保存更改"按钮。这些更改会在刷新网站后生效。',
      icon: "🏠",
    },
    {
      question: "如何查看网站 analytics 数据？",
      answer:
        '点击"数据分析"标签，可以查看网站的总访问量、广告收入、联盟收入和转化率等关键指标。还可以查看表现最好的页面和优化建议。',
      icon: "📊",
    },
    {
      question: "如何使用批量操作功能？",
      answer:
        '在"内容管理"页面，勾选多个内容项，然后使用批量操作工具栏进行批量发布、设为草稿、归档或删除操作。这可以大大提高管理效率。',
      icon: "📋",
    },
    {
      question: "如何恢复之前的版本？",
      answer:
        '在"内容管理"页面找到文章，点击"版本历史"按钮，可以查看文章的所有历史版本。选择要恢复的版本，点击"恢复此版本"按钮即可。',
      icon: "⏰",
    },
  ];

  const tips = [
    { title: "标题要吸引人", desc: "好的标题能让更多人点击阅读，建议包含关键词和数字，如'2026年最好的VPS主机推荐'", icon: "🎯" },
    { title: "内容要有价值", desc: "提供真正有用的信息，不要写废话，保持内容的专业性和客观性", icon: "💎" },
    { title: "适当使用图片", desc: "图文并茂的阅读体验更好，建议每300-500字添加一张相关图片，图片要清晰且相关", icon: "🖼️" },
    { title: "定期更新内容", desc: "保持内容新鲜，吸引回头客，建议每周至少更新1-2篇文章", icon: "📅" },
    { title: "注意排版", desc: "分段合理，段落不要太长，使用小标题和列表提高可读性", icon: "📝" },
    { title: "使用SEO工具", desc: "利用SEO工具生成优化的标题和描述，提高搜索引擎排名", icon: "🔍" },
    { title: "优化图片大小", desc: "上传前压缩图片，保持图片清晰的同时减小文件大小，提高页面加载速度", icon: "⚡" },
    { title: "使用批量操作", desc: "管理大量内容时，使用批量操作功能可以节省时间，提高效率", icon: "⚡" },
    { title: "定期备份", desc: "虽然系统会自动保存版本历史，但建议定期导出重要内容作为备份", icon: "💾" },
    { title: "测试不同设备", desc: "发布前在不同设备（电脑、平板、手机）上测试页面显示效果", icon: "📱" },
    { title: "利用版本历史", desc: "如果不小心删除了内容，可以通过版本历史恢复之前的版本", icon: "⏰" },
    { title: "使用定时发布", desc: "可以设置文章在未来的某个时间自动发布，适合提前准备内容", icon: "⏱️" },
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
                      <div key={index} className="bg-yellow-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                          <span className="text-lg">{tip.icon}</span>
                          {tip.title}
                        </h4>
                        <p className="text-sm text-gray-600">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 详细操作手册 */}
                <section className="bg-indigo-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    详细操作手册
                  </h3>
                  <div className="space-y-4">
                    <a href="#" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] flex items-center gap-4">
                      <span className="text-2xl">📝</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">内容管理完整指南</h4>
                        <p className="text-sm text-gray-600">详细了解如何创建、编辑、发布和管理网站内容，包括不同类型文章的最佳实践</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a href="#" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] flex items-center gap-4">
                      <span className="text-2xl">🎨</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">媒体库使用完全指南</h4>
                        <p className="text-sm text-gray-600">学习如何上传、管理、优化和使用图片和视频，包括文件格式和大小的最佳实践</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a href="#" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] flex items-center gap-4">
                      <span className="text-2xl">🔍</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">SEO优化高级指南</h4>
                        <p className="text-sm text-gray-600">掌握SEO工具的使用方法，提高网站排名，包括关键词研究、内容优化和结构化数据</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a href="#" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] flex items-center gap-4">
                      <span className="text-2xl">👥</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">用户权限管理手册</h4>
                        <p className="text-sm text-gray-600">了解如何设置和管理不同角色的权限，包括管理员、编辑和查看者的权限配置</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a href="#" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] flex items-center gap-4">
                      <span className="text-2xl">⏰</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">定时发布和内容规划</h4>
                        <p className="text-sm text-gray-600">学习如何使用定时发布功能，合理规划内容发布时间，提高内容管理效率</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </section>

                {/* 联系支持 */}
                <section className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">📞</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    还有问题？
                  </h3>
                  <p className="text-gray-600 mb-4">
                    如果你遇到的问题不在上面，可以查看详细文档或联系技术支持
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      查看完整文档
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      联系技术支持
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
