import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSales() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    salesName: "",
    email: "",
    region: "",
    achievement: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const err = {};

    if (!formData.salesName.trim())
      err.salesName = "Sales name is required";

    if (!formData.email.trim())
      err.email = "Email is required";

    if (!formData.region.trim())
      err.region = "Region is required";

    if (!formData.achievement)
      err.achievement = "Achievement is required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  const newSales = {
    id: Date.now(),
    salesName: formData.salesName,
    email: formData.email,
    region: formData.region,
    achievement: formData.achievement,
  };

  // Ambil data lama
  const existingSales =
    JSON.parse(localStorage.getItem("sales")) || [];

  // Tambahkan data baru
  existingSales.push(newSales);

  // Simpan lagi
  localStorage.setItem(
    "sales",
    JSON.stringify(existingSales)
  );

  // Pindah ke Data Sales
  navigate("/datasales");
};

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Add New Sales
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-5"
      >

        <div>
          <label className="font-medium">
            Sales Name
          </label>

          <input
            type="text"
            name="salesName"
            value={formData.salesName}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 mt-2"
          />

          <p className="text-red-500 text-sm">
            {errors.salesName}
          </p>
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 mt-2"
          />

          <p className="text-red-500 text-sm">
            {errors.email}
          </p>
        </div>

        <div>
          <label>Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 mt-2"
          >
            <option value="">Choose Region</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
          </select>

          <p className="text-red-500 text-sm">
            {errors.region}
          </p>
        </div>

        <div>
          <label>Achievement (%)</label>
          <input
            type="number"
            name="achievement"
            value={formData.achievement}
            onChange={handleChange}
            className="border rounded-lg w-full p-3 mt-2"
          />

          <p className="text-red-500 text-sm">
            {errors.achievement}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/dataSales")}
            className="border px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}