import { NextRequest, NextResponse } from 'next/server'
import { contentStore } from '@/lib/content-store'
import { MediaFile } from '@/lib/cms-types'
import { writeFile } from 'fs/promises'
import path from 'path'

// POST /api/media/upload - 上传媒体文件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as MediaFile['type'] || 'image'
    const alt = formData.get('alt') as string || file.name
    const tags = (formData.get('tags') as string || '').split(',').filter(Boolean)

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // 验证文件大小 (最大10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // 生成文件名
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${file.name}`

    // 保存到public目录
    const publicDir = path.join(process.cwd(), 'public', 'uploads')
    const filepath = path.join(publicDir, filename)

    // 确保uploads目录存在
    await writeFile(filepath, Buffer.from(await file.arrayBuffer()))

    // 获取图片尺寸（如果是图片）
    let width: number | undefined
    let height: number | undefined

    if (file.type.startsWith('image/')) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        // 这里可以添加图片尺寸检测逻辑
        // 简化处理：如果需要尺寸，可以使用sharp库
      } catch (e) {
        console.error('Failed to get image dimensions:', e)
      }
    }

    // 创建媒体记录
    const mediaData: Omit<MediaFile, 'id' | 'uploadedAt'> = {
      type,
      name: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      width,
      height,
      alt,
      uploadedBy: 'admin', // 实际应从session获取
      tags
    }

    const media = await contentStore.createMedia(mediaData)

    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
