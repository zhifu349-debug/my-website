/**
 * 飞书 Webhook 接收处理
 * 用于接收飞书消息并自动回复
 */

import { NextRequest, NextResponse } from 'next/server';

// 飞书配置（从环境变量读取）
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const FEISHU_VERIFICATION_TOKEN = process.env.FEISHU_VERIFICATION_TOKEN || '';

// 存储 Chat ID（实际应用应该用数据库）
let storedChatId: string | null = null;

/**
 * 验证飞书请求
 */
function verifyFeishuRequest(token: string): boolean {
  return token === FEISHU_VERIFICATION_TOKEN;
}

/**
 * 发送消息到飞书
 */
async function sendFeishuMessage(chatId: string, text: string) {
  try {
    // 获取访问令牌
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    });
    
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.tenant_access_token;
    
    // 发送消息
    const sendRes = await fetch('https://open.feishu.cn/open-apis/message/v4/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        chat_id: chatId,
        msg_type: 'text',
        content: {
          text: text,
        },
      }),
    });
    
    return await sendRes.json();
  } catch (error) {
    console.error('发送飞书消息失败:', error);
    throw error;
  }
}

/**
 * Webhook 处理入口
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 处理URL验证（首次配置时需要）
    if (body.type === 'url_verification') {
      return NextResponse.json({
        challenge: body.challenge,
      });
    }
    
    // 处理消息事件
    if (body.header?.event_type === 'im.message.receive_v1') {
      const event = body.event;
      const message = event.message;
      const sender = event.sender;
      
      // 获取聊天ID
      const chatId = message.chat_id;
      const chatType = message.chat_type; // 'p2p' 或 'group'
      
      // 存储Chat ID
      storedChatId = chatId;

      // 获取消息内容
      const content = JSON.parse(message.content);
      const text = content.text || '';
      
      console.log(`用户消息: ${text}`);
      
      // 简单自动回复逻辑
      let replyText = '';
      
      if (text.includes('你好') || text.includes('hi') || text.includes('hello')) {
        replyText = '你好！我是OpenClaw助手，有什么可以帮你的吗？\n\n我可以：\n1. 发送网站更新通知\n2. 查询联盟收入数据\n3. 管理网站内容';
      } else if (text.includes('帮助') || text.includes('help')) {
        replyText = '可用命令：\n- "状态"：查看网站状态\n- "统计"：查看今日数据\n- "通知"：测试消息推送\n- "帮助"：显示此帮助';
      } else if (text.includes('状态')) {
        replyText = '✅ 网站运行正常\n📊 今日访问量：1,234\n💰 今日收入：$45.60\n📝 待发布文章：3篇';
      } else if (text.includes('通知')) {
        replyText = '这是一条测试通知！\n\n如果你收到这条消息，说明飞书对接已成功！🎉';
      } else {
        replyText = `收到你的消息："${text}"\n\n我目前只支持简单回复，更多功能开发中...`;
      }
      
      // 发送回复
      await sendFeishuMessage(chatId, replyText);
      
      return NextResponse.json({ code: 0, msg: 'success' });
    }
    
    return NextResponse.json({ code: 0, msg: 'success' });
  } catch (error) {
    console.error('处理飞书消息失败:', error);
    return NextResponse.json(
      { code: -1, msg: 'error', error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * 获取存储的Chat ID（用于主动推送）
 */
export function getStoredChatId(): string | null {
  return storedChatId;
}

/**
 * 主动推送消息API
 */
export async function pushToFeishu(text: string) {
  if (!storedChatId) {
    throw new Error('未获取到Chat ID，请先与机器人互动');
  }
  
  return await sendFeishuMessage(storedChatId, text);
}

export const runtime = 'edge';
