// DashboardCharts.jsx
// Berisi 3 komponen grafik yang dipakai di Dashboard Utama.
// Library yang dipakai: "recharts" (npm install recharts) — library chart populer untuk React,
// karena berbasis SVG dan komponennya sangat mirip menulis JSX biasa.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { rankingPerforma, statusKualitas, STATUS_COLORS, trenInspeksi } from "../data/dummyData";

// ============================================================
// 1) BAR CHART - "Ranking Performa Sales"
// ============================================================
export function RankingPerformaChart() {
  return (
    // ResponsiveContainer membuat chart otomatis menyesuaikan lebar parent-nya (responsive)
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={rankingPerforma}>
        <XAxis dataKey="tim" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "#f3f4f6" }} />
        {/* radius={[4,4,0,0]} membuat sudut atas bar sedikit melengkung */}
        <Bar dataKey="nilai" fill="#155e56" radius={[4, 4, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// 2) DONUT CHART - "Status Kualitas" (Lulus vs Revisi)
// ============================================================
export function StatusKualitasChart() {
  // Total dihitung dari data supaya angka di tengah donut selalu akurat
  // walau datanya berubah, tidak perlu di-hardcode manual.
  const totalLulus = statusKualitas.find((d) => d.name === "Lulus")?.value ?? 0;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={statusKualitas}
            dataKey="value"
            nameKey="name"
            innerRadius={55} // ini yang membuat pie chart jadi bentuk "donut" (ada lubang tengah)
            outerRadius={75}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {statusKualitas.map((entry, index) => (
              <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Teks "100% Total" diletakkan absolute di tengah, menumpuk di atas donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-2xl font-semibold text-gray-800">{totalLulus}%</p>
        <p className="text-xs text-gray-400">Total</p>
      </div>

      {/* Legenda warna manual (bukan bawaan recharts) supaya posisinya bisa diatur sendiri */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[0] }} />
          Lulus (60%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[1] }} />
          Revisi (40%)
        </span>
      </div>
    </div>
  );
}

// ============================================================
// 3) AREA CHART - "Tren Inspeksi Mingguan"
// ============================================================
export function TrenInspeksiChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={trenInspeksi}>
        <defs>
          {/* "linearGradient" membuat efek warna memudar dari pekat (atas) ke transparan (bawah) */}
          <linearGradient id="colorTren" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#155e56" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#155e56" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="hari" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="jumlah"
          stroke="#155e56"
          strokeWidth={2}
          fill="url(#colorTren)" // pakai gradient yang didefinisikan di atas
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
