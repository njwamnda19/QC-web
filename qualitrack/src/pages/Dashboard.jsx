// Dashboard.jsx
// Halaman pertama: "Dashboard Utama".
// Isinya: filter tanggal di kanan atas, 4 kartu statistik, dan 3 grafik
// (Ranking Performa Sales, Status Kualitas, Tren Inspeksi Mingguan).

import { Bell, Settings } from "lucide-react";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { RankingPerformaChart, StatusKualitasChart, TrenInspeksiChart } from "../components/DashboardCharts";
import { statCards } from "../data/dummyData";

export default function Dashboard() {
  return (
    <div>
      {/* ===== Header: judul + filter tanggal + ikon ===== */}
      <Topbar title="Dashboard Utama">
        {/* Filter "Mulai Tanggal" */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Mulai Tanggal</label>
          <input
            type="date"
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600"
          />
        </div>
        {/* Filter "Sampai Tanggal" */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">Sampai Tanggal</label>
          <input
            type="date"
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600"
          />
        </div>
        {/* Ikon notifikasi & pengaturan */}
        <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Bell size={16} />
        </button>
        <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Settings size={16} />
        </button>
      </Topbar>

      {/* ===== Baris 4 kartu statistik ===== */}
      {/* "flex flex-wrap" membuat kartu otomatis turun ke baris baru di layar kecil (responsive) */}
      <div className="flex flex-wrap gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* ===== Baris 2 grafik: Ranking Performa Sales & Status Kualitas ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Grafik pertama ambil 2/3 lebar (col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-700">Ranking Performa Sales</h2>
          </div>
          <RankingPerformaChart />
        </div>

        {/* Grafik kedua ambil 1/3 lebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Status Kualitas</h2>
          <StatusKualitasChart />
        </div>
      </div>

      {/* ===== Grafik full width: Tren Inspeksi Mingguan ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700">Tren Inspeksi Mingguan</h2>
          {/* Tombol toggle "Minggu Ini" / "Bulan Ini" - untuk saat ini hanya tampilan (belum ada logic switch) */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1 text-xs rounded-md bg-white shadow-sm text-gray-700">
              Minggu Ini
            </button>
            <button className="px-3 py-1 text-xs rounded-md text-gray-500">Bulan Ini</button>
          </div>
        </div>
        <TrenInspeksiChart />
      </div>
    </div>
  );
}

