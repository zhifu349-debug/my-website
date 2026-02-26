'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '0.1s', animationDuration: '1.2s' }}></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        <p className="text-sm text-gray-400">正在加载页面内容</p>
      </div>
    </div>
  );
}
