import { useState, useEffect } from "react";
import Login from "./components/Login";
import AddBook from "./components/AddBook";
import BookItem from "./components/BookItem";
import { Toaster } from "react-hot-toast";
import Spinner from "./components/Spinner";
import ThemeToggle from './components/ThemeToggle'

interface Book {
  id: number;
  isim: string;
  yazar: string;
  sayfaSayisi: number;
  category: {
    id: number;
    isim: string;
  } | null;
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitaplar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setBooks([]);
  };

  if (!token) {
    return <Login onLoginSuccess={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Library Management System
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-gray-600 dark:text-gray-300">
              Welcome, {localStorage.getItem("username")}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Books</h2>
            <AddBook token={token!} onBookAdded={fetchBooks} />
          </div>
          {loading ? (
            <Spinner />
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">📚</p>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-200">No books yet</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Click "+ Add Book" to add your first book!
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {books.map((book) => (
                <BookItem
                  key={book.id}
                  book={book}
                  token={token!}
                  onBookUpdated={fetchBooks}
                  onBookDeleted={fetchBooks}
                />
              ))}
            </ul>
          )}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;