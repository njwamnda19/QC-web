// editSales.jsx
// Form edit data sales yang sudah ada
// Data di-load dari localStorage berdasarkan ID dari URL params

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCog } from "lucide-react";
import Topbar from "../components/Topbar";
import { salesData } from "../data/dummyData";

const REGIONS = ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar", "Bali"];

export default function EditSales() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    region: "",
    totalSales: "",
    achievement: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isFromDummy, setIsFromDummy] = useState(false);

  useEffect(() => {
    const localSales = JSON.parse(localStorage.getItem("sales")) || [];
    const allSales = [...salesData, ...localSales];
    const sale = allSales.find((s) => String(s.id) === String(id));

    if (!sale) {
      setNotFound(true);
      return;
    }

    setIsFromDummy(salesData.some((s) => String(s.id) === String(id)));
    setFormData({
      name: sale.name || sale.salesName || "",
      email: sale.email || "",
      region: sale.region || "",
      totalSales: sale.totalSales || "",
      achievement: sale.achievement || "",
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Nama sales wajib diisi";
    if (!formData.region) err.region = "Region wajib dipilih";
    if (!formData.achievement) err.achievement = "Achievement wajib diisi";
    else if (Number(formData.achievement) < 0 || Number(formData.achievement) > 200)
      err.achievement = "Achievement harus antara 0–200%";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isFromDummy) {
      alert("Data bawaan tidak dapat diedit.");
      return;
    }
    setSaving(true);

    const localSales = JSON.parse(localStorage.getItem("sales")) || [];
    const updated = localSales.map((s) =>
      String(s.id) === String(id)
        ? {
            ...s,
            name: formData.name,
            email: formData.email,
            region: formData.region,
            totalSales: formData.totalSales || "—",
            achievement: Number(formData.achievement),
          }
        : s
    );
    localStorage.setItem("sales", JSON.stringify(updated));
    setSaving(false);
    navigate("/datasales");
  };

  if (notFound) {
    return (
      <div>
        <Topbar title="Edit Sales" />
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg font-semibold">Data tidak ditemukan</p>
          <button
            onClick={() => navigate("/datasales")}
            className="mt-4 px-4 py-2 text-sm bg-brand-700 text-white rounded-lg hover:bg-brand-800"
          >
            Kembali ke Data Sales
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title="Edit Sales"
        description="Perbarui informasi data sales."
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
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <UserCog size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Edit Data Sales
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isFromDummy
                  ? "Data bawaan hanya bisa dilihat, tidak bisa diedit."
                  : "Perbarui data di bawah lalu klik Simpan."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nama Sales <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isFromDummy}
                className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                  errors.name
                    ? "border-red-300 bg-red-50"
                    : isFromDummy
                    ? "border-gray-100 bg-gray-50 text-gray-400"
                    : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isFromDummy}
                placeholder="contoh@email.com"
                className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                  isFromDummy
                    ? "border-gray-100 bg-gray-50 text-gray-400"
                    : "border-gray-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                disabled={isFromDummy}
                className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-gray-600 transition-colors ${
                  errors.region
                    ? "border-red-300 bg-red-50"
                    : isFromDummy
                    ? "border-gray-100 bg-gray-50 text-gray-400"
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
                  disabled={isFromDummy}
                  placeholder="e.g. Rp120,000"
                  className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                    isFromDummy
                      ? "border-gray-100 bg-gray-50 text-gray-400"
                      : "border-gray-200"
                  }`}
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
                  disabled={isFromDummy}
                  placeholder="0 – 200"
                  min="0"
                  max="200"
                  className={`border rounded-lg w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
                    errors.achievement
                      ? "border-red-300 bg-red-50"
                      : isFromDummy
                      ? "border-gray-100 bg-gray-50 text-gray-400"
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

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              {!isFromDummy && (
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-700 hover:bg-brand-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate("/datasales")}
                className={`${isFromDummy ? "flex-1" : ""} px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors`}
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
