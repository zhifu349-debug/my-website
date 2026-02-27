"use client";

import { useState } from "react";
import { CMSContent } from "@/lib/cms-types";
import { notify } from "@/components/admin/Notification";

interface ContentManagementTabProps {
  contents: CMSContent[];
  onCreate: () => void;
  onEdit: (content: CMSContent) => void;
  onDelete: (id: string) => void;
  onViewVersionHistory: (contentId: string) => void;
  onBatchActionComplete: () => void;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function ContentManagementTab({
  contents,
  onCreate,
  onEdit,
  onDelete,
  onViewVersionHistory,
  onBatchActionComplete,
  loading,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: ContentManagementTabProps) {
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "publish" | "draft" | "archive" | null
  >(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // 拖拽处理
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
      e.currentTarget.style.transform = 'scale(1.02)';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'scale(1)';
    }
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggingId) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingId && draggingId !== id) {
      notify.success('内容排序已更新');
      setDraggingId(null);
      setDragOverId(null);
    }
  };

  // 选择处理
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContentIds(contents.map((content) => content.id));
    } else {
      setSelectedContentIds([]);
    }
  };

  const handleSelectContent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedContentIds((prev) => [...prev, id]);
    } else {
      setSelectedContentIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  // 批量操作
  const handleBatchAction = async (action: "delete" | "publish" | "draft" | "archive") => {
    if (selectedContentIds.length === 0) return;

    if (action === "delete") {
      setConfirmAction("delete");
      setShowConfirmDialog(true);
    } else {
      await performBatchAction(action);
    }
  };

  const performBatchAction = async (action: "delete" | "publish" | "draft" | "archive") => {
    try {
      if (action === "delete") {
        const deletePromises = selectedContentIds.map((id) =>
          fetch(`/api/contents/${id}`, { method: "DELETE" })
        );
        await Promise.all(deletePromises);
      } else {
        const status = action === "publish" ? "published" : action === "draft" ? "draft" : "archived";
        const updatePromises = selectedContentIds.map((id) =>
          fetch(`/api/contents/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        );
        await Promise.all(updatePromises);
      }
      
      onBatchActionComplete();
      setSelectedContentIds([]);
      
      const actionText = {
        delete: "删除",
        publish: "发布",
        draft: "设为草稿",
        archive: "归档"
      };
      notify.success(`批量${actionText[action]}成功！`);
    } catch (error) {
      console.error("Failed to perform batch action:", error);
      notify.error("批量操作失败，请重试");
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction) {
      await performBatchAction(confirmAction);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold">所有内容</h2>
            <p className="text-sm text-gray-500 mt-1">管理和编辑网站内容</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onCreate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-300"
            >
              + 创建新内容
            </button>
          </div>
        </div>

        {/* 批量操作工具栏 */}
        {selectedContentIds.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-700 font-medium">
              已选择 {selectedContentIds.length} 项
            </span>
            <button
              onClick={() => handleBatchAction("publish")}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200"
            >
              批量发布
            </button>
            <button
              onClick={() => handleBatchAction("delete")}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedContentIds([])}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 ml-auto"
            >
              取消选择
            </button>
          </div>
        )}

        {/* 内容表格 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedContentIds.length === contents.length && contents.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                    disabled={loading}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">更新时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4"><div className="animate-pulse h-4 bg-gray-200 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse h-4 bg-gray-200 rounded w-1/4"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse h-6 bg-gray-200 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse h-4 bg-gray-200 rounded w-1/3"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse h-4 bg-gray-200 rounded w-1/4"></div></td>
                  </tr>
                ))
              ) : contents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    暂无内容，点击上方按钮创建
                  </td>
                </tr>
              ) : (
                contents.map((content: CMSContent) => (
                  <tr 
                    key={content.id} 
                    className={`${selectedContentIds.includes(content.id) ? "bg-blue-50" : ""} ${dragOverId === content.id ? "bg-gray-100 border-l-4 border-blue-500" : ""} transition-all duration-200`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, content.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, content.id)}
                    onDrop={(e) => handleDrop(e, content.id)}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedContentIds.includes(content.id)}
                        onChange={(e) => handleSelectContent(content.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{content.title.en}</p>
                      <p className="text-sm text-gray-500">{content.title.zh}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize hidden sm:table-cell">
                      {content.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        content.status === "published"
                          ? "bg-green-100 text-green-800"
                          : content.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        {content.status === "published" ? "已发布" : content.status === "draft" ? "草稿" : "归档"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(content.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => onEdit(content)} className="text-blue-600 hover:text-blue-800">编辑</button>
                        <button onClick={() => onViewVersionHistory(content.id)} className="text-purple-600 hover:text-purple-800">版本</button>
                        <button onClick={() => onDelete(content.id)} className="text-red-600 hover:text-red-800">删除</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控件 */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">每页：</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500">共 {totalItems} 条</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {"<"}
            </button>
            <span className="px-3 py-2 border rounded-md text-sm bg-gray-50 min-w-[50px] text-center">
              {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage * pageSize >= totalItems || loading}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => onPageChange(Math.ceil(totalItems / pageSize))}
              disabled={currentPage * pageSize >= totalItems || loading}
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">确认操作</h3>
            <p className="text-gray-600 mb-6">
              确定要删除选中的 {selectedContentIds.length} 条内容吗？此操作不可撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowConfirmDialog(false); setConfirmAction(null); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
