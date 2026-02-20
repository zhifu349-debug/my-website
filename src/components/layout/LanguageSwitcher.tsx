'use client'

import { useState, useEffect } from 'react'
import { Locale, locales, localeNames, setLocale, getStoredLocale } from '@/lib/i18n'

interface LanguageSwitcherProps {
  onLocaleChange: (locale: Locale) => void
}

export default function LanguageSwitcher({ onLocaleChange }: LanguageSwitcherProps) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const savedLocale = getStoredLocale()
    setLocaleState(savedLocale)

    const handleLocaleChange = (event: CustomEvent) => {
      setLocaleState(event.detail.locale)
    }

    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener)
    }
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setLocaleState(newLocale)
    onLocaleChange(newLocale)
  }

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value as Locale)}
        className="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-1.5 pr-8 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
