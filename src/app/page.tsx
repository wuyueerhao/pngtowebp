import ImageConverter from '../components/ImageConverter'

export default function Home() {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        {/* 导航栏 */}
        <nav className="navbar">
          <div className="navbar-brand">
            🚀 PNG 转 WebP
          </div>
          <div className="navbar-nav">
            <a href="/advanced.html" className="nav-link advanced">
              高级版
            </a>
            <a href="/about.html" className="nav-link">
              关于
            </a>
          </div>
        </nav>

        {/* 头部 */}
        <header className="page-header">
          <div className="page-icon">📸</div>
          <h1 className="page-title">
            PNG 转 WebP 转换器
          </h1>
          <p className="page-subtitle">
            高质量、快速、免费的图片格式转换工具<br />
            <span className="page-description">🔒 100% 隐私保护 - 所有处理在浏览器本地完成</span>
          </p>
        </header>

        {/* 特性列表 */}
        <div className="features-grid">
          {[
            { icon: '⚡', text: '快速转换' },
            { icon: '🔒', text: '隐私保护' },
            { icon: '📦', text: '批量处理' },
            { icon: '🎨', text: '高质量' }
          ].map((item, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{item.icon}</div>
              <div className="feature-text">{item.text}</div>
            </div>
          ))}
        </div>

        <ImageConverter />

        {/* 快速操作 */}
        <div className="quick-actions">
          <div className="quick-actions-title">
            💡 需要更多功能？
          </div>
          <div className="quick-actions-content">
            <a href="/advanced.html" className="quick-action-btn">
              高级转换器 →
            </a>
            <span className="quick-action-text">
              质量调整 + 尺寸控制
            </span>
          </div>
        </div>

        <footer className="page-footer">
          <p>支持 PNG, JPG, JPEG, WebP, GIF → WebP</p>
          <p className="footer-info">
            基于 Next.js + Cloudflare Pages 部署
          </p>
          <p className="footer-copyright">
            © 2025 PNG to WebP Converter | 
            <a href="https://recordmind.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              World
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}