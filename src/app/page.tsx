import ImageConverter from '../components/ImageConverter'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* 导航栏 */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>
            🚀 PNG 转 WebP
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/advanced" style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px'
            }}>
              高级版
            </a>
            <a href="/about" style={{
              color: '#64748b',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px'
            }}>
              关于
            </a>
          </div>
        </nav>

        {/* 头部 */}
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#1e293b'
          }}>
            PNG 转 WebP 转换器
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
            高质量、快速、免费的图片格式转换工具<br />
            <span style={{ fontSize: '0.875rem' }}>🔒 100% 隐私保护 - 所有处理在浏览器本地完成</span>
          </p>
        </header>

        {/* 特性列表 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { icon: '⚡', text: '快速转换' },
            { icon: '🔒', text: '隐私保护' },
            { icon: '📦', text: '批量处理' },
            { icon: '🎨', text: '高质量' }
          ].map((item, index) => (
            <div key={index} style={{
              background: '#f8fafc',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center' as const,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{item.text}</div>
            </div>
          ))}
        </div>

        <ImageConverter />

        {/* 快速操作 */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #dbeafe'
        }}>
          <div style={{ fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            💡 需要更多功能？
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a href="/advanced" style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              高级转换器 →
            </a>
            <span style={{ color: '#64748b', fontSize: '0.875rem', padding: '0.5rem 0' }}>
              质量调整 + 尺寸控制
            </span>
          </div>
        </div>

        <footer style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          color: '#94a3b8',
          fontSize: '0.875rem'
        }}>
          <p>支持 PNG, JPG, JPEG, WebP, GIF → WebP</p>
          <p style={{ marginTop: '0.5rem' }}>
            基于 Next.js + Cloudflare Pages 部署
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            © 2024 PNG to WebP Converter | <a href="/about" style={{ color: '#64748b' }}>关于我们</a>
          </p>
        </footer>
      </div>
    </main>
  )
}