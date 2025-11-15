import { useEffect, useState } from "react";
import api from "../services/api";
import SweetCard from "../components/SweetCard";

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function SweetList() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSweets = async () => {
    const res = await api.get("/sweets", {
      params: {
        search,
        category,
        page,
      },
    });

    setSweets(res.data.sweets);
    setTotalPages(res.data.totalPages || 1);
  };

  useEffect(() => {
    fetchSweets();
  }, [search, category, page]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sweets 🍬</h1>

      {/* Filters Section */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Milk">Milk</option>
          <option value="Dry Fruit">Dry Fruit</option>
          <option value="Sugar">Sugar</option>
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <SweetCard key={sweet.id} sweet={sweet} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-600 text-white"}`}
        >
          Prev
        </button>

        <span className="px-3 py-2">Page {page} / {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-600 text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
