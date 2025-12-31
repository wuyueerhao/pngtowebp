#!/bin/bash

# 项目设置测试脚本

echo "🧪 PNG to WebP 转换器 - 环境测试"
echo "=================================="

# 检查 Node.js
echo -e "\n1. 检查 Node.js 版本..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"

    # 检查版本是否 >= 18
    if [[ "$NODE_VERSION" =~ ^v([0-9]+) ]]; then
        MAJOR_VERSION=${BASH_REMATCH[1]}
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            echo "✅ 版本符合要求 (>= 18)"
        else
            echo "❌ 版本过低，需要 Node.js 18+"
            exit 1
        fi
    fi
else
    echo "❌ Node.js 未安装"
    echo "请安装 Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# 检查 npm
echo -e "\n2. 检查 npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm 未安装"
    exit 1
fi

# 检查项目文件
echo -e "\n3. 检查项目文件..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不存在"
    exit 1
fi

if [ -d "src" ]; then
    echo "✅ src 目录存在"
else
    echo "❌ src 目录不存在"
    exit 1
fi

# 检查依赖
echo -e "\n4. 检查依赖..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules 已安装"
else
    echo "⚠️  node_modules 未安装，正在安装..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 依赖安装成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 测试构建
echo -e "\n5. 测试构建..."
if npm run build > /dev/null 2>&1; then
    echo "✅ 构建测试通过"
else
    echo "❌ 构建测试失败"
    echo "运行 'npm run build' 查看详细错误"
    exit 1
fi

# 检查构建输出
echo -e "\n6. 检查构建输出..."
if [ -d ".next" ]; then
    echo "✅ .next 目录已生成"
    SIZE=$(du -sh .next | cut -f1)
    echo "   大小: $SIZE"
else
    echo "❌ .next 目录未生成"
    exit 1
fi

# 检查关键文件
echo -e "\n7. 检查关键文件..."
KEY_FILES=(
    "src/app/page.tsx"
    "src/app/layout.tsx"
    "src/components/ImageConverter.tsx"
    "src/app/api/convert/route.ts"
    "next.config.js"
)

for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 缺失"
    fi
done

# 生成部署说明
echo -e "\n8. 生成部署说明..."
cat > DEPLOY_CHECKLIST.md << 'EOF'
# 部署前检查清单

## ✅ 已完成
- [x] Node.js 环境检查
- [x] 依赖安装
- [x] 项目构建测试
- [x] 关键文件检查

## 📋 部署选项

### 选项 1: Cloudflare Dashboard (推荐)
1. 访问 https://dash.cloudflare.com
2. Workers & Pages → Create → Pages
3. 连接 Git 仓库
4. 构建设置:
   - 命令: `npm run build`
   - 输出: `.next`
5. 部署

### 选项 2: Wrangler CLI
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy .next --project-name=your-project-name
```

### 选项 3: GitHub Actions
- 添加 Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- 使用提供的 workflow 文件

## 🔧 环境变量 (可选)
- NEXT_PUBLIC_MAX_FILE_SIZE=50MB
- NEXT_PUBLIC_MAX_BATCH_SIZE=20

## 🌐 访问地址
部署后访问: https://your-project-name.pages.dev

## 📞 需要帮助?
查看 DEPLOYMENT.md 获取详细指南
EOF

echo "✅ 部署检查清单已生成: DEPLOY_CHECKLIST.md"

echo -e "\n🎉 环境测试完成！"
echo "=================================="
echo "你可以通过以下方式启动开发服务器:"
echo "  npm run dev"
echo ""
echo "或者直接部署到 Cloudflare Pages"
echo "详细指南请查看: DEPLOYMENT.md"