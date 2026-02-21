'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type Locale } from '@/lib/i18n-config'

interface PageEditorButtonProps {
  locale: Locale
  pageId: string
}

export default function PageEditorButton({ locale, pageId }: PageEditorButtonProps) {
  const router = useRouter()
  const [showHint, setShowHint] = useState(false)

  const handleClick = () => {
    // 跳转到后台并预填充内容
    const adminUrl = `/${locale}/admin?edit=${pageId}`
    router.push(adminUrl)
  }

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 group"
        aria-label="编辑此页面"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {showHint && (
        <div className="fixed bottom-6 right-20 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-pulse">
          点击编辑此页面
        </div>
      )}
    </>
  )
}
