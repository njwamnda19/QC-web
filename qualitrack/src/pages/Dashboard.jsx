// Dashboard.jsx
// Semua fitur fungsional:
// - Filter tanggal dengan state (mempengaruhi stat cards & grafik ranking)
// - Toggle "Minggu Ini" / "Bulan Ini" yang benar-benar switch data grafik tren
// - Stat cards yang menghitung data QC & Sales dari localStorage secara real-time
// - Bell icon dengan badge notifikasi
// - Data real-time menggunakan custom hook useDashboardData

import { useState } from "react";
import { Bell, Settings, Calendar } from "lucide-react";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import {
  RankingPerformaChart,
  StatusKualitasChart,
  TrenInspeksiChart,
} from "../components/DashboardCharts";
import { useDashboardData } from "../hooks/useDashboardData";

// Format tanggal ke "DD MMM YYYY"
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trenMode, setTrenMode] = useState("minggu"); // "minggu" | "bulan"
  const [showNotif, setShowNotif] = useState(false);

  // Gunakan hook untuk mengambil data real-time
  const {
    statCards,
    ranking,
    statusKualitas,
    trenMinggu,
    trenBulan,
    recentNotifs,
  } = useDashboardData({ dateFrom, dateTo });

  // Data tren: switch antara minggu dan bulan
  const trenData = trenMode === "minggu" ? trenMinggu : trenBulan;

  // Label periode aktif
  const activePeriodLabel =
    dateFrom && dateTo
      ? `${formatDate(dateFrom)} – ${formatDate(dateTo)}`
      : dateFrom
      ? `Sejak ${formatDate(dateFrom)}`
      : dateTo
      ? `Sampai ${formatDate(dateTo)}`
      : null;

  return (
    <div>
      {/* ===== Header ===== */}
      <Topbar title="Dashboard Utama">
        {/* Filter tanggal */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            Mulai Tanggal
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            max={dateTo || undefined}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom || undefined}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
          />
        </div>

        {/* Tombol reset filter (muncul saat ada filter aktif) */}
        {(dateFrom || dateTo) && (
          <button
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors mt-auto"
          >
            Reset
          </button>
        )}

        {/* Bell icon dengan notif badge */}
        <div className="relative mt-auto">
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors relative"
          >
            <Bell size={16} />
            {recentNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {Math.min(recentNotifs.length, 9)}
              </span>
            )}
          </button>

          {/* Dropdown notifikasi */}
          {showNotif && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-xl border border-gray-100 shadow-lg z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Notifikasi</p>
                <span className="text-xs text-brand-700 font-medium bg-brand-50 px-2 py-0.5 rounded-full">
                  {recentNotifs.length} baru
                </span>
              </div>
              {recentNotifs.length > 0 ? (
                <ul>
                  {recentNotifs.map((r, i) => (
                    <li
                      key={i}
                      className="px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-xs font-medium text-gray-700">
                        QC Selesai — {r.salesTarget || "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Skor:{" "}
                        <span
                          className={`font-semibold ${
                            r.score >= 80
                              ? "text-green-600"
                              : r.score >= 60
                              ? "text-yellow-600"
                              : "text-red-500"
                          }`}
                        >
                          {r.score ?? "—"}/100
                        </span>{" "}
                        · oleh {r.inspectorName || "—"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-center text-sm text-gray-400">
                  Belum ada notifikasi
                </p>
              )}
            </div>
          )}
        </div>

        <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors mt-auto">
          <Settings size={16} />
        </button>
      </Topbar>

      {/* ===== Label periode aktif ===== */}
      {activePeriodLabel && (
        <div className="flex items-center gap-2 mb-4 -mt-2">
          <Calendar size={13} className="text-brand-600" />
          <span className="text-xs text-brand-700 font-medium">
            Menampilkan data: {activePeriodLabel}
          </span>
          <button
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Hapus filter
          </button>
        </div>
      )}

      {/* ===== 4 Stat Cards ===== */}
      <div className="flex flex-wrap gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* ===== Baris 2 grafik ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Ranking Performa Sales — 2/3 lebar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Ranking Performa Sales
              </h2>
              {activePeriodLabel && (
                <p className="text-xs text-gray-400 mt-0.5">{activePeriodLabel}</p>
              )}
            </div>
            {/* Legend warna bar */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-600" />
                ≥80
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
                65–79
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                &lt;65
              </span>
            </div>
          </div>
          <RankingPerformaChart data={ranking} />
        </div>

        {/* Status Kualitas — 1/3 lebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Status Kualitas
          </h2>
          <StatusKualitasChart data={statusKualitas} />
        </div>
      </div>

      {/* ===== Tren Inspeksi dengan toggle Minggu/Bulan ===== */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              Tren Inspeksi {trenMode === "minggu" ? "Mingguan" : "Bulanan"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {trenMode === "minggu"
                ? "Jumlah inspeksi per hari dalam minggu ini"
                : "Jumlah inspeksi per minggu dalam bulan ini"}
            </p>
          </div>

          {/* Toggle yang benar-benar berfungsi */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTrenMode("minggu")}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                trenMode === "minggu"
                  ? "bg-white shadow-sm text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setTrenMode("bulan")}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                trenMode === "bulan"
                  ? "bg-white shadow-sm text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>

        <TrenInspeksiChart data={trenData} />
      </div>
    </div>
  );
}
