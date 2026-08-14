import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState, AuthResponse, LoginCredentials, UserRole, RegisterResponse } from '@/types/auth'

interface AuthStore extends AuthState {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
  reset: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  // Registration state
  registrationData: RegisterResponse | null
  setRegistrationData: (data: RegisterResponse) => void
  clearRegistrationData: () => void
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

function setAuthCookies(accessToken: string | null, roles: string[]) {
  if (typeof window === 'undefined') return
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
  if (accessToken) {
    document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; expires=${expires}; samesite=lax`
  }
  if (roles.length) {
    document.cookie = `userRoles=${encodeURIComponent(roles.join(','))}; path=/; expires=${expires}; samesite=lax`
  }
}

function clearAuthCookies() {
  if (typeof window === 'undefined') return
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax'
  document.cookie = 'userRoles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax'
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (user: User, accessToken: string, refreshToken: string) => {
        const roles = (user.roles || []).map((r) => r.toLowerCase())
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
        setAuthCookies(accessToken, roles)
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
        // Keep the accessToken cookie in sync whenever tokens are refreshed;
        // otherwise the middleware keeps seeing the (expired) cookie value and
        // redirects protected routes (e.g. /admin/tenants) back to /login.
        setAuthCookies(accessToken, get().roles.map((r) => r.toLowerCase()))
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken })
        setAuthCookies(accessToken, get().roles.map((r) => r.toLowerCase()))
      },

      logout: () => {
        set(initialState)
        // Clear any stored data
        clearAuthCookies()
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

      // Registration methods
      registrationData: null,

      setRegistrationData: (data: RegisterResponse) => {
        set({ registrationData: data })
      },

      clearRegistrationData: () => {
        set({ registrationData: null })
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
        registrationData: state.registrationData,
      }),
      // A persisted session (localStorage) is restored on the client without
      // going through setAuth, so rewrite the auth cookies on boot. Otherwise
      // the middleware sees no cookie and bounces the user to /login even
      // though they are signed in.
      onRehydrateStorage: () => (state) => {
        if (typeof window === 'undefined') return
        if (state?.accessToken) {
          setAuthCookies(
            state.accessToken,
            (state.roles ?? []).map((r: string) => r.toLowerCase())
          )
        } else {
          clearAuthCookies()
        }
      },
    }
  )
)