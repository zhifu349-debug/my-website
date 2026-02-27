/**
 * 优化的图片组件
 * 使用 Next.js Image 进行优化
 */

"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  fallback?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fallback = "/placeholder.png",
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // 判断是否为外部 URL
  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  // 外部图片使用普通 img 标签以避免配置问题
  if (isExternal) {
    return (
      <img
        src={error ? fallback : src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        loading={priority ? undefined : "lazy"}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    );
  }

  // 内部图片使用 Next.js Image 组件
  if (fill) {
    return (
      <Image
        src={error ? fallback : src}
        alt={alt}
        fill
        sizes={sizes}
        className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        priority={priority}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    );
  }

  return (
    <Image
      src={error ? fallback : src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
      onLoad={() => setLoading(false)}
    />
  );
}

// 用于 logo 等固定尺寸图片
export function LogoImage({ 
  src, 
  alt, 
  size = 40 
}: { 
  src: string; 
  alt: string; 
  size?: number;
}) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? "/placeholder.png" : src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain"
      onError={() => setError(true)}
    />
  );
}

// 用于封面图片
export function CoverImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={error ? "/placeholder.png" : src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
}
