import AuthProviderWrapper from '@/components/auth/AuthProvider'

export default function OnboardingLayout({ children }) {
  return (
    <AuthProviderWrapper>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg)',
      }}>
        {children}
      </main>
    </AuthProviderWrapper>
  )
}