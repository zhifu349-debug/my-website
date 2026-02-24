// 模板预览API路由

import { NextRequest, NextResponse } from 'next/server';
import { templateEngine } from '@/lib/template-engine';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { variables } = await request.json();
    const preview = await templateEngine.previewTemplate(id, variables);
    return NextResponse.json(preview, { status: 200 });
  } catch (error) {
    console.error('Error previewing template:', error);
    return NextResponse.json({ error: 'Failed to preview template' }, { status: 500 });
  }
}
