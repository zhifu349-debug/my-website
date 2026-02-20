import Head from 'next/head'
import { SEOConfig } from '@/types/seo'

interface SEOMetaProps {
  seo: SEOConfig
  schema?: any
}

export default function SEOMeta({ seo, schema }: SEOMetaProps) {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords.length > 0 && (
        <meta name="keywords" content={seo.keywords.join(', ')} />
      )}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo.noindex && <meta name="robots" content="noindex" />}
      {seo.nofollow && <meta name="robots" content="nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}

      {/* Schema.org */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  )
}
