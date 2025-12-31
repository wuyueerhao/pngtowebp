export default function About() {
  return (
    <main className="main-container about-page">
      <div className="content-wrapper about-content">
        <header className="page-header about-header">
          <h1 className="page-title">关于我</h1>
          <p className="page-subtitle about-subtitle">PNG 转 WebP 转换器</p>
        </header>

        <section className="about-section">
          <h2 className="section-title">🎯 项目目标</h2>
          <p className="section-content">
            提供一个快速、安全、免费的在线图片格式转换工具，帮助用户轻松将 PNG、JPG 等格式转换为高效的 WebP 格式，减少文件大小，提升网页加载速度。
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-title">✨ 核心特性</h2>
          <ul className="section-list">
            <li className="section-list-item">🚀 <strong>快速转换</strong> - 基于浏览器 Canvas API，无需服务器处理</li>
            <li className="section-list-item">🔒 <strong>隐私保护</strong> - 所有处理在本地完成，文件不会上传到服务器</li>
            <li className="section-list-item">📦 <strong>批量处理</strong> - 支持同时转换多个文件，一键下载 ZIP</li>
            <li className="section-list-item">🎨 <strong>高级设置</strong> - 自定义质量、尺寸调整、画布模式</li>
            <li className="section-list-item">💰 <strong>完全免费</strong> - 无需注册，无使用限制</li>
          </ul>
        </section>

        <section className="about-section">
          <h2 className="section-title">🛠️ 技术实现</h2>
          <p className="section-content">
            本项目基于 Next.js 14 开发，使用 TypeScript 确保代码质量，通过 Canvas API 实现高质量的图片转换。
            部署在 Cloudflare Pages 上，享受全球 CDN 加速，确保快速访问。
          </p>
          <div className="info-box">
            <p className="info-box-content">
              💡 <span className="info-box-title">为什么选择浏览器端处理？</span><br />
              相比服务器端处理，浏览器端转换具有更快的速度、更好的隐私保护、零服务器成本等优势。
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">🌐 更多有趣好玩的项目</h2>
          <p className="section-content">
            分享和开发实用的在线工具，提升用户的工作效率。访问我的个人网站了解更多产品：
          </p>
          <div className="product-link-section">
            <a 
              href="https://recordmind.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="product-link"
            >
              🌟 RecordMind.com - 更多实用工具 🔗
            </a>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">📞 联系我</h2>
          <p className="section-content">
            如果在使用过程中遇到问题或有改进建议，欢迎通过 
            <a href="mailto:world@recordmind.com" className="contact-link">world@recordmind.com</a>
            联系我。
          </p>
          <p className="section-content">
            仓库地址：
            <a href="https://github.com/wuyueerhao/pngtowebp" target="_blank" rel="noopener noreferrer" className="repo-link">
              https://github.com/wuyueerhao/pngtowebp
            </a>
          </p>
        </section>

        <div className="about-footer">
          <div className="about-footer-nav">
            <a href="/" className="about-footer-link home">返回首页</a>
            <a href="/advanced.html" className="about-footer-link advanced">高级转换</a>
          </div>
          <p className="about-footer-copyright">
            © 2025 PNG to WebP Converter | 
            <a href="https://recordmind.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              World
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}