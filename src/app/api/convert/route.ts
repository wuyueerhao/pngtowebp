import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      )
    }

    // 过滤有效的图片文件
    const validFiles = files.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      return validTypes.includes(file.type)
    })

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: '请选择有效的图片文件 (PNG, JPG, JPEG)' },
        { status: 400 }
      )
    }

    // 处理每个文件
    const results = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // 这里可以集成 cwebp，但 Cloudflare Pages 是静态托管
          // 所以我们返回客户端处理的指示
          // 或者使用 Canvas API（已在前端实现）

          return {
            name: file.name,
            size: file.size,
            type: file.type,
            message: '文件已准备就绪，请使用客户端转换功能'
          }
        } catch (error) {
          return {
            name: file.name,
            error: error instanceof Error ? error.message : '处理失败'
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      files: results,
      note: '由于 Cloudflare Pages 是静态托管，建议使用前端 Canvas API 进行转换。如需服务器端转换，请使用 Cloudflare Workers 或其他支持 cwebp 的环境。'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PNG to WebP Converter API',
    usage: 'POST /api/convert with multipart/form-data containing files',
    note: '推荐使用前端 Canvas API 进行转换，无需服务器处理'
  })
}