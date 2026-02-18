import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    return saved || 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // System preference'ı dinle
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const applyTheme = () => {
      root.classList.remove('light', 'dark')
      
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }

    applyTheme()
    
    // System tercihi değişirse güncelle
    const listener = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }
    
    mediaQuery.addEventListener('change', listener)
    
    return () => mediaQuery.removeEventListener('change', listener)
  }, [theme])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return { theme, setTheme: updateTheme }
}