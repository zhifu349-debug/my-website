import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const locales = ['en', 'zh']

  const pages = [
    '',
    '/vps',
    '/ai-tools',
    '/tutorials',
    '/comparisons',
    '/resources',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  locales.forEach(locale => {
    pages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page === '' ? 1 : 0.8,
      })
    })
  })

  return sitemap
}
