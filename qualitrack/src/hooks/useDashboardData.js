// hooks/useDashboardData.js
// Custom hook yang membaca & menghitung semua data dashboard secara real-time
// dari localStorage (qcRecords + sales).
//
// Strategi:
// 1. Hitung ulang setiap kali halaman di-focus (user balik dari tab lain / halaman lain)
// 2. Poll setiap REFRESH_INTERVAL ms sebagai safety net
// 3. Juga bisa di-trigger manual lewat fungsi refresh()

import { useState, useEffect, useCallback } from "react";
import { salesData as dummySalesData } from "../data/dummyData";

const REFRESH_INTERVAL = 3000; // 3 detik

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Ambil semua QC record dari localStorage */
function readQCRecords() {
  try {
    return JSON.parse(localStorage.getItem("qcRecords")) || [];
  } catch {
    return [];
  }
}

/** Gabungkan dummy sales + localStorage sales */
function readAllSales() {
  try {
    const local = JSON.parse(localStorage.getItem("sales")) || [];
    return [...dummySalesData, ...local];
  } catch {
    return dummySalesData;
  }
}

/** Apakah tanggal ISO string jatuh dalam rentang [from, to]? */
function inDateRange(isoStr, from, to) {
  if (!from && !to) return true;
  const d = new Date(isoStr);
  if (from && d < new Date(from)) return false;
  if (to) {
    const toEnd = new Date(to);
    toEnd.setHours(23, 59, 59, 999);
    if (d > toEnd) return false;
  }
  return true;
}

/** Nama hari Indonesia (0=Min…6=Sab) → index Senin=0 */
const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const WEEK_LABEL = ["W1", "W2", "W3", "W4"];

/** Hitung tren inspeksi MINGGU INI (Senin s.d. hari ini) dari qcRecords */
function buildTrenMinggu(records) {
  const today = new Date();
  // Senin minggu ini
  const monday = new Date(today);
  const dow = today.getDay(); // 0=Sun
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);

  const counts = Array(7).fill(0);
  records.forEach((r) => {
    if (!r.submittedAt) return;
    const d = new Date(r.submittedAt);
    if (d >= monday && d <= today) {
      // dayOfWeek: Mon=0 … Sun=6
      const idx = (d.getDay() + 6) % 7;
      counts[idx]++;
    }
  });

  // Jika semua 0 (belum ada data), pakai dummy agar grafik tidak kosong
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return [
      { label: "Sen", jumlah: 20 },
      { label: "Sel", jumlah: 35 },
      { label: "Rab", jumlah: 28 },
      { label: "Kam", jumlah: 45 },
      { label: "Jum", jumlah: 60 },
      { label: "Sab", jumlah: 38 },
      { label: "Min", jumlah: 25 },
    ];
  }

  return HARI.map((label, i) => ({ label, jumlah: counts[i] }));
}

/** Hitung tren inspeksi BULAN INI per minggu (W1–W4) dari qcRecords */
function buildTrenBulan(records) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const counts = [0, 0, 0, 0];
  records.forEach((r) => {
    if (!r.submittedAt) return;
    const d = new Date(r.submittedAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const weekIdx = Math.min(3, Math.floor((d.getDate() - 1) / 7));
      counts[weekIdx]++;
    }
  });

  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return [
      { label: "W1", jumlah: 148 },
      { label: "W2", jumlah: 212 },
      { label: "W3", jumlah: 176 },
      { label: "W4", jumlah: 231 },
    ];
  }

  return WEEK_LABEL.map((label, i) => ({ label, jumlah: counts[i] }));
}

