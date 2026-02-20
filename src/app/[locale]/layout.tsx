import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { notFound } from 'next/navigation'
import { I18nProvider } from '@/components/layout/LayoutProvider'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { locales, type Locale } from '@/lib/i18n-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEO Content Monetization System',
  description: 'High-conversion SEO content platform',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // 验证locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={inter.className}>
        <I18nProvider initialLocale={locale as Locale}>
          <Navigation />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  )
}
