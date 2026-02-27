"use client";

import { Suspense } from "react";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default function MediaManagementTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">媒体库</h2>
        <Suspense fallback={<div className="flex justify-center items-center h-64"><p className="text-gray-500">加载媒体库...</p></div>}>
          <MediaLibrary />
        </Suspense>
      </div>
    </div>
  );
}
