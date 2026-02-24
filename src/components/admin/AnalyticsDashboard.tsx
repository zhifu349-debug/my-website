"use client";

import { useState, useEffect } from "react";
import { analyticsTracker } from "@/lib/analytics-tracker";
import { PerformanceMetrics } from "@/types/advertising";

// 模拟数据生成函数
const generateMockData = () => {
  const now = new Date();
  const data: PerformanceMetrics[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      pageId: "best-vps-2026",
      date,
      views: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 200) + 50,
      impressions: Math.floor(Math.random() * 1500) + 1000,
      revenue: Math.floor(Math.random() * 100) + 50,
      rpm: 0,
      conversionRate: 0
    });
  }
  
  // 计算派生指标
  return data.map(item => ({
    ...item,
    rpm: item.views > 0 ? (item.revenue / item.views) * 1000 : 0,
    conversionRate: item.clicks > 0 ? (item.impressions / item.clicks) * 100 : 0
  }));
};

// 图表组件
const Chart = ({ data, type }: { data: PerformanceMetrics[]; type: 'views' | 'revenue' | 'rpm' | 'conversion' }) => {
  const labels = data.map(item => item.date.toLocaleDateString());
  const values = data.map(item => {
    switch (type) {
      case 'views': return item.views;
      case 'revenue': return item.revenue;
      case 'rpm': return item.rpm;
      case 'conversion': return item.conversionRate;
      default: return 0;
    }
  });

  // 简单的SVG图表实现
  const maxValue = Math.max(...values);
  const height = 200;
  const width = 800;
  const barWidth = (width - 40) / data.length;

  return (
    <div className="w-full h-64">
      <svg width={width} height={height} className="w-full h-full">
        {values.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 20);
          return (
            <rect
              key={index}
              x={20 + index * barWidth}
              y={height - barHeight - 10}
              width={barWidth - 2}
              height={barHeight}
              fill={type === 'views' ? '#3b82f6' : type === 'revenue' ? '#10b981' : type === 'rpm' ? '#8b5cf6' : '#f59e0b'}
              className="rounded-t"
            />
          );
        })}
      </svg>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [selectedPage, setSelectedPage] = useState<string>("best-vps-2026");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'revenue' | 'rpm' | 'conversion'>('views');
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const mockData = generateMockData();
      setMetrics(mockData);
      
      // 模拟顶部页面数据
      setTopPages([
        { pageId: "best-vps-2026", totalViews: 5234, totalRevenue: 892, averageRPM: 170.4 },
        { pageId: "vultr-review", totalViews: 3456, totalRevenue: 456, averageRPM: 131.9 },
        { pageId: "v2ray-setup", totalViews: 2890, totalRevenue: 234, averageRPM: 81.0 },
        { pageId: "digitalocean-review", totalViews: 2100, totalRevenue: 189, averageRPM: 90.0 },
        { pageId: "aws-ec2-guide", totalViews: 1850, totalRevenue: 156, averageRPM: 84.3 }
      ]);
      
      // 模拟优化建议
      setSuggestions([
        {
          pageId: "v2ray-setup",
          type: "low-conversion" as const,
          message: "High traffic but low conversions",
          action: "Consider updating CTAs and affiliate links"
        },
        {
          pageId: "best-vps-2026",
          type: "opportunity" as const,
          message: "Excellent performance with $170.4 RPM",
          action: "Consider creating similar content with the same structure"
        },
        {
          pageId: "aws-ec2-guide",
          type: "high-traffic-low-rpm" as const,
          message: "Moderate traffic but low RPM",
          action: "Review ad placements and optimize for better monetization"
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [selectedPage, selectedPeriod]);

  // 计算聚合指标
  const aggregatedMetrics = {
    totalViews: metrics.reduce((sum, m) => sum + m.views, 0),
    totalClicks: metrics.reduce((sum, m) => sum + m.clicks, 0),
    totalImpressions: metrics.reduce((sum, m) => sum + m.impressions, 0),
    totalRevenue: metrics.reduce((sum, m) => sum + m.revenue, 0),
    averageRPM: metrics.reduce((sum, m) => sum + m.rpm, 0) / (metrics.length || 1),
    averageConversionRate: metrics.reduce((sum, m) => sum + m.conversionRate, 0) / (metrics.length || 1)
  };

  // 导出数据
  const handleExport = () => {
    const dataToExport = {
      metrics,
      aggregatedMetrics,
      topPages,
      suggestions
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">总访问量</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{aggregatedMetrics.totalViews.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% 较上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">广告收入</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">${aggregatedMetrics.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">↑ 8% 较上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">平均 RPM</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">${aggregatedMetrics.averageRPM.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-1">↑ 5% 较上月</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">转化率</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{aggregatedMetrics.averageConversionRate.toFixed(2)}%</p>
          <p className="text-xs text-red-600 mt-1">↓ 0.5% 较上月</p>
        </div>
      </div>

      {/* 图表控制和展示 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">数据趋势</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="best-vps-2026">Best VPS 2026</option>
              <option value="vultr-review">Vultr Review</option>
              <option value="v2ray-setup">V2Ray Setup</option>
              <option value="digitalocean-review">DigitalOcean Review</option>
              <option value="aws-ec2-guide">AWS EC2 Guide</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>7天</option>
              <option value={30}>30天</option>
              <option value={90}>90天</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="views">访问量</option>
              <option value="revenue">收入</option>
              <option value="rpm">RPM</option>
              <option value="conversion">转化率</option>
            </select>
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出数据
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Chart data={metrics} type={selectedMetric} />
        )}
      </div>

      {/* 表现最佳页面 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">表现最佳页面</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">页面</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">访问量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">收入</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RPM</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{page.pageId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{page.totalViews.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">${page.totalRevenue.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">${page.averageRPM.toFixed(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 优化建议 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">优化建议</h2>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 ${suggestion.type === 'low-conversion' ? 'bg-yellow-50 border-yellow-200' : suggestion.type === 'opportunity' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}
            >
              <h3 className={`font-medium mb-1 ${suggestion.type === 'low-conversion' ? 'text-yellow-800' : suggestion.type === 'opportunity' ? 'text-green-800' : 'text-blue-800'}`}>
                {suggestion.pageId}
              </h3>
              <p className={`text-sm ${suggestion.type === 'low-conversion' ? 'text-yellow-700' : suggestion.type === 'opportunity' ? 'text-green-700' : 'text-blue-700'}`}>
                {suggestion.message}
              </p>
              <p className={`text-sm font-medium mt-1 ${suggestion.type === 'low-conversion' ? 'text-yellow-600' : suggestion.type === 'opportunity' ? 'text-green-600' : 'text-blue-600'}`}>
                建议: {suggestion.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 联盟统计 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">联盟统计</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">联盟链接</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">点击量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">转化量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">转化率</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">收入</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">Vultr Affiliate</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">1,234</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">123</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">9.97%</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">$892</div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">DigitalOcean Affiliate</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">890</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">78</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">8.76%</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">$456</div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">AWS Affiliate</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">567</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">34</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">6.00%</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">$234</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;