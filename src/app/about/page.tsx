export default function About() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>关于我</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>PNG 转 WebP 转换器</p>
        </header>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>🎯 项目目标</h2>
          <p style={{ lineHeight: '1.6', color: '#475569', marginBottom: '1rem' }}>
            提供一个快速、安全、免费的在线图片格式转换工具，帮助用户轻松将 PNG、JPG 等格式转换为高效的 WebP 格式，减少文件大小，提升网页加载速度。
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>✨ 核心特性</h2>
          <ul style={{ lineHeight: '1.6', color: '#475569', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>🚀 <strong>快速转换</strong> - 基于浏览器 Canvas API，无需服务器处理</li>
            <li style={{ marginBottom: '0.5rem' }}>🔒 <strong>隐私保护</strong> - 所有处理在本地完成，文件不会上传到服务器</li>
            <li style={{ marginBottom: '0.5rem' }}>📦 <strong>批量处理</strong> - 支持同时转换多个文件，一键下载 ZIP</li>
            <li style={{ marginBottom: '0.5rem' }}>🎨 <strong>高级设置</strong> - 自定义质量、尺寸调整、画布模式</li>
            <li style={{ marginBottom: '0.5rem' }}>💰 <strong>完全免费</strong> - 无需注册，无使用限制</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>🛠️ 技术实现</h2>
          <p style={{ lineHeight: '1.6', color: '#475569', marginBottom: '1rem' }}>
            本项目基于 Next.js 14 开发，使用 TypeScript 确保代码质量，通过 Canvas API 实现高质量的图片转换。
            部署在 Cloudflare Pages 上，享受全球 CDN 加速，确保快速访问。
          </p>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#0c4a6e', margin: 0 }}>
              💡 <strong>为什么选择浏览器端处理？</strong><br />
              相比服务器端处理，浏览器端转换具有更快的速度、更好的隐私保护、零服务器成本等优势。
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>🌐 更多有趣好玩的项目</h2>
          <p style={{ lineHeight: '1.6', color: '#475569', marginBottom: '1rem' }}>
            分享和开发实用的在线工具，提升用户的工作效率。访问我的个人网站了解更多产品：
          </p>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <a 
              href="https://recordmind.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🌟 RecordMind.com - 更多实用工具 🔗
            </a>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>📞 联系我</h2>
          <p style={{ lineHeight: '1.6', color: '#475569', marginBottom: '1rem' }}>
            如果您在使用过程中遇到问题或有改进建议，欢迎通过 
            <a href="https://recordmind.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}> RecordMind.com </a>
            联系我。我会持续优化产品，为用户提供更好的体验。
          </p>
          <p style={{ lineHeight: '1.6', color: '#475569' }}>
            仓库地址：
            <a href="https://github.com/wuyueerhao/pngtowebp" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              https://github.com/wuyueerhao/pngtowebp
            </a>
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '1rem' }}>
            <a href="/" style={{ background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', marginRight: '0.5rem' }}>返回首页</a>
            <a href="/advanced.html" style={{ background: '#8b5cf6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none' }}>高级转换</a>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '1rem' }}>
            © 2025 PNG to WebP Converter | 
            <a href="https://recordmind.com" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', textDecoration: 'none', marginLeft: '0.25rem' }}>
              WorldWorld
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}