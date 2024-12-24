import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthHeader(token)
      setUser({ token })
      checkOnboardingStatus()
    }
    setLoading(false)
  }, [])

  const setAuthHeader = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const checkOnboardingStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/onboarding-status`)
      setOnboardingCompleted(response.data.onboardingCompleted)
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password })
    const { token } = response.data
    localStorage.setItem('token', token)
    setAuthHeader(token)
    setUser({ token })
    await checkOnboardingStatus()
  }

  const register = async (email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { email, password })
    const { token } = response.data
    localStorage.setItem('token', token)
    setAuthHeader(token)
    setUser({ token })
    setOnboardingCompleted(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setOnboardingCompleted(true)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    onboardingCompleted
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}









