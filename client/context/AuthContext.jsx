'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('fintrack_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) }
      catch { localStorage.removeItem('fintrack_user') }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password }, { withCredentials: true })
    localStorage.setItem('fintrack_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async ({ firstName, lastName, email, password }) => {
    const { data } = await axios.post('/api/auth/register', { firstName, lastName, email, password }, { withCredentials: true })
    localStorage.setItem('fintrack_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
    localStorage.removeItem('fintrack_user')
    setUser(null)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('fintrack_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}