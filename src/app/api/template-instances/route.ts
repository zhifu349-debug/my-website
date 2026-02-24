// 模板实例管理API路由

import { NextRequest, NextResponse } from 'next/server';
import { contentStore } from '@/lib/content-store';
import { templateEngine } from '@/lib/template-engine';

export async function GET(request: NextRequest) {
  try {
    const instances = await (contentStore as any).getAllTemplateInstances();
    return NextResponse.json(instances, { status: 200 });
  } catch (error) {
    console.error('Error fetching template instances:', error);
    return NextResponse.json({ error: 'Failed to fetch template instances' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const instanceData = await request.json();
    const instance = await (contentStore as any).createTemplateInstance(instanceData);
    return NextResponse.json(instance, { status: 201 });
  } catch (error) {
    console.error('Error creating template instance:', error);
    return NextResponse.json({ error: 'Failed to create template instance' }, { status: 500 });
  }
}
