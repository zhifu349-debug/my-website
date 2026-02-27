"use client";

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">24,567</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Ad Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">$1,234</p>
          <p className="text-xs text-green-600 mt-1">↑ 8% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Affiliate Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">$2,456</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">3.4%</p>
          <p className="text-xs text-red-600 mt-1">↓ 0.5% vs last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Top Performing Pages</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-medium text-sm sm:text-base">Best VPS 2026</h3>
              <p className="text-xs sm:text-sm text-gray-500">Recommendation Page</p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <p className="font-bold text-sm sm:text-base">5,234 views</p>
              <p className="text-xs sm:text-sm text-gray-500">$892 revenue</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-medium text-sm sm:text-base">Vultr Review</h3>
              <p className="text-xs sm:text-sm text-gray-500">Review Page</p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <p className="font-bold text-sm sm:text-base">3,456 views</p>
              <p className="text-xs sm:text-sm text-gray-500">$456 revenue</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="font-medium text-sm sm:text-base">V2Ray Setup</h3>
              <p className="text-xs sm:text-sm text-gray-500">Tutorial Page</p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <p className="font-bold text-sm sm:text-base">2,890 views</p>
              <p className="text-xs sm:text-sm text-gray-500">$234 revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Optimization Suggestions</h2>
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h3 className="font-medium text-yellow-800 text-sm sm:text-base">Low Conversion Rate</h3>
            <p className="text-xs sm:text-sm text-yellow-700 mt-1">
              &quot;V2Ray Setup&quot; has high traffic but low conversions. Consider updating CTAs.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h3 className="font-medium text-green-800 text-sm sm:text-base">High Performing Page</h3>
            <p className="text-xs sm:text-sm text-green-700 mt-1">
              &quot;Best VPS 2026&quot; is performing well. Consider creating similar content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