/** Hitung ranking performa sales dari rata-rata skor QC per sales */
function buildRanking(records, allSales) {
  const map = {};
  records.forEach((r) => {
    if (!r.salesTarget || r.score == null) return;
    if (!map[r.salesTarget]) map[r.salesTarget] = [];
    map[r.salesTarget].push(r.score);
  });

  const ranked = Object.entries(map).map(([name, scores]) => ({
    tim: name.split(" ")[0], // nama depan saja agar muat di chart
    fullName: name,
    nilai: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  // Sort descending by nilai, ambil max 8 untuk keterbacaan
  ranked.sort((a, b) => b.nilai - a.nilai);
  const top = ranked.slice(0, 8);

  // Jika belum ada data QC sama sekali, pakai dummy
  if (top.length === 0) {
    return [
      { tim: "Tim A", nilai: 92, fullName: "Tim A" },
      { tim: "Tim B", nilai: 78, fullName: "Tim B" },
      { tim: "Tim C", nilai: 65, fullName: "Tim C" },
      { tim: "Tim D", nilai: 88, fullName: "Tim D" },
      { tim: "Tim E", nilai: 55, fullName: "Tim E" },
      { tim: "Tim F", nilai: 70, fullName: "Tim F" },
    ];
  }

  return top;
}

/** Hitung status kualitas: Lulus (≥80) vs Perlu Perbaikan (<80) */
function buildStatusKualitas(records) {
  if (records.length === 0) {
    return [
      { name: "Lulus", value: 60 },
      { name: "Revisi", value: 40 },
    ];
  }

  const scored = records.filter((r) => r.score != null);
  if (scored.length === 0) return [{ name: "Lulus", value: 0 }, { name: "Revisi", value: 100 }];

  const lulus = scored.filter((r) => r.score >= 80).length;
  const revisi = scored.length - lulus;
  const lulusPct = Math.round((lulus / scored.length) * 100);
  const revisiPct = 100 - lulusPct;

  return [
    { name: "Lulus", value: lulusPct },
    { name: "Revisi", value: revisiPct },
  ];
}

/** Hitung 4 stat cards */
function buildStatCards(records, allSales, dateFrom, dateTo) {
  const filtered = records.filter((r) =>
    inDateRange(r.submittedAt || r.inspectionDate, dateFrom, dateTo)
  );

  const totalAudits = filtered.length;
  const scores = filtered.map((r) => r.score).filter((s) => s != null);
  const avgCompliance =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : null;
  const criticalIssues = filtered.filter((r) => r.score != null && r.score < 60).length;
  const totalSales = allSales.length;

  return [
    {
      id: "audit",
      label: "Total Audits",
      value: totalAudits > 0 ? totalAudits.toLocaleString() : "—",
      trend:
        totalAudits > 0
          ? `${totalAudits} evaluasi${dateFrom || dateTo ? " di periode ini" : " tersimpan"}`
          : "Belum ada evaluasi QC",
      trendUp: totalAudits > 0 ? true : null,
      icon: "clipboard",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      id: "compliance",
      label: "Avg Compliance",
      value: avgCompliance !== null ? `${avgCompliance}%` : "—",
      trend:
        avgCompliance !== null
          ? avgCompliance >= 80
            ? "Performa baik 👍"
            : "Perlu peningkatan"
          : "Belum ada skor QC",
      trendUp: avgCompliance !== null ? avgCompliance >= 80 : null,
      icon: "check",
      iconColor: "text-purple-600 bg-purple-50",
    },
    {
      id: "critical",
      label: "Critical Issues",
      value: criticalIssues > 0 ? criticalIssues.toString() : "0",
      trend:
        criticalIssues > 0
          ? `${criticalIssues} sales skor < 60`
          : "Tidak ada isu kritis",
      trendUp: criticalIssues === 0 ? true : false,
      icon: "alert",
      iconColor:
        criticalIssues > 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50",
    },
    {
      id: "inspectors",
      label: "Total Sales",
      value: totalSales.toString(),
      trend: `${totalSales} sales terdaftar`,
      trendUp: null,
      icon: "users",
      iconColor: "text-gray-600 bg-gray-100",
    },
  ];
}

// ─── Main hook ───────────────────────────────────────────────────────────────

export function useDashboardData({ dateFrom = "", dateTo = "" } = {}) {
  const compute = useCallback(() => {
    const qcRecords = readQCRecords();
    const allSales = readAllSales();

    // Filter QC records berdasarkan rentang tanggal (pakai inspectionDate atau submittedAt)
    const filtered = qcRecords.filter((r) => {
      const dateStr = r.inspectionDate || r.submittedAt;
      return inDateRange(dateStr, dateFrom, dateTo);
    });

    return {
      statCards: buildStatCards(qcRecords, allSales, dateFrom, dateTo),
      ranking: buildRanking(filtered, allSales),
      statusKualitas: buildStatusKualitas(filtered),
      trenMinggu: buildTrenMinggu(qcRecords),  // tren selalu pakai semua data (tidak difilter tanggal)
      trenBulan: buildTrenBulan(qcRecords),
      recentNotifs: [...qcRecords].reverse().slice(0, 5), // 5 notif terbaru
      totalQC: qcRecords.length,
    };
  }, [dateFrom, dateTo]);

  const [data, setData] = useState(compute);

  // Refresh saat dateFrom/dateTo berubah
  useEffect(() => {
    setData(compute());
  }, [compute]);

  // Auto-refresh setiap REFRESH_INTERVAL
  useEffect(() => {
    const interval = setInterval(() => {
      setData(compute());
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [compute]);

  // Refresh saat user kembali ke tab/window ini
  useEffect(() => {
    const onFocus = () => setData(compute());
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) setData(compute());
    });
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [compute]);

  // Fungsi manual refresh (bisa dipanggil dari komponen)
  const refresh = useCallback(() => setData(compute()), [compute]);

  return { ...data, refresh };
}
