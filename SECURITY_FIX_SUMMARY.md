# 安全问题修复总结

## 修复日期
2026年2月25日

---

## 发现的问题

### 🔴 高风险：联盟链接 ID 暴露

**发现位置**：
- `src/lib/data/content-data.ts` - Vultr 和 Hetzner 的真实联盟推荐码
- `src/lib/affiliate-manager.ts` - 示例联盟链接

**具体暴露内容**：
```typescript
// 修复前
affiliateUrl: "https://www.vultr.com/?ref=9529593-8H"
affiliateUrl: "https://hetzner.cloud/?ref=GzWj5a7wVKrL"
```

**风险等级**：🔴 高风险

**潜在后果**：
- 联盟账户被恶意刷单导致封禁
- 佣金统计被污染
- 收入损失

---

## 已实施的修复

### 1. 创建联盟链接配置模块

**新增文件**：`src/lib/config/affiliate-links.ts`

```typescript
// 从环境变量读取联盟链接
export const affiliateLinks: AffiliateConfig = {
  vultr: process.env.AFFILIATE_VULTR || "https://www.vultr.com/",
  digitalocean: process.env.AFFILIATE_DIGITALOCEAN || "https://www.digitalocean.com/",
  // ...
};
```

### 2. 更新环境变量模板

**更新文件**：`.env.example`

新增联盟链接配置：
```env
# 联盟链接配置（敏感信息，请勿提交到Git）
AFFILIATE_VULTR=https://www.vultr.com/?ref=YOUR_VULTR_REF_ID
AFFILIATE_DIGITALOCEAN=https://www.digitalocean.com/?refcode=YOUR_DO_REF_CODE
AFFILIATE_LINODE=https://www.linode.com/?r=YOUR_LINODE_REF_ID
AFFILIATE_AWS=https://aws.amazon.com/lightsail
AFFILIATE_HETZNER=https://hetzner.cloud/?ref=YOUR_HETZNER_REF_ID

# AI 工具联盟链接
AFFILIATE_CHATGPT=https://chat.openai.com/
AFFILIATE_CLAUDE=https://claude.ai/
AFFILIATE_MIDJOURNEY=https://www.midjourney.com/
AFFILIATE_GITHUB_COPILOT=https://github.com/features/copilot
AFFILIATE_NOTION_AI=https://www.notion.so/product/ai
```

### 3. 更新内容数据文件

**更新文件**：`src/lib/data/content-data.ts`

所有联盟链接现在从配置文件导入：
```typescript
import { affiliateLinks } from "@/lib/config/affiliate-links";

export const vpsProviders = [
  {
    affiliateUrl: affiliateLinks.vultr,  // 不再是硬编码
    // ...
  }
];
```

### 4. 更新联盟管理器

**更新文件**：`src/lib/affiliate-manager.ts`

```typescript
private initializeDefaultLinks() {
  const defaultLinks: AffiliateLink[] = [
    {
      url: process.env.AFFILIATE_VULTR || "https://www.vultr.com/",
      // ...
    }
  ];
}
```

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/lib/config/affiliate-links.ts` | 新增 | 联盟链接配置模块 |
| `.env.example` | 更新 | 添加联盟链接环境变量 |
| `src/lib/data/content-data.ts` | 更新 | 使用环境变量替代硬编码链接 |
| `src/lib/affiliate-manager.ts` | 更新 | 从环境变量读取联盟链接 |
| `SECURITY_GUIDE.md` | 新增 | 安全配置指南文档 |

---

## 后续必须执行的操作

### 1. 创建本地环境配置文件

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入真实的联盟链接：
```env
AFFILIATE_VULTR=https://www.vultr.com/?ref=你的真实推荐码
AFFILIATE_DIGITALOCEAN=https://www.digitalocean.com/?refcode=你的真实推荐码
# ... 其他链接
```

### 2. 轮换已暴露的联盟凭证

由于之前的联盟码可能已被暴露，建议：

1. **Vultr**：
   - 登录联盟后台
   - 查看是否有异常点击
   - 如有必要，联系支持更换推荐码

2. **Hetzner**：
   - 检查联盟账户活动
   - 监控流量来源

3. **DigitalOcean / Linode**：
   - 查看点击和转化数据
   - 注意异常模式

### 3. 清理 Git 历史（可选但建议）

⚠️ **警告**：这将重写 Git 历史，需要团队协调！

```bash
# 安装 git-filter-repo
pip install git-filter-repo

# 清理敏感信息
git filter-repo --replace-text <(echo '9529593-8H==>REF_ID_PLACEHOLDER')
git filter-repo --replace-text <(echo 'GzWj5a7wVKrL==>REF_ID_PLACEHOLDER')

# 强制推送（谨慎操作！）
git push --force origin main
```

### 4. 部署时配置环境变量

**Vercel 部署**：
1. 进入项目 Dashboard
2. Settings → Environment Variables
3. 添加所有 `AFFILIATE_*` 变量

**服务器部署**：
```bash
# 在服务器上创建 .env.production
scp .env.local user@server:/app/.env.production
```

---

## 安全加固建议

### 立即执行
- [x] 从代码中移除硬编码联盟链接
- [x] 创建环境变量配置
- [ ] 创建 `.env.local` 并填入真实链接
- [ ] 检查 `.gitignore` 确保 `.env.local` 不被提交

### 短期执行
- [ ] 轮换已暴露的联盟凭证
- [ ] 监控联盟账户异常活动
- [ ] 添加 Git pre-commit hook 防止敏感信息提交
- [ ] 使用工具扫描历史提交中的敏感信息

### 长期维护
- [ ] 每月轮换 API 密钥
- [ ] 定期审查访问日志
- [ ] 启用联盟账户异常提醒
- [ ] 建立安全事件响应流程

---

## 风险评级

| 风险项 | 修复前 | 修复后 | 缓解措施 |
|--------|--------|--------|----------|
| 联盟链接暴露 | 🔴 高风险 | 🟢 低风险 | 已移至环境变量 |
| API 密钥管理 | 🟢 低风险 | 🟢 低风险 | 已正确使用 env |
| 代码公开暴露架构 | 🟡 中风险 | 🟡 中风险 | 正常业务风险 |

**总体安全评级**：🟢 安全（修复后）

---

## 参考文档

- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - 详细安全配置指南
- [.env.example](./.env.example) - 环境变量配置模板

---

## 联系支持

如发现其他安全问题，请：
1. 立即轮换相关凭证
2. 检查访问日志
3. 联系相关服务提供商

**记住**：安全是一个持续的过程，不是一次性的修复！
