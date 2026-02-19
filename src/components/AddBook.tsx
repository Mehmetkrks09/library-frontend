import { useState } from "react";
import toast from "react-hot-toast";

interface AddBookProps {
  token: string;
  onBookAdded: () => void;
}

export default function AddBook({ token, onBookAdded }: AddBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    isim: "",
    yazar: "",
    sayfaSayisi: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ id: number; isim: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/kitaplar/addBook`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, categoryId: selectedCategoryId }),
        },
      );

      if (response.ok) {
        setFormData({ isim: "", yazar: "", sayfaSayisi: 0 });
        setSelectedCategoryId(null);
        setIsOpen(false);
        onBookAdded();
        toast.success("Book added successfully!");
      } else {
        setError("Failed to add book");
        toast.error("Something went wrong!");
      }
    } catch {
      setError("Network error");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setIsOpen(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kategoriler`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium text-sm md:text-base"
        >
          + Add Book
        </button>
      ) : (
        <div className="w-full mt-4 md:mt-6 border-t dark:border-gray-700 pt-4 md:pt-6">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add New Book</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Book Name
              </label>
              <input
                type="text"
                value={formData.isim}
                onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.yazar}
                onChange={(e) => setFormData({ ...formData, yazar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pages
              </label>
              <input
                type="number"
                value={formData.sayfaSayisi}
                onChange={(e) => setFormData({ ...formData, sayfaSayisi: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={selectedCategoryId ?? ""}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.isim}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-sm p-3 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                }}
                className="w-full sm:w-auto px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Adding..." : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}