import AuthProviderWrapper from '@/components/auth/AuthProvider'

export default function AuthLayout({ children }) {
  return (
    <AuthProviderWrapper>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}>
        {children}
      </main>
    </AuthProviderWrapper>
  )
}