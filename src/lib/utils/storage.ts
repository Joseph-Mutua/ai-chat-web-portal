// Web-safe token storage using localStorage
// In production, consider using httpOnly cookies for better security

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'
const LAST_ACTIVITY_KEY = 'last_activity'

// Session timeout configuration (in milliseconds)
export const SESSION_CONFIG = {
  // Time of inactivity before showing warning (default: 25 minutes)
  WARNING_TIMEOUT: 25 * 60 * 1000,
  // Time of inactivity before auto logout (default: 30 minutes)
  LOGOUT_TIMEOUT: 30 * 60 * 1000,
  // How often to check for inactivity (default: 30 seconds)
  CHECK_INTERVAL: 30 * 1000,
}

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
    this.removeLastActivity()
  },

  // Last activity tracking for session timeout
  getLastActivity(): number | null {
    if (typeof window === 'undefined') return null
    const timestamp = localStorage.getItem(LAST_ACTIVITY_KEY)
    return timestamp ? parseInt(timestamp, 10) : null
  },

  setLastActivity(timestamp: number = Date.now()): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(LAST_ACTIVITY_KEY, timestamp.toString())
  },

  removeLastActivity(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(LAST_ACTIVITY_KEY)
  },
}
