import { useEffect, useState } from 'react'

const ADMIN_THEME_STORAGE_KEY = 'adminTheme'
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'

export function useAdminTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY)
    if (stored === THEME_DARK || stored === THEME_LIGHT) {
      // Apply immediately to prevent flash
      const root = document.documentElement
      if (stored === THEME_DARK) {
        root.classList.add(THEME_DARK)
      } else {
        root.classList.remove(THEME_DARK)
      }
      return stored
    }
    // Fallback to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const root = document.documentElement
    if (prefersDark) {
      root.classList.add(THEME_DARK)
      return THEME_DARK
    } else {
      root.classList.remove(THEME_DARK)
      return THEME_LIGHT
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === THEME_DARK) {
      root.classList.add(THEME_DARK)
    } else {
      root.classList.remove(THEME_DARK)
    }
    localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME_DARK ? THEME_LIGHT : THEME_DARK))
  }

  const setDark = () => setTheme(THEME_DARK)
  const setLight = () => setTheme(THEME_LIGHT)

  return {
    theme,
    isDark: theme === THEME_DARK,
    toggleTheme,
    setDark,
    setLight,
  }
}

