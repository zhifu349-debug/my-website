"use client";

import { useEffect, useRef, useState } from "react";

interface GiscusCommentsProps {
  slug: string;
  locale?: "en" | "zh";
}

export default function GiscusComments({ slug, locale = "en" }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // Giscus configuration from environment variables
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    // Validate configuration
    if (!repo || !repoId) {
      setConfigError("Giscus configuration missing");
      return;
    }

    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Create script element
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Giscus attributes
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    if (categoryId) {
      script.setAttribute("data-category-id", categoryId);
    }
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", locale === "zh" ? "zh-CN" : "en");
    script.setAttribute("data-loading", "lazy");

    // Handle load event
    script.onload = () => {
      setIsLoaded(true);
    };

    containerRef.current.appendChild(script);

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [slug, locale, repo, repoId, category, categoryId]);

  // Configuration error state
  if (configError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <p className="text-amber-700 font-medium mb-2">
          💬 {locale === "zh" ? "评论功能配置中" : "Comments configuration in progress"}
        </p>
        <p className="text-amber-600 text-sm">
          {locale === "zh" 
            ? "请设置 Giscus 环境变量以启用评论功能" 
            : "Please set Giscus environment variables to enable comments"}
        </p>
        <div className="mt-4 text-xs text-amber-500 bg-amber-100/50 p-3 rounded text-left">
          <p className="font-semibold mb-1">
            {locale === "zh" ? "需要配置的变量：" : "Required variables:"}
          </p>
          <code className="block">NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo</code>
          <code className="block">NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id</code>
          <p className="mt-2 text-amber-400">
            {locale === "zh" 
              ? "获取方式: https://giscus.app" 
              : "Get yours at: https://giscus.app"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-container">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">💬</span>
        {locale === "zh" ? "评论区" : "Comments"}
      </h3>
      
      <div 
        ref={containerRef} 
        className="giscus-container min-h-[200px]"
      />
      
      {!isLoaded && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400 text-center">
        {locale === "zh" 
          ? "评论由 Giscus 提供支持，使用 GitHub Discussions" 
          : "Powered by Giscus using GitHub Discussions"}
      </div>
    </div>
  );
}
