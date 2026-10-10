// DashboardCharts.jsx
// Grafik-grafik Dashboard yang sekarang menerima data sebagai props (fully controlled).

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
import {
  rankingPerforma,
  statusKualitas,
  STATUS_COLORS,
} from "../data/dummyData";

// Custom tooltip untuk bar chart
function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-brand-700 font-semibold mt-0.5">
          Nilai: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

// Custom tooltip untuk area chart
function CustomAreaTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-brand-700 font-semibold mt-0.5">
          {payload[0].value} inspeksi
        </p>
      </div>
    );
  }
  return null;
}

// ============================================================
// 1) BAR CHART - "Ranking Performa Sales"
//    Sekarang bisa menerima data dari prop (untuk filter tanggal)
// ============================================================
export function RankingPerformaChart({ data = rankingPerforma }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis
          dataKey="tim"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f3f4f6" }} />
        <Bar dataKey="nilai" radius={[4, 4, 0, 0]} barSize={28}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.nilai >= 80 ? "#155e56" : entry.nilai >= 65 ? "#1f6b63" : "#94a3b8"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// 2) DONUT CHART - "Status Kualitas"
// ============================================================
export function StatusKualitasChart({ data = statusKualitas }) {
  const lulusEntry = data.find((d) => d.name === "Lulus");
  const totalLulus = lulusEntry?.value ?? 0;
  const revisiEntry = data.find((d) => d.name === "Revisi");
  const totalRevisi = revisiEntry?.value ?? 0;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Angka di tengah donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-2xl font-bold text-gray-800">{totalLulus}%</p>
        <p className="text-[10px] text-gray-400 mt-0.5">Lulus</p>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-5 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: STATUS_COLORS[0] }}
          />
          <span>Lulus <span className="font-medium text-gray-700">{totalLulus}%</span></span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: STATUS_COLORS[1] }}
          />
          <span>Revisi <span className="font-medium text-gray-700">{totalRevisi}%</span></span>
        </span>
      </div>
    </div>
  );
}

// ============================================================
// 3) AREA CHART - "Tren Inspeksi"
//    Menerima data sebagai prop agar bisa switch minggu/bulan
// ============================================================
export function TrenInspeksiChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTren" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#155e56" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#155e56" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomAreaTooltip />} />
        <Area
          type="monotone"
          dataKey="jumlah"
          stroke="#155e56"
          strokeWidth={2}
          fill="url(#colorTren)"
          dot={{ fill: "#155e56", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#155e56" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
