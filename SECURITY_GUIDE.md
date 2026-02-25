# 网站安全配置指南

## ⚠️ 安全风险提醒

GitHub 公开仓库中的代码**确实可能带来安全风险**，特别是当代码中包含敏感信息时。

---

## 已发现的安全问题

### 1. 🔴 联盟链接 ID 暴露（已修复）

**问题**：真实的联盟推荐码硬编码在代码中

```typescript
// 修复前（有风险）
affiliateUrl: "https://www.vultr.com/?ref=9529593-8H"

// 修复后（安全）
affiliateUrl: affiliateLinks.vultr  // 从环境变量读取
```

**风险**：
- 他人可获取你的联盟ID进行恶意点击/刷单
- 联盟账户可能被封禁
- 佣金统计被污染

### 2. 🟡 API 密钥配置

**问题**：Contentful/Supabase 等服务的 API 密钥

**当前状态**：✅ 已正确使用环境变量

```typescript
// 正确做法 ✅
const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
```

### 3. 🟡 管理员认证

**问题**：后台管理系统的认证信息

**建议**：确保 `ADMIN_PASSWORD_HASH` 使用强密码和 bcrypt 加密

---

## 安全加固步骤

### 步骤 1：创建本地环境配置文件

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入真实的联盟链接和其他敏感信息
nano .env.local
```

### 步骤 2：确保 .env.local 不被提交

检查 `.gitignore` 文件：

```gitignore
# 环境变量文件（敏感信息）
.env
.env.local
.env.*.local

# 其他敏感文件
*.pem
*.key
secrets/
```

### 步骤 3：配置真实的联盟链接

编辑 `.env.local`：

```env
# 替换为真实的联盟链接
AFFILIATE_VULTR=https://www.vultr.com/?ref=YOUR_REAL_REF_ID
AFFILIATE_DIGITALOCEAN=https://www.digitalocean.com/?refcode=YOUR_REAL_REF_CODE
AFFILIATE_LINODE=https://www.linode.com/?r=YOUR_REAL_REF_ID
AFFILIATE_HETZNER=https://hetzner.cloud/?ref=YOUR_REAL_REF_ID
```

### 步骤 4：清理 Git 历史（如已提交敏感信息）

⚠️ **警告**：这将重写 Git 历史，仅在必要时执行！

```bash
# 方法 1：使用 git-filter-repo（推荐）
git filter-repo --replace-text <(echo '9529593-8H==>YOUR_REF_ID_PLACEHOLDER')

# 方法 2：使用 BFG Repo-Cleaner
bfg --replace-text replacements.txt

# 强制推送到远程（会重写历史！）
git push --force
```

### 步骤 5：轮换已暴露的凭证

如果联盟链接已经暴露：

1. **Vultr**：登录联盟后台 → 生成新的推荐链接 → 更新旧的推广位置
2. **DigitalOcean**：联系联盟经理申请更换推荐码
3. **Hetzner**：创建新的推荐账户或使用新的推荐链接

---

## 安全最佳实践

### 1. 环境变量管理

| 文件 | 用途 | 是否提交到 Git |
|------|------|----------------|
| `.env.example` | 配置模板，包含占位符 | ✅ 是 |
| `.env.local` | 本地开发配置 | ❌ 否 |
| `.env.production` | 生产环境配置 | ❌ 否 |
| `.env` | 通用配置（可选） | ❌ 否 |

### 2. 敏感信息分类

**🔴 高度敏感（绝不可提交）**：
- 密码和哈希值
- API 密钥和 Token
- 私钥和证书
- 数据库连接字符串
- 联盟推荐码

**🟡 中度敏感（避免提交）**：
- 网站分析 ID（GA、GTM）
- 内部 API 端点
- 调试配置

**🟢 可公开**：
- 公开的联盟链接（不含个人ID）
- 站点 URL
- 通用配置

### 3. 代码审查清单

提交代码前检查：

```bash
# 搜索可能的敏感信息
grep -r "ref=[0-9]" src/  # 联盟推荐码
grep -r "sk-[a-zA-Z0-9]" src/  # API 密钥
grep -r "password" src/  # 密码
grep -r "token" src/  # Token
```

### 4. 使用 Git Hooks

创建 `.git/hooks/pre-commit`：

```bash
#!/bin/bash
# 防止提交敏感信息

if git diff --cached --name-only | grep -E "\.env(\.local)?$"; then
    echo "❌ 错误：不要提交 .env 或 .env.local 文件！"
    exit 1
fi

# 检查是否包含真实联盟链接
if git diff --cached | grep -E "ref=[0-9]{5,}"; then
    echo "⚠️  警告：检测到可能的联盟推荐码，请使用环境变量！"
    exit 1
fi

echo "✅ 安全检查通过"
exit 0
```

赋予执行权限：
```bash
chmod +x .git/hooks/pre-commit
```

---

## 部署安全建议

### Vercel 部署

使用 Environment Variables 功能：

1. 登录 Vercel Dashboard
2. 进入项目设置 → Environment Variables
3. 添加所有敏感配置：
   - `AFFILIATE_VULTR`
   - `AFFILIATE_DIGITALOCEAN`
   - `NEXT_PUBLIC_GA_ID`
   - 等...

### Docker 部署

使用 Docker Secrets 或环境变量：

```yaml
# docker-compose.yml
services:
  web:
    image: xcodezg
    env_file:
      - .env.production  # 服务器上的配置文件
```

---

## 定期安全检查

### 每月检查清单

- [ ] 检查是否有敏感信息被意外提交
- [ ] 轮换长期使用的 API 密钥
- [ ] 检查联盟账户是否有异常活动
- [ ] 更新依赖包的安全补丁
- [ ] 审查访问日志

### 工具推荐

```bash
# 扫描敏感信息
npm install -g trufflehog
trufflehog git file://.

# 或使用 GitGuardian
ggshield scan repo .
```

---

## 应急响应

如果发现敏感信息已泄露：

### 1. 立即行动（5分钟内）
- 撤销/轮换已暴露的凭证
- 暂时禁用受影响的服务

### 2. 短期措施（1小时内）
- 从代码中移除敏感信息
- 提交清理后的代码
- 通知相关服务提供商

### 3. 长期措施（24小时内）
- 审查访问日志
- 加强监控
- 更新安全策略

---

## 总结

| 风险等级 | 问题 | 状态 |
|----------|------|------|
| 🔴 高 | 联盟链接硬编码 | ✅ 已修复 |
| 🟡 中 | API 密钥管理 | ✅ 已正确使用环境变量 |
| 🟢 低 | 代码公开暴露架构 | ⚠️ 正常风险，可接受 |

**核心原则**：
1. 敏感信息绝不提交到 Git
2. 使用环境变量管理配置
3. 定期轮换凭证
4. 启用自动化安全检查

如有疑问，请参考：
- [GitHub 敏感数据删除指南](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP 安全配置指南](https://cheatsheetseries.owasp.org/cheatsheets/Configuration_Cheat_Sheet.html)
