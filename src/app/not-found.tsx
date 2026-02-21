import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="text-9xl mb-4">🚀</div>
          <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/en"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>

          <Link
            href="/zh"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-primary hover:text-primary transition-all"
          >
            返回首页
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Or try visiting one of our popular pages:
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Link
              href="/en/vps"
              className="text-sm text-blue-600 hover:underline"
            >
              VPS Hosting
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/en/ai-tools"
              className="text-sm text-blue-600 hover:underline"
            >
              AI Tools
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/en/tutorials"
              className="text-sm text-blue-600 hover:underline"
            >
              Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
