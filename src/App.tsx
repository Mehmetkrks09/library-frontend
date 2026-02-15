import { useState, useEffect } from "react";
import Login from "./components/Login";
import AddBook from "./components/AddBook";

interface Book {
  id: number;
  isim: string;
  yazar: string;
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  // Sayfa yüklendiğinde token'ı kontrol et
  // Token varsa kitapları getir
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  // Token varsa kitapları getir
  // Token varsa kitapları getir
  useEffect(() => {
    if (token) {
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/kitaplar", {
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

  // Token yoksa Login göster
  if (!token) {
    return <Login onLoginSuccess={setToken} />;
  }

  // Token varsa Dashboard göster
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Library Management System
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {localStorage.getItem("username")}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AddBook token={token!} onBookAdded={fetchBooks} />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Books</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : books.length === 0 ? (
            <p className="text-gray-500">
              No books found. Add your first book!
            </p>
          ) : (
            <ul className="space-y-2">
              {books.map((book) => (
                <li key={book.id} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">{book.isim}</p>
                  <p className="text-sm text-gray-600">by {book.yazar}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
