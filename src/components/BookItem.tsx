import { useState } from 'react'
import toast from 'react-hot-toast'

interface Book {
  id: number
  isim: string
  yazar: string
  sayfaSayisi: number
  category: {
    id: number
    isim: string
  } | null
}

interface BookItemProps {
  book: Book
  token: string
  onBookUpdated: () => void
  onBookDeleted: () => void
}

export default function BookItem({ book, token, onBookUpdated, onBookDeleted }: BookItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    isim: book.isim,
    yazar: book.yazar,
    sayfaSayisi: book.sayfaSayisi
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitaplar/update/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsEditing(false)
        onBookUpdated()
        toast.success('Book updated successfully!')
      } else {
        setError('Failed to update book')
        toast.error('Something went wrong!')
      }
    } catch {
      setError('Network error')
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book.isim}"?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitaplar/delete/${book.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        onBookDeleted()
        toast.success('Book deleted successfully!')
      } else {
        setError('Failed to delete book')
        toast.error('Something went wrong!')
      }
    } catch {
      setError('Network error')
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <li className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            value={formData.isim}
            onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={formData.yazar}
            onChange={(e) => setFormData({ ...formData, yazar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={formData.sayfaSayisi}
            onChange={(e) => setFormData({ ...formData, sayfaSayisi: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
          
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex justify-between items-start hover:shadow-md transition-shadow">
      <div>
        <p className="font-medium text-lg text-gray-900 dark:text-white">{book.isim}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">by {book.yazar}</p>
        <div className="flex gap-3 mt-1 items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{book.sayfaSayisi} pages</p>
          {book.category && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium">
              {book.category.isim}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white text-sm rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 dark:bg-red-600 text-white text-sm rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
          disabled={loading}
        >
          {loading ? '...' : 'Delete'}
        </button>
      </div>
      
      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
    </li>
  )
}