import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('localfix_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('localfix_token')
    if (token) {
      getProfile()
        .then((res) => {
          setUser(res.data.user || res.data)
          localStorage.setItem('localfix_user', JSON.stringify(res.data.user || res.data))
        })
        .catch(() => {
          localStorage.removeItem('localfix_token')
          localStorage.removeItem('localfix_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('localfix_token', token)
    localStorage.setItem('localfix_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('localfix_token')
    localStorage.removeItem('localfix_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
