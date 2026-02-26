"use client";

import { useState, useEffect, useCallback } from "react";

// 分析数据类型
interface AnalyticsData {
  dailyVisitors: Array<{ date: string; count: number }>;
  topPages: Array<{ path: string; title: string; views: number }>;
  topReferrers: Array<{ source: string; count: number }>;
  realTimeUsers: number;
  totalUsers: number;
  totalPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  meta: {
    days: number;
    cached: boolean;
    timestamp: string;
  };
}

// 图表组件
const Chart = ({
  data,
  type,
}: {
  data: AnalyticsData["dailyVisitors"];
  type: "visitors" | "views";
}) => {
  const values = data.map((item) => item.count);
  const maxValue = Math.max(...values, 1);
  const height = 200;
  const barWidth = Math.max(800 / data.length - 2, 4);

  return (
    <div className="w-full h-64 overflow-x-auto">
      <svg width="100%" height={height} viewBox={`0 0 ${800} ${height}`} preserveAspectRatio="xMidYMid meet">
        {values.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 30);
          return (
            <rect
              key={index}
              x={20 + index * (barWidth + 2)}
              y={height - barHeight - 10}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
              className="transition-all duration-300 hover:fill-blue-500 rounded-t"
            />
          );
        })}
      </svg>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = useCallback(async (refresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `/api/analytics?days=${selectedPeriod}${refresh ? "&refresh=true" : ""}`;
      const response = await fetch(url);
      const result: AnalyticsResponse = await response.json();

      if (result.success) {
        setData(result.data);
        setIsCached(result.meta.cached);
        setLastUpdate(result.meta.timestamp);
      } else {
        setError("获取数据失败");
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // 格式化时间（秒转为分秒）
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 导出数据
  const handleExport = () => {
    if (!data) return;
    
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      period: `${selectedPeriod} days`,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">实时访客</h3>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {loading ? "..." : data?.realTimeUsers || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">当前在线用户</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">总访客数</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {loading ? "..." : formatNumber(data?.totalUsers || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">过去 {selectedPeriod} 天</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">页面浏览量</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {loading ? "..." : formatNumber(data?.totalPageViews || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">过去 {selectedPeriod} 天</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">平均停留时间</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {loading ? "..." : formatDuration(data?.avgSessionDuration || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">跳出率: {data?.bounceRate?.toFixed(1) || 0}%</p>
        </div>
      </div>

      {/* 图表控制和展示 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold">访客趋势</h2>
            {isCached && (
              <p className="text-xs text-gray-400 mt-1">
                数据缓存时间: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>过去 7 天</option>
              <option value={30}>过去 30 天</option>
              <option value={90}>过去 90 天</option>
            </select>
            <button
              onClick={() => fetchData(true)}
              disabled={loading}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? "刷新中..." : "刷新数据"}
            </button>
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-700">{error}（显示模拟数据）</p>
          </div>
        )}

        {loading && !data ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Chart data={data?.dailyVisitors || []} type="visitors" />
        )}
      </div>

      {/* 双栏布局：热门页面 + 来源统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门页面 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">热门页面</h2>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))
            ) : (
              data?.topPages?.map((page, index) => (
                <div
                  key={page.path}
                  className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-gray-400 w-6">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{page.title}</p>
                      <p className="text-xs text-gray-400 truncate">{page.path}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600 ml-2">
                    {formatNumber(page.views)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 来源统计 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">流量来源</h2>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))
            ) : (
              data?.topReferrers?.map((ref) => {
                const total = data.topReferrers.reduce((sum, r) => sum + r.count, 0);
                const percentage = ((ref.count / total) * 100).toFixed(1);
                
                return (
                  <div key={ref.source} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700">{ref.source}</span>
                      <span className="text-gray-500">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 配置提示 */}
      {!data?.totalUsers && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 配置提示</h3>
          <p className="text-sm text-blue-700">
            当前显示模拟数据。要显示真实数据，请在环境变量中配置：
          </p>
          <code className="block mt-2 text-xs bg-blue-100 p-2 rounded">
            GA_PROPERTY_ID=你的GA4属性ID{"\n"}
            GA_CREDENTIALS=你的服务账号JSON密钥
          </code>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
