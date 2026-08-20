// DataSales.jsx
// Halaman ketiga: "Halaman Data Sales".
// Menampilkan tabel data sales personel: nama, region, total sales, dan achievement (%).
// Dilengkapi kolom search, dropdown filter region, dan pagination sederhana.

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import Topbar from "../components/Topbar";
import { salesData } from "../data/dummyData";


export default function DataSales() {
const [searchQuery, setSearchQuery] = useState("");
const [regionFilter, setRegionFilter] = useState("All Regions");
const [salesList, setSalesList] = useState([]);

useEffect(() => {
  const localSales =
    JSON.parse(localStorage.getItem("sales")) || [];

  setSalesList([...salesData, ...localSales]);
}, []);

  // Ambil daftar region secara unik dari data, supaya dropdown filter otomatis
  // menyesuaikan jika suatu saat data sales bertambah region baru.
  const regions = useMemo(() => {
    const unique = new Set(salesList.map((s) => s.region));
    return ["All Regions", ...unique];
  }, []);

  // "useMemo" dipakai supaya proses filter+search hanya dihitung ulang
  // saat searchQuery/regionFilter/salesData berubah, tidak setiap kali komponen render.
  const filteredData = useMemo(() => {
    return salesList.filter((sale) => {
      const matchSearch = sale.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = regionFilter === "All Regions" || sale.region === regionFilter;
      return matchSearch && matchRegion;
    });
  }, [searchQuery, regionFilter]);

  const navigate = useNavigate();
    const handleAddClick = () => {
      navigate("/addSales");
  };

  return (
    <div>
      <Topbar title="Data Sales" description="Manage and track regional sales performance.">
        <button 
        onClick={handleAddClick}
        className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-lg">
        <Plus size={16} />
          Add Sales
        </button>
      </Topbar>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        {/* ===== Baris search & filter ===== */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600"
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

        {/* ===== Tabel ===== */}
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
            {filteredData.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Avatar bulat berisi inisial nama, dibuat otomatis dari 2 huruf pertama tiap kata */}
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center">
                      {sale.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="text-gray-700 font-medium">{sale.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{sale.region}</td>
                <td className="px-4 py-3 text-gray-700">{sale.totalSales ?? 0}</td>
                <td className="px-4 py-3">
                  {/* Warna badge achievement: hijau jika >=100%, kuning jika di bawahnya */}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      sale.achievement >= 100
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {sale.achievement}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Tampilkan pesan jika hasil filter/search kosong */}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                  Tidak ada data yang cocok dengan pencarian/filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ===== Footer: info jumlah data + pagination ===== */}
        <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-400">
          <span>Showing 1 to {filteredData.length} of {salesList.length} results</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-7 h-7 rounded-md text-xs ${
                  page === 1 ? "bg-brand-700 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

