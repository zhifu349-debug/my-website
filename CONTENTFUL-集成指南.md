# Contentful 集成指南

## 📋 前置准备

### 第1步：注册 Contentful 账户
1. 访问 https://www.contentful.com/sign-up/
2. 使用邮箱注册（推荐使用 GitHub 或 Google 登录）
3. 选择免费计划（Free plan）

### 第2步：创建空间
1. 登录后点击 "Create space"
2. 输入空间名称（例如：my-website）
3. 点击 "Create"

### 第3步：获取 API 密钥
1. 在顶部导航栏点击 **Settings** > **API keys**
2. 点击 **Add API key**
3. 填写名称（例如：Development），点击 **Save**
4. 复制以下信息：
   - **Space ID**
   - **Content Delivery API - access token**

### 第4步：配置环境变量
1. 复制 `.env.local.example` 为 `.env.local`
   ```bash
   cp .env.local.example .env.local
   ```

2. 编辑 `.env.local`，填入刚才复制的 API 密钥：
   ```env
   CONTENTFUL_SPACE_ID=your_actual_space_id
   CONTENTFUL_ACCESS_TOKEN=your_actual_access_token
   CONTENTFUL_ENVIRONMENT=master
   ```

## 🗄️ Content Model 设置

### 创建内容模型

1. 在 Contentful 控制台点击 **Content model** > **Add content type**
2. 输入名称：`Content`（标识符会自动生成）
3. 点击 **Create**

### 添加字段

为 `Content` 模型添加以下字段：

| 字段名 | 标识符 | 类型 | 必填 | 说明 |
|--------|--------|------|------|------|
| Title | title | Text | 是 | 标题 |
| Slug | slug | Short text | 否 | URL 路径 |
| Description | description | Text | 否 | 描述 |
| Content | content | Rich text | 否 | 正文内容 |
| Cover Image | coverImage | Media | 否 | 封面图 |
| Type | type | Short text | 否 | 内容类型 |
| Status | status | Short text | 否 | 状态 |
| Locale | locale | Short text | 否 | 语言 |

**注意：** 将 Title、Slug、Description 设置为本地化字段

### 配置字段

1. 点击每个字段的 **Settings** 图标
2. 勾选 **Localize field**（本地化）
3. 保存设置

## 📝 创建内容

### 第1步：创建内容
1. 点击 **Content** 标签
2. 点击 **Add entry**
3. 选择 **Content** 模型
4. 填写内容信息

### 第2步：填写双语内容
1. 点击右上角语言切换（默认是 en-US）
2. 添加 zh-CN（中文）
3. 分别填写英文和中文内容

### 第3步：发布
1. 点击 **Publish** 按钮
2. 内容即可在网站上显示

## 🚀 使用示例

### 获取所有内容
```typescript
import { getAllContents } from '@/lib/contentful'

const contents = await getAllContents()
```

### 获取指定类型内容
```typescript
import { getContentsByType } from '@/lib/contentful'

const vpsContents = await getContentsByType('vps')
```

### 根据 Slug 获取内容
```typescript
import { getContentBySlug } from '@/lib/contentful'

const content = await getContentBySlug('best-vps-2026', 'zh')
```

## 🎨 Contentful 后台功能

### 内容编辑
- ✅ 富文本编辑器（支持标题、段落、列表、图片等）
- ✅ 图片上传和管理
- ✅ 版本控制
- ✅ 草稿保存
- ✅ 发布/取消发布

### 多语言支持
- ✅ 自动语言切换
- ✅ 独立翻译
- ✅ 本地化字段管理

### 协作功能
- ✅ 多用户协作
- ✅ 权限管理
- ✅ 评论系统
- ✅ 变更历史

## 📊 免费额度

Contentful 免费计划包括：
- ✅ 1 个空间
- ✅ 25,000 条内容记录
- ✅ 2 名用户
- ✅ 48TB 带宽/月
- ✅ 25,000 API 请求/小时

**足够个人和小型项目使用！**

## 🔗 集成现有后台

当前架构：
```
Contentful 控制台 ← 小白用户管理内容
       ↓ (API)
   Next.js API
       ↓
  前台页面显示
```

保留的功能：
- `/admin` 后台作为开发者工具
- SEO 工具
- 数据分析
- 页面快捷编辑

## ❓ 常见问题

**Q: 数据存储在哪里？**
A: Contentful 云服务器，安全可靠

**Q: 可以导出数据吗？**
A: 可以，Contentful 提供导出功能

**Q: 免费版够用吗？**
A: 个人和小型项目完全够用

**Q: 如何备份？**
A: Contentful 自动备份，也可以手动导出

**Q: 迁移容易吗？**
A: 使用标准 API，迁移很方便

## 📚 更多资源

- [Contentful 文档](https://www.contentful.com/developers/docs/)
- [Content Model 设计](https://www.contentful.com/developers/docs/concepts/data-model/)
- [API 参考](https://www.contentful.com/developers/docs/references/content-delivery-api/)

## 🎯 下一步

1. ✅ 完成 Contentful 账户注册和配置
2. ✅ 创建 Content Model
3. ✅ 配置环境变量
4. ✅ 创建第一条测试内容
5. ✅ 在 Next.js 中调用 API 显示内容
