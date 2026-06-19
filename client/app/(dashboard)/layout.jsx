import AuthProviderWrapper from '@/components/auth/AuthProvider'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({ children }) {
  return (
    <AuthProviderWrapper>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          marginLeft: 'var(--sidebar-w)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
          <Topbar />
          <main style={{
            flex: 1,
            padding: '24px',
            paddingTop: 'calc(var(--topbar-h) + 24px)',
            background: 'var(--bg)',
          }}>
            {children}
          </main>
        </div>
      </div>
    </AuthProviderWrapper>
  )
}