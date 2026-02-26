# 飞书环境变量配置

## 添加到 .env.local 文件

```bash
# 飞书应用配置（从飞书开放平台获取）
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxx
FEISHU_ENCRYPT_KEY=xxxxxxxxxxxxxxxxxx（可选）

# Webhook URL（部署后填写）
# 格式: https://你的域名/api/feishu/webhook
# 例如: https://www.xcodezg.com/api/feishu/webhook
```

## 获取这些值的步骤

### 1. App ID 和 App Secret
飞书开放平台 → 你的应用 → 凭证与基础信息

### 2. Verification Token
飞书开放平台 → 事件订阅 → 点击"生成"

### 3. Encrypt Key（可选）
如果需要加密，同样在事件订阅页面生成

## 部署后配置

1. 部署网站到 Vercel
2. 获取部署后的域名
3. 在飞书事件订阅中配置 Webhook URL:
   ```
   https://你的域名/api/feishu/webhook
   ```
4. 在 Vercel 环境变量中添加 FEISHU_APP_ID 等配置
5. 重新部署

## 测试

部署完成后，在飞书里给机器人发消息，应该能收到自动回复。
