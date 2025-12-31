/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 部署配置
  output: 'standalone',

  // 图片优化配置（Cloudflare Pages 不支持 Next.js Image Optimization）
  images: {
    unoptimized: true,
  },

  // 实验性功能
  experimental: {
    serverActions: true,
  },

  // Webpack 配置
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // 如果需要，可以在这里添加 polyfills
    }
    return config
  },
}

module.exports = nextConfig