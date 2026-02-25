import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
