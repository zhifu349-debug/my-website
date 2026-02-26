import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { usMarketSEO } from "@/lib/seo-us-market";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Google Analytics Tracking ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Google Tag Manager ID (optional)
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xcodezg.com"),
  title: {
    default: "xcodezg | Expert Tech Reviews & Developer Resources",
    template: "%s | xcodezg",
  },
  description: "Discover the best VPS hosting, AI tools, and development resources. Independent reviews, performance benchmarks, and practical tutorials for developers.",
  keywords: [
    "VPS hosting",
    "AI tools",
    "developer tutorials",
    "tech reviews",
    "cloud hosting",
    "web development",
    "programming resources",
  ],
  authors: [{ name: "xcodezg Team", url: "https://www.xcodezg.com" }],
  creator: "xcodezg",
  publisher: "xcodezg",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "zh_CN"],
    url: "https://www.xcodezg.com",
    siteName: "xcodezg",
    title: "xcodezg | Expert Tech Reviews & Developer Resources",
    description: "Discover the best VPS hosting, AI tools, and development resources. Independent reviews and practical tutorials.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "xcodezg - Expert Tech Reviews and Developer Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xcodezg",
    creator: "@xcodezg",
    title: "xcodezg | Expert Tech Reviews & Developer Resources",
    description: "Discover the best VPS hosting, AI tools, and development resources.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.xcodezg.com",
    languages: {
      "en-US": "https://www.xcodezg.com/en",
      "en-GB": "https://www.xcodezg.com/en",
      "zh-CN": "https://www.xcodezg.com/zh",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  category: "technology",
  classification: "Technology Reviews and Tutorials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org structured data
  const websiteSchema = usMarketSEO.schemas.website;
  const organizationSchema = usMarketSEO.schemas.organization;

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([websiteSchema, organizationSchema]),
          }}
        />
        
        {/* Google Tag Manager (optional) */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
        
        {/* Microsoft Clarity (optional) */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        
        {children}
        
        {/* Google Analytics */}
        {GA_TRACKING_ID && <GoogleAnalytics gaId={GA_TRACKING_ID} />}
      </body>
    </html>
  );
}
