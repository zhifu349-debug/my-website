import { NextRequest, NextResponse } from 'next/server';
import { permissionStore } from '@/lib/data/permission-store';
import { UpdateRolePermissionDto } from '@/types/user';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return !!token;
}

export async function GET(request: NextRequest) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rolePermissions = permissionStore.getRolePermissions();
    return NextResponse.json({ success: true, data: rolePermissions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const permissionData: UpdateRolePermissionDto = await request.json();

    // 验证数据
    if (!permissionData.role || !permissionData.permissions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 验证权限数据格式
    if (!permissionStore.validatePermissions(permissionData.permissions)) {
      return NextResponse.json({ error: 'Invalid permissions format' }, { status: 400 });
    }

    const updatedPermission = permissionStore.updateRolePermission(
      permissionData.role,
      permissionData.permissions
    );

    if (!updatedPermission) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPermission });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
