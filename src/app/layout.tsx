import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

// Google Analytics 追踪 ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xcodezg.com'),
  title: {
    default: 'xcodezg - Best Tech Reviews & Tutorials',
    template: '%s | xcodezg',
  },
  description: 'Discover the best VPS, AI tools, and tech tutorials. Expert reviews, comparisons, and step-by-step guides to help you make informed decisions.',
  keywords: ['VPS', 'AI tools', 'tutorials', 'reviews', 'DigitalOcean', 'Vultr', 'ChatGPT', 'Claude', 'React', 'Docker', 'Next.js'],
  authors: [{ name: 'xcodezg' }],
  creator: 'xcodezg',
  publisher: 'xcodezg',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: 'https://www.xcodezg.com',
    siteName: 'xcodezg',
    title: 'xcodezg - Best Tech Reviews & Tutorials',
    description: 'Discover the best VPS, AI tools, and tech tutorials. Expert reviews, comparisons, and step-by-step guides.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'xcodezg - Tech Reviews & Tutorials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xcodezg - Best Tech Reviews & Tutorials',
    description: 'Discover the best VPS, AI tools, and tech tutorials.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.xcodezg.com',
    languages: {
      'en-US': 'https://www.xcodezg.com/en',
      'zh-CN': 'https://www.xcodezg.com/zh',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 网站结构化数据
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "xcodezg",
    url: "https://www.xcodezg.com",
    description: "Discover the best VPS, AI tools, and tech tutorials",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.xcodezg.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "xcodezg",
    url: "https://www.xcodezg.com",
    logo: "https://www.xcodezg.com/icon.svg",
    sameAs: [
      "https://twitter.com/xcodezg",
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([websiteSchema, organizationSchema]),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <GoogleAnalytics gaId={GA_TRACKING_ID} />
      </body>
    </html>
  );
}
