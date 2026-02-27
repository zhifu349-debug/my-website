"use client";

import { useState } from "react";
import { PageType } from "@/types/content";
import { seoEngine } from "@/lib/seo-engine";

export default function SEOToolsTab() {
  const [selectedType, setSelectedType] = useState<PageType>(
    PageType.RECOMMENDATION,
  );
  const [keyword, setKeyword] = useState("");

  const generateSEO = () => {
    if (!keyword) return null;

    const seo = seoEngine.generateSEO(selectedType, {
      keyword,
      category: selectedType,
    });
    const schema = seoEngine.generateSchema(
      selectedType,
      { title: seo.title, description: seo.description, keyword },
      "/test",
    );
    const headings = seoEngine.generateHeadingSuggestions(selectedType, {
      keyword,
    });

    return { seo, schema, headings };
  };

  const generated = keyword ? generateSEO() : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">SEO Generator</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as PageType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {Object.values(PageType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., best vps 2026"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <button
            onClick={() => setKeyword(keyword)}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary"
          >
            Generate SEO
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Generated SEO Data</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Title</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {generated.seo.title}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {generated.seo.description}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Suggested Headings
              </h3>
              <ul className="space-y-1">
                {generated.headings.map((heading, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                  >
                    H2: {heading}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Schema.org Data
              </h3>
              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
                {JSON.stringify(generated.schema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Internal Link Generator</h2>
        <p className="text-sm text-gray-600 mb-4">
          Automatically generate internal links based on content relationships
        </p>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary">
          Generate Internal Links
        </button>
      </div>
    </div>
  );
}
