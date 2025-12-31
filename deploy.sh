#!/bin/bash

# Cloudflare Pages 部署脚本

echo "🚀 开始部署到 Cloudflare Pages..."

# 检查是否安装了 Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 未检测到 Wrangler CLI"
    echo "请先安装: npm install -g wrangler"
    exit 1
fi

# 检查是否登录
if ! wrangler whoami &> /dev/null; then
    echo "❌ 未登录 Cloudflare"
    echo "请先登录: wrangler login"
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 询问项目名称
read -p "请输入 Cloudflare Pages 项目名称 (默认: png-to-webp): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-png-to-webp}

# 部署
echo "⬆️  部署到 Cloudflare Pages..."
wrangler pages deploy .next --project-name=$PROJECT_NAME

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "📊 查看项目: https://$PROJECT_NAME.pages.dev"
else
    echo "❌ 部署失败"
    exit 1
fi