'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

const THEME_KEY = 'fintrack_theme'       // 'light' | 'dark' | 'system'
const ACCENT_KEY = 'fintrack_accent'     // hex string
const DENSITY_KEY = 'fintrack_density'   // 'comfortable' | 'compact'

const DEFAULT_ACCENT = '#4F46E5'

// Maps an accent hex to a slightly darker hover shade and a translucent "light" tint.
// Used so swapping the accent swatch updates --accent, --accent-hover, and --accent-light together.
function deriveAccentShades(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const darken = (v, amt) => Math.max(0, Math.round(v * (1 - amt)))
  const hover = `#${darken(r, 0.12).toString(16).padStart(2, '0')}${darken(g, 0.12).toString(16).padStart(2, '0')}${darken(b, 0.12).toString(16).padStart(2, '0')}`
  const light = `rgba(${r}, ${g}, ${b}, 0.12)`

  return { accent: hex, accentHover: hover, accentLight: light }
}

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light')     // resolved theme actually applied: 'light' | 'dark'
  const [themePref, setThemePref] = useState('light')  // user's stored preference: 'light' | 'dark' | 'system'
  const [accent, setAccentState] = useState(DEFAULT_ACCENT)
  const [density, setDensityState] = useState('comfortable') // 'comfortable' | 'compact'
  const [ready, setReady] = useState(false)

  // Apply theme + accent to the DOM
  const applyTheme = useCallback((resolvedTheme, accentHex) => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    const { accent, accentHover, accentLight } = deriveAccentShades(accentHex)
    document.documentElement.style.setProperty('--accent', accent)
    document.documentElement.style.setProperty('--accent-hover', accentHover)
    document.documentElement.style.setProperty('--accent-light', accentLight)
  }, [])

  const applyDensity = useCallback((value) => {
    document.documentElement.setAttribute('data-density', value)
  }, [])

  // Load saved preferences on mount
  useEffect(() => {
    const storedThemePref = localStorage.getItem(THEME_KEY) || 'light'
    const storedAccent = localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT
    const storedDensity = localStorage.getItem(DENSITY_KEY) || 'comfortable'

    setThemePref(storedThemePref)
    setAccentState(storedAccent)
    setDensityState(storedDensity)

    const resolved = storedThemePref === 'system'
      ? (getSystemPrefersDark() ? 'dark' : 'light')
      : storedThemePref

    setThemeState(resolved)
    applyTheme(resolved, storedAccent)
    applyDensity(storedDensity)
    setReady(true)
  }, [applyTheme, applyDensity])

  // Listen for system theme changes when preference is 'system'
  useEffect(() => {
    if (themePref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const resolved = e.matches ? 'dark' : 'light'
      setThemeState(resolved)
      applyTheme(resolved, accent)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [themePref, accent, applyTheme])

  const setThemePreference = (pref) => {
    setThemePref(pref)
    localStorage.setItem(THEME_KEY, pref)
    const resolved = pref === 'system' ? (getSystemPrefersDark() ? 'dark' : 'light') : pref
    setThemeState(resolved)
    applyTheme(resolved, accent)
  }

  const setAccent = (hex) => {
    setAccentState(hex)
    localStorage.setItem(ACCENT_KEY, hex)
    applyTheme(theme, hex)
  }

  const setDensity = (value) => {
    setDensityState(value)
    localStorage.setItem(DENSITY_KEY, value)
    applyDensity(value)
  }

  return (
    <ThemeContext.Provider value={{
      theme, themePref, accent, density,
      setThemePreference, setAccent, setDensity, ready,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}