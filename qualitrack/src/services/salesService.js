// salesService.js — Layer komunikasi frontend ke API sales

const BASE_URL = "http://localhost:8000/api/sales";

export async function getSales() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Gagal mengambil data sales");
  return res.json();
}

export async function addSales(data) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal menambah data sales");
  return res.json();
}

export async function updateSales(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal mengupdate data sales");
  return res.json();
}

export async function deleteSales(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus data sales");
  return res.json();
}
