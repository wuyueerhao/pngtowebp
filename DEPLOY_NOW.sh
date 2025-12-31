#!/bin/bash

# 🚀 快速部署脚本

echo "=================================="
echo "  PNG to WebP - 快速部署"
echo "=================================="
echo ""

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📦 1. 清理旧构建..."
rm -rf .next out
echo "✅ 清理完成"

echo ""
echo "🔨 2. 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 构建完成"

echo ""
echo "📁 3. 检查构建输出..."
if [ -d "out" ]; then
    echo "✅ out 目录存在"
    echo "   文件数量: $(find out -type f | wc -l)"
    echo "   HTML 文件: $(find out -name "*.html" | wc -l)"
else
    echo "❌ out 目录不存在"
    echo "请检查 next.config.js 中是否配置了 output: 'export'"
    exit 1
fi

echo ""
echo "=================================="
echo "  部署选项"
echo "=================================="
echo ""
echo "选项 1: Cloudflare Dashboard"
echo "  - 访问: https://dash.cloudflare.com"
echo "  - Workers & Pages → Create → Pages"
echo "  - 选择: Connect to Git 或 Upload assets"
echo "  - 构建命令: npm run build"
echo "  - 输出目录: out"
echo ""
echo "选项 2: Wrangler CLI"
echo "  - npm install -g wrangler"
echo "  - wrangler login"
echo "  - wrangler pages deploy out --project-name=your-name"
echo ""
echo "选项 3: GitHub Actions"
echo "  - git push origin main"
echo "  - 在 GitHub 仓库设置 Actions"
echo ""

echo "=================================="
echo "  测试本地构建"
echo "=================================="
echo ""
read -p "是否要测试本地构建？(y/n): " test_local

if [ "$test_local" = "y" ] || [ "$test_local" = "Y" ]; then
    echo ""
    echo "🚀 启动本地服务器..."
    echo "   访问: http://localhost:3000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    npm start
else
    echo ""
    echo "✅ 构建完成！现在可以部署到 Cloudflare Pages"
    echo ""
    echo "📖 详细指南: 查看 CLOUDFLARE_DEPLOY.md"
    echo "📋 项目进度: 查看 PROGRESS.md"
    echo "❓ 帮助文档: 查看 README.md"
fi