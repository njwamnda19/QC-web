// QC.jsx
// Halaman kedua: "Halaman QC" / Quality Control Assessment.
// Berisi form penilaian kualitas produk: upload dokumentasi, detail inspeksi,
// dan kriteria evaluasi dengan skala 1-5.
//
// Kita pakai "useState" untuk menyimpan seluruh isi form dalam satu object,
// supaya mudah dikirim (misalnya via fetch ke backend) saat tombol "Submit Evaluation" ditekan.

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import Topbar from "../components/Topbar";
import RatingScale from "../components/RatingScale";

export default function QC () {
  // State untuk field-field form. Nilai awal dikosongkan / null.
  const [form, setForm] = useState({
    inspectorName: "",
    productId: "",
    inspectionDate: "",
    structuralIntegrity: null, // rating 1-5
    surfaceFinish: null, // rating 1-5
    notes: "",
  });

  // File yang di-drag/drop atau dipilih lewat "Browse Files"
  const [files, setFiles] = useState([]);

  // Fungsi generik untuk update satu field di object "form" tanpa menghapus field lain
  // (memakai spread operator "...form" untuk menyalin field-field yang sudah ada).
  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Dipanggil saat user drop file ke area upload
  function handleDrop(e) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }

  // Dipanggil saat user memilih file lewat dialog (tombol "Browse Files")
  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  }

  function handleSubmit() {
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/db_qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(result.message || "Data berhasil dikirim!");
    } catch (error) {
      console.error("Gagal terhubung ke server:", error);
      alert("Terjadi kesalahan saat menghubungkan ke backend.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 font-sans">
      {/* Pastikan tombol Submit Evaluation memiliki type="submit" */}
      <div className="flex justify-end gap-4 border-t border-slate-100 pt-6 mt-6">
        <button type="submit" className="px-6 py-2.5 bg-[#1F3E45] text-white font-semibold text-sm rounded-md hover:bg-slate-800 transition-colors shadow-sm">
          Submit Evaluation
        </button>
      </div>
    </form>
  );
  }

  return (
    <div>
      <Topbar
        title="Quality Control Assessment"
        description="Complete the evaluation form below. Ensure all criteria are rated accurately. Upload supporting documentation or images of the inspected product before submitting."
      />

      {/* Layout 2 kolom: Documentation (kiri, lebih sempit) & Inspection Details (kanan, lebih lebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
        {/* ===== KOLOM KIRI: Upload Dokumentasi ===== */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Documentation</h2>

          {/* Area drag & drop.
              onDragOver harus di-preventDefault, kalau tidak, event "onDrop" tidak akan pernah terpanggil oleh browser. */}
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center py-10 px-4 cursor-pointer hover:border-brand-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <UploadCloud size={20} />
            </div>
            <p className="text-sm text-gray-600">Drag and drop files here</p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: JPG, PNG, PDF, TXT (Max 10MB)
            </p>

            {/* input file disembunyikan secara visual, tapi tetap berfungsi karena dibungkus <label> di atas */}
            <input type="file" multiple className="hidden" onChange={handleFileSelect} />

            <span className="mt-4 inline-block border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-600 bg-white">
              Browse Files
            </span>
          </label>

          {/* Daftar file yang sudah dipilih/di-drop, ditampilkan sebagai list sederhana */}
          {files.length > 0 && (
            <ul className="mt-3 space-y-1">
              {files.map((file, i) => (
                <li key={i} className="text-xs text-gray-500 truncate">
                  📎 {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== KOLOM KANAN: Inspection Details ===== */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Inspection Details</h2>

          {/* Baris Inspector Name & Product ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Inspector Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={form.inspectorName}
                onChange={(e) => updateField("inspectorName", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Product ID / Batch No.</label>
              <input
                type="text"
                placeholder="e.g. PRD-2023-891"
                value={form.productId}
                onChange={(e) => updateField("productId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          {/* Inspection Date */}
          <div className="mb-5">
            <label className="block text-xs text-gray-500 mb-1">Inspection Date</label>
            <input
              type="date"
              value={form.inspectionDate}
              onChange={(e) => updateField("inspectionDate", e.target.value)}
              className="w-full md:w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* ===== Evaluation Criteria ===== */}
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Evaluation Criteria</h3>
          <p className="text-xs text-gray-400 mb-4">Rate each aspect on a scale of 1 (Poor) to 5 (Excellent).</p>

          <RatingScale
            label="Structural Integrity"
            description="Checking for cracks, deformities, or weak joints."
            value={form.structuralIntegrity}
            onChange={(val) => updateField("structuralIntegrity", val)}
          />
          <RatingScale
            label="Surface Finish & Color"
            description="Consistency of coating, absence of scratches."
            value={form.surfaceFinish}
            onChange={(val) => updateField("surfaceFinish", val)}
          />

          {/* Additional Comments */}
          <div className="mb-5">
            <label className="block text-xs text-gray-500 mb-1">Additional Comments / Findings</label>
            <textarea
              rows={4}
              placeholder="Detail any specific issues, anomalies, or notes regarding the evaluation..."
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3">
            <button 
            type = "submit"
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              Save Draft
            </button>
            <button
            type = "submit"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm rounded-lg bg-brand-700 text-white hover:bg-brand-800"
            >
              Submit Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
