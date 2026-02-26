/**
 * SEO Optimization for US/UK/English-speaking markets
 * Enhanced schema markup, structured data, and meta configurations
 */

import { Metadata } from "next";

// US/UK Market specific SEO configurations
export const usMarketSEO = {
  // Primary keywords for English-speaking markets
  keywords: {
    vps: [
      "best vps hosting 2026",
      "vps hosting comparison",
      "cloud vps providers",
      "virtual private server",
      "vps hosting reviews",
      "cheap vps hosting",
      "managed vps hosting",
      "vps for developers",
      "ssd vps hosting",
      "kvm vps",
    ],
    aiTools: [
      "best ai tools 2026",
      "ai coding assistants",
      "chatgpt alternatives",
      "ai productivity tools",
      "claude ai review",
      "ai tools for developers",
      "midjourney vs dall-e",
      "github copilot review",
      "ai writing tools",
      "machine learning tools",
    ],
    tutorials: [
      "developer tutorials",
      "docker tutorial",
      "nextjs tutorial",
      "react performance optimization",
      "nginx configuration guide",
      "vps setup tutorial",
      "devops tutorials",
      "web development guides",
    ],
  },

  // Schema.org types for different content
  schemas: {
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "xcodezg",
      url: "https://www.xcodezg.com",
      description: "Expert reviews and comparisons of VPS hosting, AI tools, and developer resources",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.xcodezg.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "xcodezg",
      url: "https://www.xcodezg.com",
      logo: "https://www.xcodezg.com/logo.png",
      sameAs: [
        "https://twitter.com/xcodezg",
        "https://github.com/xcodezg",
        "https://www.linkedin.com/company/xcodezg",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@xcodezg.com",
      },
    },

    // Review schema for VPS providers
    createReviewSchema: (product: {
      name: string;
      description: string;
      rating: number;
      price: string;
      url: string;
      image?: string;
    }) => ({
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        offers: {
          "@type": "Offer",
          price: product.price.replace(/[^0-9.]/g, ""),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: product.url,
        },
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.rating,
        bestRating: 5,
      },
      author: {
        "@type": "Organization",
        name: "xcodezg",
      },
      publisher: {
        "@type": "Organization",
        name: "xcodezg",
      },
    }),

    // Comparison schema
    createComparisonSchema: (products: string[]) => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product,
      })),
    }),

    // FAQ schema
    createFAQSchema: (faqs: Array<{ question: string; answer: string }>) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }),

    // Article schema for tutorials
    createArticleSchema: (article: {
      title: string;
      description: string;
      url: string;
      image: string;
      datePublished: string;
      dateModified: string;
      author: string;
    }) => ({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: article.title,
      description: article.description,
      image: article.image,
      url: article.url,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      author: {
        "@type": "Person",
        name: article.author,
      },
      publisher: {
        "@type": "Organization",
        name: "xcodezg",
        logo: {
          "@type": "ImageObject",
          url: "https://www.xcodezg.com/logo.png",
        },
      },
    }),

    // Breadcrumb schema
    createBreadcrumbSchema: (items: Array<{ name: string; url: string }>) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }),
  },

  // Meta tag configurations for different page types
  metaTemplates: {
    home: {
      title: "xcodezg | Expert Tech Reviews & Developer Resources",
      description: "Discover the best VPS hosting, AI tools, and development resources. Independent reviews, performance benchmarks, and practical tutorials for developers.",
    },
    vps: {
      title: "Best VPS Hosting 2026 | Independent Reviews & Comparisons",
      description: "We tested 20+ VPS providers. Compare performance, pricing, and features. Find the best VPS hosting for your projects with our data-driven reviews.",
    },
    aiTools: {
      title: "Best AI Tools for Developers 2026 | Reviews & Comparisons",
      description: "Compare ChatGPT, Claude, GitHub Copilot, and more. Find the best AI coding assistants and productivity tools with our expert reviews.",
    },
    tutorials: {
      title: "Developer Tutorials | Step-by-Step Guides for Modern Tech",
      description: "Learn Docker, Next.js, React, and more with our comprehensive tutorials. From beginner to advanced—master modern development tools.",
    },
    comparisons: {
      title: "Product Comparisons 2026 | Data-Driven Tech Reviews",
      description: "Side-by-side comparisons of VPS providers, AI tools, and frameworks. Make informed decisions with our detailed analysis.",
    },
  },

  // Social media optimization
  social: {
    twitter: {
      handle: "@xcodezg",
      cardType: "summary_large_image",
    },
    facebook: {
      appId: "", // Add Facebook App ID if available
    },
    linkedin: {
      company: "xcodezg",
    },
  },

  // Regional targeting
  hreflang: [
    { language: "en-US", url: "https://www.xcodezg.com/en" },
    { language: "en-GB", url: "https://www.xcodezg.com/en" },
    { language: "en-CA", url: "https://www.xcodezg.com/en" },
    { language: "en-AU", url: "https://www.xcodezg.com/en" },
    { language: "zh-CN", url: "https://www.xcodezg.com/zh" },
  ],

  // Content guidelines for English markets
  contentGuidelines: {
    tone: "Professional yet approachable",
    style: "Data-driven, evidence-based recommendations",
    formatting: {
      useBullets: true,
      useTables: true,
      includeCTA: true,
      highlightKeyStats: true,
    },
    trustSignals: [
      "Independently tested",
      "Real performance data",
      "Updated monthly",
      "Expert reviewers",
    ],
  },
};

// Helper function to generate metadata for pages
export function generateUSMarketMetadata(
  pageType: keyof typeof usMarketSEO.metaTemplates,
  customData?: Partial<Metadata>
): Metadata {
  const template = usMarketSEO.metaTemplates[pageType];
  
  return {
    title: template.title,
    description: template.description,
    keywords: usMarketSEO.keywords[pageType as keyof typeof usMarketSEO.keywords] || [],
    openGraph: {
      title: template.title,
      description: template.description,
      type: "website",
      locale: "en_US",
      siteName: "xcodezg",
    },
    twitter: {
      card: "summary_large_image",
      site: usMarketSEO.social.twitter.handle,
      title: template.title,
      description: template.description,
    },
    alternates: {
      languages: {
        "en-US": "/en",
        "en-GB": "/en",
        "zh-CN": "/zh",
      },
    },
    ...customData,
  };
}

export default usMarketSEO;
