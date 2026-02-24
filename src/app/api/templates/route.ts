// 模板管理API路由

import { NextRequest, NextResponse } from 'next/server';
import { contentStore } from '@/lib/content-store';
import { Template } from '@/lib/cms-types';
import { apiSecurity } from '@/lib/security/api-security';

// 验证请求是否来自已登录用户
function validateRequest(request: NextRequest): boolean {
  return apiSecurity.validateAuth(request);
}

export async function GET(request: NextRequest) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const type = request.nextUrl.searchParams.get('type');
    let templates: Template[];

    if (type) {
      templates = await contentStore.getTemplatesByType(type as any);
    } else {
      templates = await contentStore.getAllTemplates();
    }

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templateData = await request.json();
    const template = await contentStore.createTemplate(templateData);
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
