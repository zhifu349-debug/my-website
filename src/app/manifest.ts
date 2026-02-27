import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'xcodezg - Expert Tech Reviews & Developer Resources',
    short_name: 'xcodezg',
    description: 'Discover the best VPS hosting, AI tools, and development resources. Independent reviews and practical tutorials for developers.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['technology', 'education', 'developer tools'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
  };
}
