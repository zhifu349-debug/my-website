import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentVersion } from '@/lib/cms-types';

// 简单的文本差异比较函数
function getTextDiff(oldText: string, newText: string): string {
  if (oldText === newText) return '无差异';
  
  const oldWords = oldText.split(' ');
  const newWords = newText.split(' ');
  
  let diff = '';
  let i = 0, j = 0;
  
  while (i < oldWords.length || j < newWords.length) {
    if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
      diff += oldWords[i] + ' ';
      i++;
      j++;
    } else if (i < oldWords.length && j < newWords.length) {
      // 替换
      diff += `<span class="bg-yellow-200">${newWords[j]}</span> `;
      i++;
      j++;
    } else if (i < oldWords.length) {
      // 删除
      diff += `<span class="bg-red-200 line-through">${oldWords[i]}</span> `;
      i++;
    } else {
      // 添加
      diff += `<span class="bg-green-200">${newWords[j]}</span> `;
      j++;
    }
  }
  
  return diff;
}

interface VersionHistoryProps {
  contentId: string;
  onBack: () => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ contentId, onBack }) => {
  const router = useRouter();
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rollbackLoading, setRollbackLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<ContentVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [contentId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/contents/${contentId}/versions`);
      const data = await response.json();
      if (data.success) {
        setVersions(data.data);
      } else {
        setError('Failed to fetch versions');
      }
    } catch (err) {
      setError('An error occurred while fetching versions');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: ContentVersion) => {
    if (!confirm(`确定要回滚到版本 ${version.version} 吗？这将会创建一个新的版本记录。`)) {
      return;
    }

    try {
      setRollbackLoading(true);
      const response = await fetch(`/api/contents/${contentId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          versionId: version.id,
          updatedBy: localStorage.getItem('adminUser') || 'system',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('版本回滚成功！');
        fetchVersions();
      } else {
        alert('版本回滚失败：' + (data.error || '未知错误'));
      }
    } catch (err) {
      alert('版本回滚失败，请重试');
    } finally {
      setRollbackLoading(false);
    }
  };

  const handleViewVersion = (version: ContentVersion) => {
    setSelectedVersion(version);
  };

  const closeVersionView = () => {
    setSelectedVersion(null);
  };

  const handleCompareVersion = (version: ContentVersion) => {
    if (!selectedVersion) {
      setSelectedVersion(version);
      alert('请选择另一个版本进行比较');
    } else {
      setCompareVersion(version);
      setShowDiff(true);
    }
  };

  const handleCloseDiff = () => {
    setShowDiff(false);
    setCompareVersion(null);
  };

  const handleClearSelection = () => {
    setSelectedVersion(null);
    setCompareVersion(null);
    setShowDiff(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchVersions}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          ← 返回内容管理
        </button>
        <h2 className="text-xl font-bold">版本历史</h2>
        <div className="w-32"></div> {/* 占位，保持标题居中 */}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">所有版本</h3>

        {versions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无版本历史</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        版本 {version.version}
                      </span>
                      <h4 className="font-medium">{version.title.en}</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      创建于: {new Date(version.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewVersion(version)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleRollback(version)}
                      disabled={rollbackLoading}
                      className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md text-sm font-medium hover:shadow transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {rollbackLoading ? '回滚中...' : '回滚到此版本'}
                    </button>
                  </div>
                </div>

                {version.comment && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">备注：</span>{version.comment}
                    </p>
                  </div>
                )}

                <div className="mt-3 text-sm text-gray-500">
                  <p>更新者: {version.updatedBy}</p>
                  <p>状态: {version.status === 'published' ? '已发布' : version.status === 'draft' ? '草稿' : '归档'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 版本详情弹窗 */}
      {selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">版本详情</h3>
                <button
                  onClick={closeVersionView}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="mt-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  版本 {selectedVersion.version}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  创建于: {new Date(selectedVersion.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">标题</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">英文: {selectedVersion.title.en}</p>
                  <p className="text-sm text-gray-600">中文: {selectedVersion.title.zh}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">状态</h4>
                <p className="text-sm text-gray-600">
                  {selectedVersion.status === 'published' ? '已发布' : selectedVersion.status === 'draft' ? '草稿' : '归档'}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">SEO信息</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <p className="text-gray-600 mb-1">标题: {selectedVersion.seo.title.en}</p>
                  <p className="text-gray-600">描述: {selectedVersion.seo.description.en.substring(0, 100)}...</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">内容摘要</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <p className="text-gray-600">
                    {selectedVersion.content.en.intro.substring(0, 150)}...
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">其他信息</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>更新者: {selectedVersion.updatedBy}</p>
                  <p>作者: {selectedVersion.author}</p>
                  <p>语言: {selectedVersion.locale === 'en' ? '英文' : '中文'}</p>
                  {selectedVersion.comment && (
                    <p>备注: {selectedVersion.comment}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeVersionView}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;