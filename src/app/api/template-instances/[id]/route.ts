// 单个模板实例管理API路由

import { NextRequest, NextResponse } from 'next/server';
import { contentStore } from '@/lib/content-store';
import { templateEngine } from '@/lib/template-engine';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const instance = await (contentStore as any).getTemplateInstanceById(id);
    if (!instance) {
      return NextResponse.json({ error: 'Template instance not found' }, { status: 404 });
    }
    return NextResponse.json(instance, { status: 200 });
  } catch (error) {
    console.error('Error fetching template instance:', error);
    return NextResponse.json({ error: 'Failed to fetch template instance' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const instance = await (contentStore as any).updateTemplateInstance(id, updates);
    if (!instance) {
      return NextResponse.json({ error: 'Template instance not found' }, { status: 404 });
    }
    return NextResponse.json(instance, { status: 200 });
  } catch (error) {
    console.error('Error updating template instance:', error);
    return NextResponse.json({ error: 'Failed to update template instance' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await (contentStore as any).deleteTemplateInstance(id);
    if (!success) {
      return NextResponse.json({ error: 'Template instance not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Template instance deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting template instance:', error);
    return NextResponse.json({ error: 'Failed to delete template instance' }, { status: 500 });
  }
}

// 从模板实例创建内容
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const content = await templateEngine.createContentFromTemplateInstance(id);
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content from template instance:', error);
    return NextResponse.json({ error: 'Failed to create content from template instance' }, { status: 500 });
  }
}
