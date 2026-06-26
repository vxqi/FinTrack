'use client'

import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { LocaleProvider } from '@/context/LocaleContext'

export default function RootProviders({ children }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}