import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light' as const, icon: '☀️', label: 'Light' },
    { value: 'dark' as const, icon: '🌙', label: 'Dark' },
    { value: 'system' as const, icon: '💻', label: 'System' },
  ]

  return (
    <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === value 
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title={label}
        >
          <span className="text-base">{icon}</span>
        </button>
      ))}
    </div>
  )
}