/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置（Cloudflare Pages 需要）
  output: 'export',
  
  // 图片优化配置（Cloudflare Pages 不支持 Next.js Image Optimization）
  images: {
    unoptimized: true,
  },

  // 确保生成静态 HTML
  trailingSlash: false,

  // 编译配置
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig