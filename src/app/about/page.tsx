export default function About() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>关于我们</h1>
          <p style={{ color: '#64748b' }}>PNG 转 WebP 转换器</p>
        </header>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>🎯 项目目标</h2>
          <p style={{ lineHeight: '1.6', color: '#475569' }}>
            提供一个快速、安全、免费的在线图片格式转换工具。
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/" style={{ background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', marginRight: '0.5rem' }}>返回首页</a>
          <a href="/advanced" style={{ background: '#8b5cf6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none' }}>高级转换</a>
        </div>
      </div>
    </main>
  )
}