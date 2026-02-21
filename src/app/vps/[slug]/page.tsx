import { Metadata } from "next";
import { seoEngine } from "@/lib/seo-engine";
import { mockReviewPage } from "@/lib/data/mock-data";
import ReviewTemplate from "@/components/templates/ReviewTemplate";

// 生成SEO配置
const seo = seoEngine.generateSEO("review" as any, {
  productName: "Vultr",
  keyword: "vultr review",
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/vps/vultr-review`,
});

// 生成Schema
const schema = seoEngine.generateSchema(
  "review" as any,
  {
    title: seo.title,
    productName: "Vultr",
    rating: mockReviewPage.product.rating,
  },
  "/vps/vultr-review",
);

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
};

export default function ReviewDynamicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {mockReviewPage.product.name} Review
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive analysis of features, performance, and pricing
          </p>
        </div>
      </div>
      <ReviewTemplate data={mockReviewPage} />
    </>
  );
}
