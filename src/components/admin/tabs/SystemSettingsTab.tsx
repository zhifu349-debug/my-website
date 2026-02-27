"use client";

import { useState } from "react";
import { notify } from "@/components/admin/Notification";

export default function SystemSettingsTab() {
  const [activeSection, setActiveSection] = useState<"basic" | "third-party" | "ip-restriction">('basic');
  const [settings, setSettings] = useState({
    siteName: "xcodezg",
    siteUrl: "https://www.xcodezg.com",
    adminEmail: "admin@xcodezg.com",
    timezone: "Asia/Shanghai",
    language: "zh-CN",
    gaId: "",
    gtmId: "",
    clarityId: "",
    ipRestriction: false,
    allowedIPs: "",
  });

  const handleSave = () => {
    try {
      localStorage.setItem("systemSettings", JSON.stringify(settings));
      notify.success("设置已保存！");
    } catch (error) {
      console.error("Failed to save settings:", error);
      notify.error("保存失败，请重试");
    }
  };

  return (
    <div className="space-y-6">
      {/* 选项卡 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'basic', name: '基本设置' },
              { id: 'third-party', name: '第三方服务' },
              { id: 'ip-restriction', name: 'IP 限制' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* 基本设置 */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站名称</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站 URL</label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">管理员邮箱</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">时区</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="Asia/Shanghai">亚洲/上海 (UTC+8)</option>
                  <option value="America/New_York">美国/纽约 (UTC-5)</option>
                  <option value="Europe/London">欧洲/伦敦 (UTC+0)</option>
                </select>
              </div>
            </div>
          )}

          {/* 第三方服务 */}
          {activeSection === 'third-party' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.gaId}
                  onChange={(e) => setSettings({ ...settings, gaId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={settings.gtmId}
                  onChange={(e) => setSettings({ ...settings, gtmId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Microsoft Clarity ID</label>
                <input
                  type="text"
                  value={settings.clarityId}
                  onChange={(e) => setSettings({ ...settings, clarityId: e.target.value })}
                  placeholder="xxxxxxxxxx"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {/* IP 限制 */}
          {activeSection === 'ip-restriction' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">启用 IP 限制</h3>
                  <p className="text-sm text-gray-500">只有白名单中的 IP 可以访问管理后台</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, ipRestriction: !settings.ipRestriction })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.ipRestriction ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.ipRestriction ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {settings.ipRestriction && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">允许的 IP 地址</label>
                  <textarea
                    value={settings.allowedIPs}
                    onChange={(e) => setSettings({ ...settings, allowedIPs: e.target.value })}
                    placeholder="每行一个 IP 地址，例如：&#10;192.168.1.1&#10;10.0.0.1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-32"
                  />
                </div>
              )}
            </div>
          )}

          {/* 保存按钮 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-800 mb-2">⚠️ 注意</h3>
        <p className="text-sm text-amber-700">
          某些设置需要重新部署才能生效。建议在更改设置后进行测试。
        </p>
      </div>
    </div>
  );
}
