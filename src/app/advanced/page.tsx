import AdvancedConverter from '../../components/AdvancedConverter'

export default function AdvancedPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            高级图片转换器
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            支持自定义质量和尺寸调整的 WebP 转换工具
          </p>
        </header>

        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <a href="/" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: 500,
            marginRight: '1rem'
          }}>← 返回基础版</a>
          <span style={{ color: '#94a3b8' }}>|</span>
          <span style={{ marginLeft: '1rem', color: '#64748b' }}>批量处理 + 高级设置</span>
        </div>

        <AdvancedConverter />

        <footer style={{
          textAlign: 'center',
          marginTop: '3rem',
          color: '#94a3b8',
          fontSize: '0.9rem'
        }}>
          <p>🔒 所有处理在浏览器本地完成，100% 隐私保护</p>
          <p style={{ marginTop: '0.5rem' }}>
            支持批量上传、自定义质量、尺寸调整、保持比例
          </p>
        </footer>
      </div>
    </main>
  )
}