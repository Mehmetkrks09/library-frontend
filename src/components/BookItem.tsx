import { useState } from 'react'
import toast from 'react-hot-toast'

interface Book {
  id: number
  isim: string
  yazar: string
  sayfaSayisi: number
  category: {        // ← EKLE
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
      const response = await fetch(`http://localhost:8080/api/kitaplar/update/${book.id}`, {
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
      const response = await fetch(`http://localhost:8080/api/kitaplar/delete/${book.id}`, {
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
      <li className="p-4 bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            value={formData.isim}
            onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={formData.yazar}
            onChange={(e) => setFormData({ ...formData, yazar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={formData.sayfaSayisi}
            onChange={(e) => setFormData({ ...formData, sayfaSayisi: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-start">
      <div>
  <p className="font-medium text-lg">{book.isim}</p>
  <p className="text-sm text-gray-600">by {book.yazar}</p>
  <div className="flex gap-3 mt-1">
    <p className="text-xs text-gray-500">{book.sayfaSayisi} pages</p>
    {book.category && (
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
        {book.category.isim}
      </span>
    )}
  </div>
</div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          disabled={loading}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          disabled={loading}
        >
          {loading ? '...' : 'Delete'}
        </button>
      </div>
      
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </li>
  )
}