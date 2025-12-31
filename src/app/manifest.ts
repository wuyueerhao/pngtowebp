import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PNG 转 WebP 转换器',
    short_name: 'PNG to WebP',
    description: '快速、安全的在线图片格式转换工具',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['utilities', 'productivity'],
    lang: 'zh-CN',
    dir: 'ltr',
  }
}