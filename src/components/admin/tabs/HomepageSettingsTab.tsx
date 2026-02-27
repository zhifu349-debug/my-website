"use client";

import { notify } from "@/components/admin/Notification";

export interface HomepageData {
  title: {
    en: string;
    zh: string;
  };
  subtitle: {
    en: string;
    zh: string;
  };
  stats: {
    users: string;
    reviews: string;
    rating: string;
  };
}

interface HomepageSettingsTabProps {
  data: HomepageData;
  onChange: (data: HomepageData) => void;
}

export default function HomepageSettingsTab({
  data,
  onChange,
}: HomepageSettingsTabProps) {
  const handleSave = () => {
    try {
      // 验证数据
      if (!data.title.en || !data.title.zh) {
        notify.error("请填写中英文标题");
        return;
      }
      
      if (!data.subtitle.en || !data.subtitle.zh) {
        notify.error("请填写中英文副标题");
        return;
      }

      localStorage.setItem("homepageData", JSON.stringify(data));
      notify.success("首页设置已保存！修改将在刷新页面后生效。");
    } catch (error) {
      console.error("Failed to save homepage settings:", error);
      notify.error('保存失败，请检查浏览器存储权限后重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">首页内容设置</h2>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all"
          >
            保存更改
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文标题
            </label>
            <input
              type="text"
              value={data.title.en}
              onChange={(e) =>
                onChange({
                  ...data,
                  title: { ...data.title, en: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="例如：Find the Best Tools & Services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文标题
            </label>
            <input
              type="text"
              value={data.title.zh}
              onChange={(e) =>
                onChange({
                  ...data,
                  title: { ...data.title, zh: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="例如：寻找最佳工具与服务"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              英文副标题
            </label>
            <textarea
              value={data.subtitle.en}
              onChange={(e) =>
                onChange({
                  ...data,
                  subtitle: { ...data.subtitle, en: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 text-sm"
              placeholder="例如：In-depth reviews, comparisons, and tutorials..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              中文副标题
            </label>
            <textarea
              value={data.subtitle.zh}
              onChange={(e) =>
                onChange({
                  ...data,
                  subtitle: { ...data.subtitle, zh: e.target.value },
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 text-sm"
              placeholder="例如：深度评测、对比和教程..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户数量
              </label>
              <input
                type="text"
                value={data.stats.users}
                onChange={(e) =>
                  onChange({
                    ...data,
                    stats: { ...data.stats, users: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="例如：10,000+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评论数量
              </label>
              <input
                type="text"
                value={data.stats.reviews}
                onChange={(e) =>
                  onChange({
                    ...data,
                    stats: { ...data.stats, reviews: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="例如：500+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                平均评分
              </label>
              <input
                type="text"
                value={data.stats.rating}
                onChange={(e) =>
                  onChange({
                    ...data,
                    stats: { ...data.stats, rating: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="例如：4.8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 提示</h3>
        <p className="text-sm text-blue-700">
          修改首页内容后，点击&ldquo;保存更改&rdquo;按钮。修改会在刷新页面后生效。
        </p>
      </div>
    </div>
  );
}
