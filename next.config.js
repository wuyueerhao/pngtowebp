/** @type {import('next').NextConfig} */
const nextConfig = {
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