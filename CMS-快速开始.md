# CMS 快速开始指南

## 🎯 管理网站内容 - 三步走

### 第1步：访问管理后台

在浏览器打开：
```
http://localhost:3000/zh/admin
```
或部署后的域名：
```
https://www.xcodezg.com/zh/admin
```

**注意**：
- 访问时会显示新手引导，请按提示操作
- 右上角有【帮助】按钮，随时可以查看详细说明

### 第2步：上传图片/视频

1. 点击"媒体库"标签
2. 点击"上传图片/视频"按钮
3. 选择文件（支持 JPG, PNG, GIF, WebP, MP4, WebM）
4. 文件自动上传并显示在媒体库中

### 第3步：创建文章/内容

1. 点击"内容管理"标签
2. 点击"+ 创建新内容"按钮
3. 填写信息：
   - **内容类型**：推荐/评测/对比/教程/资源
   - **标题**：中英文标题
   - **封面图**：从媒体库选择
   - **SEO设置**：标题和描述
   - **内容区块**：添加文本、图片、视频等
4. 点击"发布"或"保存草稿"

---

## 📂 文件结构说明

```
/src
├── app/
│   ├── admin/           # 管理后台
│   │   └── page.tsx    # 主Dashboard
│   └── api/
│       ├── contents/      # 内容管理API
│       │   ├── route.ts         # GET/POST
│       │   └── [id]/route.ts    # GET/PUT/DELETE
│       └── media/
│           ├── route.ts            # 媒体列表API
│           └── upload/
│               └── route.ts      # 上传API
├── components/
│   └── admin/          # CMS组件
│       ├── ContentEditor.tsx      # 内容编辑器
│       └── MediaLibrary.tsx      # 媒体库
└── lib/
    ├── cms-types.ts      # CMS类型定义
    └── content-store.ts  # 内容存储（数据层）

/public
└── uploads/             # 上传的文件存放位置
```

---

## 🔧 API端点

### 内容管理

```
GET    /api/contents          # 获取所有内容
GET    /api/contents?type=xxx  # 按类型获取
GET    /api/contents?status=xxx # 按状态获取
POST   /api/contents          # 创建新内容
GET    /api/contents/:id      # 获取单个内容
PUT    /api/contents/:id      # 更新内容
DELETE /api/contents/:id      # 删除内容
```

### 媒体管理

```
GET    /api/media             # 获取所有媒体
GET    /api/media?type=image   # 按类型获取
POST   /api/media/upload      # 上传媒体
DELETE /api/media/:id         # 删除媒体
```

---

## 💾 数据存储说明

### 当前状态（开发模式）

内容存储在 `ContentStore` 类的内存中，特点：
- ✅ 快速开发和测试
- ⚠️ 服务器重启后数据丢失
- ⚠️ 不适合生产环境

### 生产环境建议

使用以下任一方式替换 `content-store.ts`：

#### 方案A：CloudBase（推荐）

```typescript
// 安装SDK
npm install @cloudbase/js-sdk

// 初始化
import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: 'your-env-id'
})

// 查询
const res = await app.database().collection('contents').get()
```

#### 方案B：Supabase

```typescript
// 安装客户端
npm install @supabase/supabase-js

// 初始化
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'your-supabase-url',
  'your-supabase-key'
)

// 查询
const { data, error } = await supabase
  .from('contents')
  .select('*')
```

#### 方案C：本地文件系统

```typescript
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// 保存
await fs.writeFile(
  path.join(DATA_DIR, 'contents.json'),
  JSON.stringify(contents, null, 2)
)

// 读取
const data = await fs.readFile(
  path.join(DATA_DIR, 'contents.json'),
  'utf-8'
)
```

---

## 🎨 自定义页面模板

如需自定义页面模板，编辑以下文件：

- `src/components/templates/RecommendationTemplate.tsx` - 推荐页模板
- `src/components/templates/ReviewTemplate.tsx` - 评测页模板
- `src/components/templates/ComparisonTemplate.tsx` - 对比页模板
- `src/components/templates/TutorialTemplate.tsx` - 教程页模板
- `src/components/templates/ResourceTemplate.tsx` - 资源页模板

---

## 🔐 安全性

### 当前状态

- ⚠️ 无身份验证
- ⚠️ 无访问控制
- ⚠️ 任何人都可以访问/admin

### 建议改进

添加身份验证系统：

```typescript
// src/app/admin/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('adminToken')
    if (!isLoggedIn) {
      router.push('/admin/login')
    }
  }, [])

  // ... 原有代码
}
```

---

## 📱 移动端使用

CMS完全支持移动设备：
- ✅ 响应式设计
- ✅ 触摸操作
- ✅ 移动端相机上传

---

## 🚀 下一步

1. **连接数据库**：将 `content-store.ts` 替换为真实数据库
2. **添加身份验证**：保护管理后台
3. **部署上线**：使用集成功能部署到云平台
4. **配置域名**：绑定自定义域名
5. **提交SEO**：提交到搜索引擎（Google、百度）

---

## ❓ 需要帮助？

- 查看 `CMS-使用指南.md` 了解完整功能
- 检查浏览器控制台错误
- 确认API服务器正常运行

---

**祝您使用愉快！** 🎉
