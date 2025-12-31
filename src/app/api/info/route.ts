import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    api: {
      convert: {
        method: 'POST',
        path: '/api/convert',
        description: '接收文件并返回转换信息',
        note: '实际转换在客户端完成，此API主要用于文件验证'
      },
      health: {
        method: 'GET',
        path: '/api/health',
        description: '健康检查端点'
      },
      info: {
        method: 'GET',
        path: '/api/info',
        description: 'API 信息和使用说明'
      }
    },
    client: {
      main: '/',
      advanced: '/advanced',
      description: '推荐使用客户端转换，无需服务器处理'
    },
    features: {
      formats: ['PNG', 'JPG', 'JPEG', 'WebP', 'GIF'],
      conversion: 'WebP 输出',
      quality: '1-100% 可调',
      resize: '宽高自定义',
      batch: '批量处理',
      privacy: '本地处理，无上传'
    }
  })
}