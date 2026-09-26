// DataSales.jsx
// Halaman ketiga: "Halaman Data Sales".
// Menampilkan tabel data sales personel: nama, region, total sales, achievement (%).
// Dilengkapi kolom search, dropdown filter region, pagination, dan aksi edit/delete.

import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { salesData } from "../data/dummyData";

const ITEMS_PER_PAGE = 5;

export default function DataSales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [salesList, setSalesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Load data: gabungkan dummyData + localStorage
  useEffect(() => {
    const localSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSalesList([...salesData, ...localSales]);
  }, []);

  // Tutup dropdown menu saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Daftar region unik (termasuk data lokal)
  const regions = useMemo(() => {
    const unique = new Set(salesList.map((s) => s.region));
    return ["All Regions", ...unique];
  }, [salesList]); // fix: depend on salesList bukan array kosong

  // Filter + search — fix: tambahkan salesList ke dependency
  const filteredData = useMemo(() => {
    return salesList.filter((sale) => {
      const name = sale.name || sale.salesName || "";
      const matchSearch = name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchRegion =
        regionFilter === "All Regions" || sale.region === regionFilter;
      return matchSearch && matchRegion;
    });
  }, [searchQuery, regionFilter, salesList]); // fix: tambah salesList

  // Reset ke halaman 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, regionFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleDelete(id) {
    const isFromDummy = salesData.find((s) => s.id === id);
    if (isFromDummy) {
      alert("Data bawaan tidak bisa dihapus.");
      return;
    }
    if (!confirm("Yakin hapus data sales ini?")) return;

    const localSales = JSON.parse(localStorage.getItem("sales")) || [];
    const updated = localSales.filter((s) => s.id !== id);
    localStorage.setItem("sales", JSON.stringify(updated));
    setSalesList([...salesData, ...updated]);
    setOpenMenuId(null);
  }

  function handleEdit(id) {
    navigate(`/editSales/${id}`);
    setOpenMenuId(null);
  }

  // Ambil nama yang bisa dari field 'name' atau 'salesName'
  function getSalesName(sale) {
    return sale.name || sale.salesName || "—";
  }

  return (
    <div>
      <Topbar
        title="Data Sales"
        description="Manage and track regional sales performance."
      >
        <button
          onClick={() => navigate("/addSales")}
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Sales
        </button>
      </Topbar>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search sales personnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">NAME</th>
                <th className="px-4 py-3 font-medium">REGION</th>
                <th className="px-4 py-3 font-medium">TOTAL SALES</th>
                <th className="px-4 py-3 font-medium">ACHIEVEMENT</th>
                <th className="px-4 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">
                        {getSalesName(sale)
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {getSalesName(sale)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{sale.region}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {sale.totalSales ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        sale.achievement >= 100
                          ? "bg-green-50 text-green-600"
                          : sale.achievement >= 75
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {sale.achievement ?? "—"}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block" ref={openMenuId === sale.id ? menuRef : null}>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === sale.id ? null : sale.id)
                        }
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {/* Dropdown menu */}
                      {openMenuId === sale.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg border border-gray-100 shadow-lg z-10 overflow-hidden">
                          <button
                            onClick={() => handleEdit(sale.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sale.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    Tidak ada data yang cocok dengan pencarian/filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: pagination */}
        <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-400 border-t border-gray-50">
          <span>
            Showing{" "}
            {filteredData.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{" "}
            {filteredData.length} results
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-md text-xs transition-colors ${
                  page === currentPage
                    ? "bg-brand-700 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
