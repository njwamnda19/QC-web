// qcService.js — Layer komunikasi frontend ke API QC

const BASE_URL = "http://localhost:8000/api/qc";

export async function submitQC(data) {
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal menyimpan evaluasi QC");
  return res.json();
}

export async function getQCHistory() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Gagal mengambil riwayat QC");
  return res.json();
}
