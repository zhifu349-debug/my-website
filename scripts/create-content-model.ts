import { createClient } from 'contentful-management'

const spaceId = '5mfah267428e'
const managementToken = 'CFPAT-Sbl_udUT0Cx8VtylWzaoKnXmhvN_9fzaJ1HguvGs8P4'

// 创建 Content Model 的脚本
async function createContentModel() {
  if (!managementToken || managementToken === 'your_management_token_here') {
    console.error('❌ 请设置 CONTENTFUL_MANAGEMENT_TOKEN 环境变量')
    console.log('📝 获取步骤：')
    console.log('1. 进入 Contentful 控制台')
    console.log('2. Settings > API keys')
    console.log('3. 复制 "Content Management API - Personal access token"')
    return
  }

  try {
    console.log('🔗 正在连接 Contentful...')
    const client = createClient({ accessToken: managementToken })
    const space = await client.getSpace(spaceId)
    const environment = await space.getEnvironment('master')

    console.log('✅ 已连接到空间:', space.name)

    // 检查 Content Model 是否已存在
    const existingModels = await environment.getContentTypes()
    const existingModel = existingModels.items.find((m: any) => m.sys.id === 'content')

    if (existingModel) {
      console.log('⚠️  Content Model 已存在，正在更新...')
      await environment.deleteContentType(existingModel.sys.id)
    }

    console.log('📦 正在创建 Content Model: Content...')

    // 创建 Content Model
    const contentModel = await environment.createContentType({
      name: 'Content',
      description: '网站主要内容',
      displayField: 'title',
    })

    // 添加字段
    const fields = [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [],
        disabled: false,
        omitted: false,
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        localized: true,
        required: false,
        validations: [
          {
            unique: true,
          },
        ],
        disabled: false,
        omitted: false,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        localized: true,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
      },
      {
        id: 'content',
        name: 'Content',
        type: 'RichText',
        localized: true,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
      },
      {
        id: 'coverImage',
        name: 'Cover Image',
        type: 'Link',
        linkType: 'Asset',
        localized: true,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
      },
      {
        id: 'type',
        name: 'Type',
        type: 'Symbol',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
      },
      {
        id: 'status',
        name: 'Status',
        type: 'Symbol',
        localized: false,
        required: false,
        validations: [
          {
            in: ['draft', 'published', 'archived'],
          },
        ],
        disabled: false,
        omitted: false,
      },
    ]

    for (const field of fields) {
      try {
        await contentModel.createField(field)
        console.log(`✅ 已创建字段: ${field.name}`)
      } catch (error: any) {
        console.error(`❌ 创建字段失败 ${field.name}:`, error.message)
      }
    }

    // 更新模型以应用更改
    await contentModel.update()
    await contentModel.publish()

    console.log('🎉 Content Model 创建成功！')
    console.log('\n📋 已创建的字段：')
    fields.forEach((field) => {
      console.log(`  - ${field.name} (${field.id})`)
    })

    console.log('\n🚀 下一步：')
    console.log('1. 进入 Contentful 控制台')
    console.log('2. 点击 Content 标签')
    console.log('3. 点击 Add entry 创建第一条内容')

  } catch (error: any) {
    console.error('❌ 创建失败:', error.message)
    if (error.message.includes('access token')) {
      console.log('\n💡 提示：请使用 Content Management API Token')
    }
  }
}

// 运行脚本
createContentModel()
