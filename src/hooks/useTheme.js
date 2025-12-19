import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'theme'
const THEME_DARK = 'dark'
const THEME_LIGHT = 'light'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEME_DARK || stored === THEME_LIGHT) {
      return stored
    }
    // Fallback to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK
    }
    return THEME_LIGHT
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === THEME_DARK) {
      root.classList.add(THEME_DARK)
    } else {
      root.classList.remove(THEME_DARK)
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
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

