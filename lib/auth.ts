import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, remember: boolean) => boolean
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string, remember: boolean) => {
        if (email === 'admin@example.com' && password === 'password') {
          if (remember) {
            set({ user: { email }, isAuthenticated: true })
          } else {
            // Jika remember = false, jangan simpan ke storage
            set({ user: { email }, isAuthenticated: true }, false)
          }
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)
