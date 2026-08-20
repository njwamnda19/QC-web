// File ini berisi DATA CONTOH (dummy/mock data).
// Di aplikasi nyata, data ini biasanya diambil dari API/backend menggunakan fetch/axios.
// Untuk sekarang kita taruh di sini dulu supaya tampilan (UI) bisa langsung dicoba.

// Data untuk 3 kartu statistik di Dashboard Utama
export const statCards = [
  {
    id: "audit",
    label: "Total Audits",
    value: "1,284",
    trend: "+12% from last month",
    trendUp: true,
    icon: "clipboard",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    id: "compliance",
    label: "Avg Compliance",
    value: "94.2%",
    trend: "+2.1% from last month",
    trendUp: true,
    icon: "check",
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    id: "critical",
    label: "Critical Issues",
    value: "23",
    trend: "-5 from last month",
    trendUp: false, // turun = bagus untuk kasus "critical issues", tapi kita tetap tandai warnanya merah/hijau via ikon
    icon: "alert",
    iconColor: "text-red-600 bg-red-50",
  },
  {
    id: "inspectors",
    label: "Active Inspectors",
    value: "45",
    trend: "Currently in field",
    trendUp: null, // null = tidak ada panah naik/turun, cuma keterangan
    icon: "users",
    iconColor: "text-gray-600 bg-gray-100",
  },
];

// Data untuk grafik batang "Ranking Performa Sales" (per tim, skala 0-100)
export const rankingPerforma = [
  { tim: "Tim A", nilai: 92 },
  { tim: "Tim B", nilai: 78 },
  { tim: "Tim C", nilai: 65 },
  { tim: "Tim D", nilai: 88 },
  { tim: "Tim E", nilai: 55 },
  { tim: "Tim F", nilai: 70 },
];

// Data untuk donut chart "Status Kualitas" (Lulus vs Revisi)
export const statusKualitas = [
  { name: "Lulus", value: 60 },
  { name: "Revisi", value: 40 },
];
export const STATUS_COLORS = ["#155e56", "#d9d9d9"]; // hijau tua (Lulus), abu-abu (Revisi)

// Data untuk area chart "Tren Inspeksi Mingguan"
export const trenInspeksi = [
  { hari: "Sen", jumlah: 20 },
  { hari: "Sel", jumlah: 35 },
  { hari: "Rab", jumlah: 28 },
  { hari: "Kam", jumlah: 45 },
  { hari: "Jum", jumlah: 60 },
  { hari: "Sab", jumlah: 38 },
  { hari: "Min", jumlah: 25 },
];

// Data untuk tabel "Data Sales"
export const salesData = [
  { id: 1, name: "Sarah Anderson", region: "North Region", totalSales: "Rp124,500", achievement: 110 },
  { id: 2, name: "Marcus Rodriguez", region: "South Region", totalSales: "Rp98,200", achievement: 92 },
  { id: 3, name: "Elena Chen", region: "East Region", totalSales: "Rp145,000", achievement: 125 },
];
