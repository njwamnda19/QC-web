// dummyData.js — Extended dengan data bulanan untuk toggle chart

// Data untuk kartu statistik Dashboard
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
    trendUp: false,
    icon: "alert",
    iconColor: "text-red-600 bg-red-50",
  },
  {
    id: "inspectors",
    label: "Active Inspectors",
    value: "45",
    trend: "Currently in field",
    trendUp: null,
    icon: "users",
    iconColor: "text-gray-600 bg-gray-100",
  },
];

// Data grafik batang "Ranking Performa Sales"
export const rankingPerforma = [
  { tim: "Tim A", nilai: 92 },
  { tim: "Tim B", nilai: 78 },
  { tim: "Tim C", nilai: 65 },
  { tim: "Tim D", nilai: 88 },
  { tim: "Tim E", nilai: 55 },
  { tim: "Tim F", nilai: 70 },
];

// Data donut chart "Status Kualitas"
export const statusKualitas = [
  { name: "Lulus", value: 60 },
  { name: "Revisi", value: 40 },
];
export const STATUS_COLORS = ["#155e56", "#e5e7eb"];

// Data "Minggu Ini" — area chart harian (Sen–Min)
export const trenInspeksiMinggu = [
  { label: "Sen", jumlah: 20 },
  { label: "Sel", jumlah: 35 },
  { label: "Rab", jumlah: 28 },
  { label: "Kam", jumlah: 45 },
  { label: "Jum", jumlah: 60 },
  { label: "Sab", jumlah: 38 },
  { label: "Min", jumlah: 25 },
];

// Data "Bulan Ini" — area chart mingguan (W1–W4)
export const trenInspeksiBulan = [
  { label: "W1", jumlah: 148 },
  { label: "W2", jumlah: 212 },
  { label: "W3", jumlah: 176 },
  { label: "W4", jumlah: 231 },
];

// Alias untuk backward-compat (dipakai chart lama)
export const trenInspeksi = trenInspeksiMinggu;

// Data untuk tabel "Data Sales"
export const salesData = [
  { id: 1, name: "Sarah Anderson", region: "North Region", totalSales: "Rp124,500", achievement: 110 },
  { id: 2, name: "Marcus Rodriguez", region: "South Region", totalSales: "Rp98,200", achievement: 92 },
  { id: 3, name: "Elena Chen", region: "East Region", totalSales: "Rp145,000", achievement: 125 },
];
