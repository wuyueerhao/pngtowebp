/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 优化配置
  images: {
    unoptimized: true,
  },

  // 确保静态导出兼容性
  trailingSlash: false,

  // 禁用生产环境的分析
  analyticsId: undefined,

  // Webpack 优化
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // 避免打包不必要的模块
      }
    }
    return config
  },
}

module.exports = nextConfig