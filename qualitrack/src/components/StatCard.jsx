// StatCard.jsx
// Kartu kecil untuk menampilkan satu angka statistik + label + trend (naik/turun).
// Dibuat sebagai komponen terpisah karena polanya berulang 4 kali di Dashboard
// (Total Audits, Avg Compliance, Critical Issues, Active Inspectors).

import { ClipboardList, CheckCircle2, AlertTriangle, Users2, ArrowUp, ArrowDown } from "lucide-react";

// Pemetaan nama ikon (string) ke komponen ikon asli.
// Kita simpan nama ikon sebagai string di data (lihat dummyData.js) supaya
// data tetap berupa data biasa (JS object), bukan tercampur dengan komponen React.
const ICONS = {
  clipboard: ClipboardList,
  check: CheckCircle2,
  alert: AlertTriangle,
  users: Users2,
};

// props yang diterima:
// - label: judul kartu, misal "Total Audits"
// - value: angka besar, misal "1,284"
// - trend: teks kecil di bawah, misal "+12% from last month"
// - trendUp: true (panah hijau naik) | false (panah merah turun) | null (tanpa panah)
// - icon: nama ikon (string, lihat ICONS di atas)
// - iconColor: class tailwind untuk warna ikon + background lingkarannya
export default function StatCard({ label, value, trend, trendUp, icon, iconColor }) {
  const Icon = ICONS[icon] ?? ClipboardList;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5 flex-1 min-w-[220px]">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {/* Lingkaran ikon berwarna, warnanya beda-beda tiap kartu (lihat iconColor di data) */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon size={18} />
        </div>
      </div>

      <p className="text-2xl font-semibold text-gray-800 mt-2">{value}</p>

      {/* Baris trend hanya dirender jika ada teksnya */}
      {trend && (
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${
            trendUp === true
              ? "text-green-600"
              : trendUp === false
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {trendUp === true && <ArrowUp size={12} />}
          {trendUp === false && <ArrowDown size={12} />}
          {trend}
        </p>
      )}
    </div>
  );
}
