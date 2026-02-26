# Waline 评论系统部署指南

本文档将指导你如何在 Vercel 上部署 Waline 评论系统，并与 LeanCloud 数据库集成。

## 为什么选择 Waline？

- ✅ **完全开源** - MIT 许可证，可自托管
- ✅ **免费额度充足** - Vercel + LeanCloud 免费套餐足够个人使用
- ✅ **功能丰富** - 支持邮件通知、微信通知、邮件提醒
- ✅ **国内友好** - 支持 QQ、微信、微博登录
- ✅ **安全可靠** - 支持敏感词过滤、垃圾评论检测

---

## 第一步：创建 LeanCloud 应用

### 1.1 注册 LeanCloud

访问 [LeanCloud 国际版](https://console.leancloud.app/)（国内用户推荐使用国际版）

### 1.2 创建应用

1. 点击「创建应用」
2. 选择「开发版」（免费）
3. 填写应用名称，如 `xcodezg-comments`

### 1.3 获取凭证

1. 进入应用 → 设置 → 应用凭证
2. 记录以下信息：
   - `AppID`
   - `AppKey`
   - `MasterKey`

---

## 第二步：部署 Waline 到 Vercel

### 2.1 一键部署

点击下方按钮快速部署：

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/walinejs/waline/tree/main/example)

### 2.2 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `LEAN_ID` | 从 LeanCloud 获取 | AppID |
| `LEAN_KEY` | 从 LeanCloud 获取 | AppKey |
| `LEAN_MASTER_KEY` | 从 LeanCloud 获取 | MasterKey |
| `SITE_URL` | https://www.xcodezg.com | 你的网站地址 |
| `SITE_NAME` | xcodezg | 网站名称 |

### 2.3 可选配置

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SMTP_SERVICE` | QQ | 邮件服务提供商 |
| `SMTP_USER` | your@qq.com | SMTP 用户名 |
| `SMTP_PASS` | xxxxxxxx | SMTP 密码 |
| `AUTHOR_EMAIL` | admin@xcodezg.com | 管理员邮箱（收到评论通知） |
| `SECURE_DOMAINS` | www.xcodezg.com | 安全域名 |

### 2.4 部署完成

部署成功后，你会获得一个类似这样的地址：
```
https://xcodezg-waline.vercel.app
```

这就是你的 Waline 服务端地址。

---

## 第三步：配置网站

### 3.1 设置环境变量

在网站的 `.env.local` 文件中添加：

```env
NEXT_PUBLIC_WALINE_SERVER_URL=https://xcodezg-waline.vercel.app
```

### 3.2 部署网站

```bash
npm run build
# 或
vercel --prod
```

---

## 第四步：测试评论功能

1. 访问你的网站任意教程页面
2. 滚动到页面底部的评论区
3. 发表一条测试评论
4. 检查 LeanCloud 后台是否有数据

---

## 高级配置

### 邮件通知

配置 QQ 邮箱为例：

```env
SMTP_SERVICE=QQ
SMTP_USER=your@qq.com
SMTP_PASS=你的授权码
```

> 获取 QQ 邮箱授权码：QQ邮箱 → 设置 → 账户 → POP3/SMTP服务 → 开启

### 敏感词过滤

```env
FORBIDDEN_WORDS=傻逼,草泥马,他妈的
```

### 评论审核

```env
COMMENT_AUDIT=true
```

开启后，所有评论需要管理员审核才能显示。

### 微信通知

使用 Server 酱实现微信推送：

```env
SC_KEY=你的Server酱Key
```

---

## 常见问题

### Q: 评论显示 "Network Error"

**A:** 检查：
1. Waline 服务端是否正常运行
2. `NEXT_PUBLIC_WALINE_SERVER_URL` 是否配置正确
3. 跨域设置（`SECURE_DOMAINS`）

### Q: LeanCloud 报错 "Unauthorized"

**A:** 检查：
1. AppID、AppKey、MasterKey 是否正确
2. 应用是否在运行状态

### Q: 邮件通知不工作

**A:** 检查：
1. SMTP 配置是否正确
2. 邮箱是否开启 SMTP 服务
3. 使用的是授权码而非密码

---

## 管理评论

### 访问管理后台

访问 `https://your-waline.vercel.app/ui` 登录管理后台。

首次登录需要注册，第一个注册的用户自动成为管理员。

### 功能

- 查看所有评论
- 删除/编辑评论
- 标记为垃圾评论
- 查看用户列表
- 配置邮件模板

---

## 费用预估

| 服务 | 免费额度 | 预计使用 |
|------|----------|----------|
| Vercel | 100GB 流量/月 | < 1GB |
| LeanCloud | 10万次请求/天 | < 1000次/天 |

**结论：完全免费，无需担心费用。**

---

## 技术支持

- [Waline 官方文档](https://waline.js.org/)
- [Waline GitHub](https://github.com/walinejs/waline)
- [LeanCloud 文档](https://leancloud.cn/docs/)

---

## 更新记录

- 2026-02-26: 创建初始版本
