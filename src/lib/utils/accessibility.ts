export const SR_ONLY_CLASS = 'sr-only'

export const FOCUSABLE_ELEMENTS = 
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export const ARIA_LABELS = {
  closeModal: 'Close modal',
  closeMenu: 'Close menu',
  openMenu: 'Open menu',
  loading: 'Loading...',
  sending: 'Sending message...',
  newChat: 'Start new chat',
  chatHistory: 'View chat history',
  settings: 'Open settings',
  help: 'Get help',
  logout: 'Log out',
  userProfile: 'User profile',
  editProfile: 'Edit profile',
  sendMessage: 'Send message',
  voiceInput: 'Voice input',
  attachment: 'Add attachment',
  copyToClipboard: 'Copy to clipboard',
  downloadChat: 'Download chat',
  likeMessage: 'Like message',
  dislikeMessage: 'Dislike message',
} as const

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)
  setTimeout(() => document.body.removeChild(announcement), 1000)
}

let idCounter = 0
export function generateId(prefix = 'aria'): string {
  return `${prefix}-${++idCounter}`
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
