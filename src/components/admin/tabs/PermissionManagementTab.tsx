"use client";

import { useState, useEffect } from "react";
import { notify } from "@/components/admin/Notification";

interface RolePermission {
  role: string;
  permissions: Record<string, Record<string, boolean>>;
}

export default function PermissionManagementTab() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // 获取权限数据
  useEffect(() => {
    fetchPermissions();
  }, []);

  // 当选择角色变化时，更新权限数据
  useEffect(() => {
    if (rolePermissions.length > 0) {
      const rolePermission = rolePermissions.find(rp => rp.role === selectedRole);
      if (rolePermission) {
        setPermissions(rolePermission.permissions);
      }
    }
  }, [selectedRole, rolePermissions]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/permissions');
      const data = await response.json();
      if (data.success) {
        setRolePermissions(data.data);
        if (data.data.length > 0) {
          setSelectedRole(data.data[0].role);
          setPermissions(data.data[0].permissions);
        }
      } else {
        notify.error(`获取权限失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      notify.error('获取权限失败，请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (moduleId: string, actionId: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [actionId]: value
      }
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: selectedRole,
          permissions
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchPermissions();
        notify.success('权限保存成功！');
      } else {
        notify.error(`保存失败：${data.error || "未知错误"}`);
      }
    } catch (error) {
      console.error('Failed to save permissions:', error);
      notify.error('保存失败，请检查网络连接后重试');
    } finally {
      setSaving(false);
    }
  };

  const modules = [
    { id: 'content', name: '内容管理' },
    { id: 'media', name: '媒体库' },
    { id: 'users', name: '用户管理' },
    { id: 'settings', name: '系统设置' },
    { id: 'analytics', name: '数据分析' },
  ];

  const actions = [
    { id: 'view', name: '查看' },
    { id: 'create', name: '创建' },
    { id: 'update', name: '编辑' },
    { id: 'delete', name: '删除' },
    { id: 'manage', name: '管理' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">权限管理</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {rolePermissions.map(role => (
                <option key={role.role} value={role.role}>
                  {role.role === 'admin' ? '管理员' : role.role === 'editor' ? '编辑' : '查看者'}
                </option>
              ))}
            </select>
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {saving ? '保存中...' : '保存权限'}
            </button>
          </div>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 rounded-lg p-4 mb-6">
            权限保存成功！
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">模块</th>
                {actions.map(action => (
                  <th key={action.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {action.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map(module => (
                <tr key={module.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {module.name}
                  </td>
                  {actions.map(action => (
                    <td key={action.id} className="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module.id]?.[action.id] || false}
                        onChange={(e) => handlePermissionChange(module.id, action.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 管理员拥有所有权限</li>
          <li>• 编辑可以创建和编辑内容，但不能管理用户</li>
          <li>• 查看者只能查看内容，不能进行修改</li>
        </ul>
      </div>
    </div>
  );
}
