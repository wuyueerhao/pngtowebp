import { NextRequest, NextResponse } from 'next/server'

// 这个 API 路由演示如何在服务器端处理图片转换
// 注意：在 Cloudflare Pages 上，这个功能可能受限
// 建议使用前端 Canvas API 或部署到 Cloudflare Workers

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: '请使用 multipart/form-data 格式上传' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '只支持 PNG, JPG, JPEG 格式' },
        { status: 400 }
      )
    }

    // 读取文件数据
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 注意：在 Cloudflare Pages 环境中，Sharp 库不可用
    // 这里我们提供一个基于 Canvas 的替代方案说明

    return NextResponse.json({
      success: true,
      message: '文件接收成功',
      info: '由于 Cloudflare Pages 是静态托管环境，无法运行 Node.js 的 Sharp 库。推荐方案：',
      solutions: [
        '1. 使用前端 Canvas API（已在本应用中实现）',
        '2. 部署到 Cloudflare Workers + WASM cwebp',
        '3. 使用第三方图片处理服务',
        '4. 部署到支持 Node.js 的平台（如 Vercel）'
      ],
      originalSize: buffer.length,
      fileName: file.name
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}