# 🚀 部署命令汇总

## 📋 一键部署命令

### 完整部署流程（复制粘贴即可）

```bash
# 1. 进入项目目录
cd /Users/darling/Downloads/Project/pngtowebp

# 2. 清理旧构建
rm -rf .next

# 3. 重新构建
npm run build

# 4. 验证构建
ls .next/server/app/
# 应该看到: index.html, advanced.html, about.html

# 5. 提交代码到 GitHub
git add .
git commit -m "部署到 Cloudflare Pages"
git push origin main

# 6. 在 Cloudflare Dashboard 创建项目
# - 访问: https://dash.cloudflare.com
# - Workers & Pages → Create → Pages
# - 选择: Connect to Git
# - 选择: wuyueerhao/pngtowebp
# - 构建命令: npm run build
# - 输出目录: .next
# - 点击: Save and Deploy
```

---

## 🎯 单独命令说明

### 构建相关
```bash
# 清理并重新构建（推荐）
rm -rf .next && npm run build

# 仅构建
npm run build

# 本地测试
npm run dev    # 开发模式
npm start      # 生产模式
```

### Git 相关
```bash
# 查看状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "描述信息"

# 推送到 GitHub
git push origin main

# 查看提交历史
git log --oneline -5
```

### 部署相关

#### 方法 1: GitHub 连接（推荐）
```bash
# 只需要推送代码
git push origin main
# Cloudflare 会自动构建和部署
```

#### 方法 2: Wrangler CLI
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy .next --project-name=pngtowebp
```

#### 方法 3: 验证构建输出
```bash
# 检查 HTML 文件
find .next -name "*.html" | wc -l
# 应该返回 3 或更多

# 查看文件大小
du -sh .next/

# 列出所有页面
ls .next/server/app/*.html
```

---

## 🔧 故障排除命令

### 如果部署失败

```bash
# 1. 完全清理
rm -rf .next node_modules package-lock.json

# 2. 重新安装
npm install

# 3. 重新构建
npm run build

# 4. 检查错误
npm run lint

# 5. 本地测试
npm start
# 访问 http://localhost:3000
```

### 如果 wrangler 警告

```bash
# 检查 wrangler.toml
cat wrangler.toml

# 应该包含:
# pages_build_output_dir = ".next"

# 或者删除它（如果使用 Dashboard）
rm wrangler.toml
```

### 如果 GitHub 连接失败

```bash
# 检查远程仓库
git remote -v
# 应该显示: https://github.com/wuyueerhao/pngtowebp.git

# 检查分支
git branch
# 应该是: main

# 强制推送
git push -u origin main --force
```

---

## 📊 部署状态检查

### 检查是否成功

```bash
# 1. 查看 GitHub 仓库
# 访问: https://github.com/wuyueerhao/pngtowebp
# 应该看到所有文件

# 2. 查看 Cloudflare 部署
# 访问: https://dash.cloudflare.com
# Workers & Pages → 你的项目 → Deployments
# 应该看到绿色的 "Active" 状态

# 3. 访问网站
# https://your-project.pages.dev
# 应该看到完整的应用
```

### 验证功能

```bash
# 本地测试所有功能
npm run dev
# 访问 http://localhost:3000
# 测试:
# - 主页拖拽上传
# - 高级页面设置
# - 关于页面
# - 下载功能
```

---

## 🎯 最快部署方式

### 如果你想要最快的方式：

```bash
# 1. 确保代码已提交
cd /Users/darling/Downloads/Project/pngtowebp
git add . && git commit -m "final" && git push origin main

# 2. 在浏览器打开
# https://dash.cloudflare.com

# 3. 创建 Pages 项目
# Workers & Pages → Create → Pages → Connect to Git
# 选择: wuyueerhao/pngtowebp
# 构建: npm run build
# 输出: .next
# 部署!
```

**预计时间**: 3-5 分钟

---

## 📞 需要帮助？

查看详细文档:
- `README.md` - 项目说明
- `PROGRESS.md` - 项目进度
- `CLOUDFLARE_DEPLOY.md` - 部署指南
- `TROUBLESHOOTING.md` - 故障排除

---

**记住**: 你的项目已经完全修复，现在应该可以正常部署了！ 🎉