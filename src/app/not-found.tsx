import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          页面未找到
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          抱歉，我们找不到您请求的页面。
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            返回首页
          </Link>
          <Link href="/about" style={{
            background: '#64748b',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            关于页面
          </Link>
        </div>
      </div>
    </main>
  )
}