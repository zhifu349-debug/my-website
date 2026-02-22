import { RoleType, RolePermission, PERMISSION_MODULES, PERMISSION_ACTIONS } from '@/types/user';

class PermissionStore {
  private rolePermissions: RolePermission[] = [];

  constructor() {
    // 初始化默认角色权限
    this.initializeDefaultPermissions();
  }

  private initializeDefaultPermissions() {
    // 管理员：所有权限
    const adminPermission: RolePermission = {
      role: 'admin',
      permissions: {}
    };

    // 编辑：除了权限管理和系统设置外的所有权限
    const editorPermission: RolePermission = {
      role: 'editor',
      permissions: {}
    };

    // 查看者：只能查看
    const viewerPermission: RolePermission = {
      role: 'viewer',
      permissions: {}
    };

    // 为每个模块设置权限
    PERMISSION_MODULES.forEach(module => {
      const moduleId = module.id;
      
      // 为管理员设置所有权限
      adminPermission.permissions[moduleId] = {};
      PERMISSION_ACTIONS.forEach(action => {
        adminPermission.permissions[moduleId][action.id] = true;
      });

      // 为编辑设置权限
      editorPermission.permissions[moduleId] = {};
      PERMISSION_ACTIONS.forEach(action => {
        // 编辑不能管理权限和系统设置
        if (moduleId === 'permissions' || moduleId === 'settings') {
          editorPermission.permissions[moduleId][action.id] = false;
        } else {
          editorPermission.permissions[moduleId][action.id] = true;
        }
      });

      // 为查看者设置权限
      viewerPermission.permissions[moduleId] = {};
      PERMISSION_ACTIONS.forEach(action => {
        // 查看者只能查看
        viewerPermission.permissions[moduleId][action.id] = action.id === 'view';
      });
    });

    this.rolePermissions = [adminPermission, editorPermission, viewerPermission];
  }

  // 获取所有角色权限
  getRolePermissions(): RolePermission[] {
    return this.rolePermissions;
  }

  // 获取指定角色的权限
  getRolePermission(role: RoleType): RolePermission | undefined {
    return this.rolePermissions.find(rp => rp.role === role);
  }

  // 更新角色权限
  updateRolePermission(role: RoleType, permissions: RolePermission['permissions']): RolePermission | undefined {
    const index = this.rolePermissions.findIndex(rp => rp.role === role);
    if (index === -1) return undefined;

    this.rolePermissions[index] = {
      role,
      permissions
    };

    return this.rolePermissions[index];
  }

  // 检查用户是否有权限
  hasPermission(role: RoleType, moduleId: string, actionId: string): boolean {
    const rolePermission = this.getRolePermission(role);
    if (!rolePermission) return false;

    const modulePermissions = rolePermission.permissions[moduleId];
    if (!modulePermissions) return false;

    return modulePermissions[actionId] || false;
  }

  // 验证权限数据
  validatePermissions(permissions: RolePermission['permissions']): boolean {
    // 检查是否为每个模块设置了权限
    for (const module of PERMISSION_MODULES) {
      if (!permissions[module.id]) {
        return false;
      }

      // 检查是否为每个操作设置了权限
      for (const action of PERMISSION_ACTIONS) {
        if (permissions[module.id][action.id] === undefined) {
          return false;
        }
      }
    }

    return true;
  }
}

// 导出单例实例
export const permissionStore = new PermissionStore();
