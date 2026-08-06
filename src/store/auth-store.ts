import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState, AuthResponse, LoginCredentials, UserRole } from '@/types/auth'

interface AuthStore extends AuthState {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
  reset: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  roles: [],
  permissions: [],
  organization: null,
  tenantId: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (user: User, accessToken: string, refreshToken: string) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          roles: user.roles || [],
          permissions: user.permissions || [],
          organization: user.organization || null,
          tenantId: user.tenantId || null,
        })
      },

      setUser: (user: User) => {
        set({
          user,
          roles: user.roles || [],
          permissions: user.permissions || [],
          organization: user.organization || null,
          tenantId: user.tenantId || null,
        })
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken })
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken })
      },

      logout: () => {
        set(initialState)
        // Clear any stored data
        localStorage.removeItem('auth-storage')
        sessionStorage.removeItem('auth-storage')
      },

      reset: () => {
        set(initialState)
      },

      hasPermission: (permission: string) => {
        const { permissions } = get()
        return permissions.includes(permission)
      },

      hasRole: (role: UserRole | UserRole[]) => {
        const { roles } = get()
        if (Array.isArray(role)) {
          return role.some((r) => roles.includes(r))
        }
        return roles.includes(role)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
        permissions: state.permissions,
        organization: state.organization,
        tenantId: state.tenantId,
      }),
    }
  )
)