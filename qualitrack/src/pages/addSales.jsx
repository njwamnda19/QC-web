// addSales.jsx
// Form tambah sales baru dengan validasi + styling konsisten

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import Topbar from "../components/Topbar";

const REGIONS = ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar", "Bali"];

export default function AddSales() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",          // fix: pakai "name" bukan "salesName" agar konsisten dengan DataSales
    email: "",
    region: "",
    totalSales: "",
    achievement: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat user mulai mengetik
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Nama sales wajib diisi";
    if (!formData.email.trim()) err.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      err.email = "Format email tidak valid";
    if (!formData.region) err.region = "Region wajib dipilih";
    if (!formData.achievement) err.achievement = "Achievement wajib diisi";
    else if (Number(formData.achievement) < 0 || Number(formData.achievement) > 200)
      err.achievement = "Achievement harus antara 0–200%";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const newSales = {
      id: Date.now(),
      name: formData.name,           // fix: field "name"
      email: formData.email,
      region: formData.region,
      totalSales: formData.totalSales || "—",
      achievement: Number(formData.achievement),
    };

    // Coba kirim ke backend, fallback ke localStorage
    try {
      const res = await fetch("http://localhost:8000/api/sales/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSales),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Simpan ke localStorage jika backend offline
      const existing = JSON.parse(localStorage.getItem("sales")) || [];
      existing.push(newSales);
      localStorage.setItem("sales", JSON.stringify(existing));
    }

    setSaving(false);
    navigate("/datasales");
  };

  return (
    <div>
      <Topbar
        title="Add New Sales"
        description="Tambahkan anggota sales baru ke dalam sistem."
      >
        <button
          type="button"
          onClick={() => navigate("/datasales")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali
        </button>
      </Topbar>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Data Sales Baru
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Lengkapi semua field yang wajib diisi.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Sales */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nama Sales <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                  errors.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                  errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-gray-600 transition-colors ${
                  errors.region
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <option value="">Pilih Region</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-500 text-xs mt-1">{errors.region}</p>
              )}
            </div>

            {/* Total Sales & Achievement (2 kolom) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Total Sales
                </label>
                <input
                  type="text"
                  name="totalSales"
                  value={formData.totalSales}
                  onChange={handleChange}
                  placeholder="e.g. Rp120,000"
                  className="border border-gray-200 rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Achievement (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="achievement"
                  value={formData.achievement}
                  onChange={handleChange}
                  placeholder="0 – 200"
                  min="0"
                  max="200"
                  className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                    errors.achievement
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.achievement && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.achievement}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-brand-700 hover:bg-brand-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Data"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/datasales")}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}