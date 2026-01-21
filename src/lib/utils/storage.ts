// Web-safe token storage using localStorage
// In production, consider using httpOnly cookies for better security

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

export const storage = {
  // Token management
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
  },

  // User data management
  getUser<T = unknown>(): T | null {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  setUser<T = unknown>(user: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER_KEY)
  },

  // Clear all auth data
  clear(): void {
    this.removeToken()
    this.removeUser()
  },
}
