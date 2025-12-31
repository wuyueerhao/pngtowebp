# PNG 转 WebP 转换器

一个基于 Next.js 的在线图片格式转换工具，支持 PNG/JPG 转换为 WebP 格式，部署在 Cloudflare Pages。

## ✨ 特性

- 🚀 **快速转换** - 基于浏览器 Canvas API，无需服务器处理
- 🔒 **隐私保护** - 所有图片处理在本地完成，不会上传到服务器
- 📦 **批量处理** - 支持一次转换多个图片文件
- 🎨 **高级设置** - 自定义转换质量和调整图片尺寸
- 💰 **完全免费** - 零成本部署和使用
- 📱 **响应式设计** - 完美适配桌面和移动端
- 🎯 **标准化样式** - 模块化CSS架构，易于维护

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建项目

```bash
# 构建静态文件
npm run build

# 本地测试构建结果
cd out && python3 -m http.server 8000
```

## 🌐 Cloudflare Pages 部署

### 重要配置

**构建模式**: 静态导出 (Static Export)
**构建输出**: `out` 目录
**构建命令**: `npm run build`

### 方法 1: GitHub 同步（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "部署到 Cloudflare Pages"
   git push origin main
   ```

2. **Cloudflare Dashboard 设置**
   - 访问 https://dash.cloudflare.com
   - Workers & Pages → Create → Pages
   - 选择 **Connect to Git**
   - 选择你的 GitHub 仓库

3. **构建配置**
   ```
   构建命令: npm run build
   构建输出目录: out
   根目录: /
   Node.js 版本: 18 (推荐)
   ```

4. **保存并部署**

### 方法 2: Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 构建并部署
npm run build
wrangler pages deploy out --project-name=pngtowebp
```

### 方法 3: 直接上传

1. 运行 `npm run build`
2. 在 Cloudflare Pages 创建项目
3. 上传 `out` 文件夹的所有内容

## 🔧 故障排除

### 部署后出现 404 错误

**原因**: 构建配置不正确

**解决方案**:
1. 确保 Cloudflare Pages 构建输出目录设置为 `out`
2. 确保构建命令是 `npm run build`
3. 检查 `next.config.js` 中有 `output: 'export'` 配置

### 本地测试

```bash
# 清理并重新构建
rm -rf out .next
npm run build

# 检查输出文件
ls out/
# 应该看到: index.html, advanced.html, about.html, _redirects

# 本地测试
cd out
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 📁 项目结构

```
pngtowebp/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 主页
│   │   ├── advanced/page.tsx     # 高级转换器
│   │   ├── about/page.tsx        # 关于页面
│   │   ├── not-found.tsx         # 404 页面
│   │   └── layout.tsx            # 布局
│   ├── components/
│   │   ├── ImageConverter.tsx    # 基础转换器
│   │   └── AdvancedConverter.tsx # 高级转换器
│   └── styles/
│       ├── globals.css           # 全局样式和导入
│       ├── layout.css            # 布局相关样式
│       ├── components.css        # 通用组件样式
│       ├── converter.css         # 基础转换器样式
│       └── advanced-converter.css # 高级转换器样式
├── public/
│   ├── favicon.ico               # 网站图标
│   └── manifest.webmanifest      # PWA配置
├── next.config.js                # Next.js 静态导出配置
├── package.json
├── README.md
└── PROGRESS.md                   # 项目进度文档
```

## 🎨 样式架构

### CSS 模块化设计
项目采用模块化CSS架构，将样式按功能分离：

- **globals.css** - 全局样式、基础组件、工具类
- **layout.css** - 页面布局、导航、页脚样式
- **components.css** - 通用组件、设置面板、信息框
- **converter.css** - 基础转换器专用样式
- **advanced-converter.css** - 高级转换器专用样式

### 响应式设计
完整的移动端优化：
- **桌面端** (>768px) - 完整功能布局
- **平板端** (768px-480px) - 适配中等屏幕
- **手机端** (<480px) - 优化触摸操作

### 性能优化
- ✅ CSS缓存和压缩
- ✅ 减少内联样式的运行时计算
- ✅ 模块化加载，按需引入
- ✅ 标准化的类名，便于维护

## 🎯 功能说明

### 基础转换器 (`/`)
- 拖拽上传图片
- 批量处理支持
- 实时进度显示
- 下载转换后的 WebP

### 高级转换器 (`/advanced`)
- 质量调整 (1-100%)
- 尺寸调整 (宽度/高度)
- 保持宽高比
- 批量高级处理

### 关于页面 (`/about`)
- 项目介绍
- 使用指南
- 隐私说明

## 🔒 隐私保护

**所有图片处理在浏览器本地完成**，不会上传到任何服务器：
- ✅ 100% 数据隐私
- ✅ 无需担心数据泄露
- ✅ 适合处理敏感图片
- ✅ 节省服务器带宽

## 📊 性能对比

| 特性 | 浏览器 Canvas | 服务器处理 |
|------|---------------|------------|
| 转换速度 | ⚡ 快 2-3 倍 | 较慢 |
| 成本 | 💰 完全免费 | 有费用 |
| 隐私 | 🔒 100% 本地 | 需上传 |
| 部署 | ✅ 简单 | 复杂 |

## 🛠️ 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器
npm run build        # 构建静态文件
npm start            # 生产启动
npm run lint         # 代码检查
```

## 🐛 常见问题

**Q: 为什么转换速度这么快？**
A: 使用浏览器 Canvas API 硬件加速，无需网络传输。

**Q: 有文件大小限制吗？**
A: 取决于浏览器内存，建议处理 < 50MB 的文件。

**Q: 支持哪些格式？**
A: 输入: PNG, JPG, JPEG, WebP, GIF → 输出: WebP

**Q: 部署后页面空白或404？**
A: 检查 Cloudflare Pages 构建输出目录是否设置为 `out`。

## 📞 需要帮助？

查看项目中的 `PROGRESS.md` 了解详细的项目进度和技术实现。

## 📄 许可证

MIT License

---

**Made with ❤️ for Cloudflare Pages**