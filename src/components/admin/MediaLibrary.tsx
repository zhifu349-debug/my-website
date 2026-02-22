"use client";

import { useState, useEffect } from "react";
import { MediaFile } from "@/lib/cms-types";
import { MediaType } from "@/lib/cms-types";

interface MediaLibraryProps {
  onSelect?: (media: MediaFile) => void;
  multiple?: boolean;
}

export default function MediaLibrary({
  onSelect,
  multiple = false,
}: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  };

  const handleUpload = async (file: File) => {
    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      alert("文件大小超过限制（最大10MB）");
      return;
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert("不支持的文件类型，请上传JPG、PNG、GIF、WebP、MP4或WebM文件");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type.startsWith("video/") ? "video" : "image");
    formData.append("alt", file.name);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        await fetchMedia();
        alert("文件上传成功！");
      } else {
        alert(`上传失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("上传失败，请检查网络连接后重试");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const toggleSelect = (id: string) => {
    if (multiple) {
      setSelectedMedia((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    } else {
      const selected = media.find((m) => m.id === id);
      if (selected && onSelect) {
        onSelect(selected);
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("确定要删除这个文件吗？此操作不可撤销。")) return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchMedia();
        alert("文件删除成功！");
      } else {
        const data = await res.json();
        alert(`删除失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("删除失败，请检查网络连接后重试");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredMedia = media.filter((m) => {
    const typeMatch = filter === "all" || m.type === filter;
    const searchMatch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.alt.toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept="image/*,video/*"
          className="hidden"
          id="media-upload"
        />
        <label
          htmlFor="media-upload"
          className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              上传中...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              上传图片/视频
            </>
          )}
        </label>
        <p className="mt-2 text-sm text-gray-500">或拖拽文件到此处</p>
        <p className="text-xs text-gray-400 mt-1">
          支持 JPG, PNG, GIF, WebP, MP4, WebM（最大10MB）
        </p>
      </div>

      {/* 筛选和搜索 */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="搜索媒体..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="all">全部类型</option>
          <option value="image">图片</option>
          <option value="video">视频</option>
        </select>
      </div>

      {/* 媒体网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleSelect(item.id)}
            className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
              selectedMedia.includes(item.id)
                ? "border-primary"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-32 object-cover"
                loading="lazy"
              />
            ) : (
              <video 
                src={item.url} 
                className="w-full h-32 object-cover"
                preload="metadata"
              />
            )}

            {/* 悬浮操作 */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* 文件信息 */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
              <p className="truncate">{item.name}</p>
              <p className="text-gray-300">{formatSize(item.size)}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>暂无媒体文件</p>
          <p className="text-sm mt-2">上传第一个文件开始</p>
        </div>
      )}
    </div>
  );
}
