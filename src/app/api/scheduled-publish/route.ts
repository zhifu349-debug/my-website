import { NextRequest, NextResponse } from 'next/server';
import { CMSContent, ContentStatus } from '@/lib/cms-types';

// 模拟内容存储
let contentStore: CMSContent[] = [];

// 检查并执行定时发布任务
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    // 查找所有需要发布的内容
    const contentToPublish = contentStore.filter(content => 
      content.status === 'scheduled' && 
      content.scheduledPublishAt && 
      new Date(content.scheduledPublishAt) <= now
    );
    
    // 更新内容状态为已发布
    for (const content of contentToPublish) {
      const index = contentStore.findIndex(c => c.id === content.id);
      if (index !== -1) {
        contentStore[index] = {
          ...contentStore[index],
          status: 'published' as ContentStatus,
          publishedAt: now,
          scheduledPublishAt: undefined
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      publishedCount: contentToPublish.length,
      publishedIds: contentToPublish.map(c => c.id)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process scheduled publish' },
      { status: 500 }
    );
  }
}

// 用于测试的POST端点，模拟添加定时发布内容
export async function POST(request: NextRequest) {
  try {
    const content = await request.json() as CMSContent;
    contentStore.push(content);
    return NextResponse.json({ success: true, id: content.id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add content' },
      { status: 500 }
    );
  }
}


