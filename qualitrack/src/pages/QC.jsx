import { useState, useEffect } from "react";
import { UploadCloud, X, FileText, CheckCircle } from "lucide-react";
import Topbar from "../components/Topbar";
import RatingScale from "../components/RatingScale";
import { salesData } from "../data/dummyData";

// ===== SUB-KOMPONEN UNTUK HANDLE PREVIEW PER FILE =====
function FilePreviewItem({ file, onRemove }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) return;
    const fileType = file.type;

    if (fileType.startsWith("image/") || fileType === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreview({ type: fileType.startsWith("image/") ? "image" : "pdf", url });
      
      // Cleanup memori pas file dihapus
      return () => URL.revokeObjectURL(url);
    } else if (fileType === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => setPreview({ type: "text", content: e.target.result });
      reader.readAsText(file);
    } else {
      setPreview({ type: "unknown" });
    }
  }, [file]);

  return (
    <li className="flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2">
      <div className="flex items-center justify-between gap-2 text-xs text-gray-600">
        <span className="flex items-center gap-1.5 truncate">
          <FileText size={12} className="shrink-0 text-brand-600" />
          <span className="truncate font-medium">{file.name}</span>
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 shrink-0 bg-white rounded-full p-0.5 shadow-sm"
        >
          <X size={14} />
        </button>
      </div>

      {/* Area Render Preview */}
      <div className="w-full bg-white rounded border border-gray-100 overflow-hidden">
        {preview?.type === "image" && (
          <img src={preview.url} alt="preview" className="w-full h-24 object-cover" />
        )}
        {preview?.type === "pdf" && (
          <iframe src={preview.url} title="pdf-preview" className="w-full h-32 pointer-events-none" />
        )}
        {preview?.type === "text" && (
          <pre className="text-[10px] p-2 text-gray-700 h-24 overflow-auto whitespace-pre-wrap">
            {preview.content}
          </pre>
        )}
        {preview?.type === "unknown" && (
          <div className="text-[10px] text-gray-400 text-center py-3">
            Format tidak bisa dipreview
          </div>
        )}
      </div>
    </li>
  );
}

// ===== KOMPONEN UTAMA =====
export default function QC() {
  const [form, setForm] = useState({
    inspectorName: "",
    salesTarget: "",
    inspectionDate: "",
    programAccuracy: null,
    responseTime: null,
    followUpTechnical: null,
    empathyComm: null,
    grammar: null,
    closingConversion: null,
    notes: "",
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const localSales = JSON.parse(localStorage.getItem("sales")) || [];
  const allSales = [...salesData, ...localSales];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Logic filter ukuran file dipisah biar rapi
  function processNewFiles(newFiles) {
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`Ditolak: Ukuran file "${file.name}" melebihi batas 10MB.`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...validFiles]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    processNewFiles(Array.from(e.dataTransfer.files));
  }

  function handleFileSelect(e) {
    processNewFiles(Array.from(e.target.files));
    e.target.value = ""; // Reset value input biar bisa upload file yang sama 2x kalau butuh
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function calculateScore() {
    const coreFactor = form.programAccuracy;
    const secondaryFactors = [
      form.responseTime,
      form.followUpTechnical,
      form.empathyComm,
      form.grammar,
      form.closingConversion,
    ];

    const validSecondary = secondaryFactors.filter((v) => v !== null);
    if (!coreFactor && validSecondary.length === 0) return null;

    const coreScore = coreFactor ?? 0;
    const secondaryAvg = validSecondary.length > 0
      ? validSecondary.reduce((a, b) => a + b, 0) / secondaryFactors.length
      : 0;

    const weighted = (coreScore * 0.4) + (secondaryAvg * 0.6);
    return Math.round(weighted * 20);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const score = calculateScore();
    const payload = { ...form, score, submittedAt: new Date().toISOString() };

    try {
      const response = await fetch("http://localhost:8000/api/qc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      const existing = JSON.parse(localStorage.getItem("qcRecords")) || [];
      existing.push(payload);
      localStorage.setItem("qcRecords", JSON.stringify(existing));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm({
      inspectorName: "", salesTarget: "", inspectionDate: "",
      programAccuracy: null, responseTime: null, followUpTechnical: null,
      empathyComm: null, grammar: null, closingConversion: null, notes: "",
    });
    setFiles([]);
    setSubmitted(false);
  }

  const score = calculateScore();

  if (submitted) {
    return (
      <div>
        <Topbar title="Quality Control Assessment" description="Complete the evaluation form below." />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-brand-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Evaluasi Berhasil Disimpan!</h2>
          <p className="text-sm text-gray-500 mb-1">Sales: <span className="font-medium text-gray-700">{form.salesTarget || "—"}</span></p>
          {score !== null && (
            <p className="text-sm text-gray-500 mb-6">Skor QC: <span className={`font-semibold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-500"}`}>{score}/100</span></p>
          )}
          <button onClick={handleReset} className="px-6 py-2.5 bg-brand-700 text-white text-sm font-medium rounded-lg hover:bg-brand-800 transition-colors">Buat Evaluasi Baru</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar title="Quality Control Assessment" description="Lengkapi form evaluasi di bawah. Pastikan semua kriteria dinilai secara akurat sebelum submit." />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-start">
          
          {/* KOLOM KIRI: Upload & Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Documentation</h2>
            
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center py-10 px-4 cursor-pointer transition-colors ${
                isDragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-500'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
                <UploadCloud size={20} />
              </div>
              <p className="text-sm text-gray-600">Drag and drop files here</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF, TXT (Max 10MB)</p>
              <input type="file" multiple className="hidden" onChange={handleFileSelect} accept=".jpg,.jpeg,.png,.pdf,.txt" />
              <span className="mt-4 inline-block border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-600 bg-white">Browse Files</span>
            </label>

            {/* List Preview */}
            {files.length > 0 && (
              <ul className="mt-3">
                {files.map((file, i) => (
                  <FilePreviewItem key={i} file={file} onRemove={() => removeFile(i)} />
                ))}
              </ul>
            )}

            {score !== null && (
              <div className="mt-5 p-4 rounded-xl bg-brand-50 border border-brand-100 text-center">
                <p className="text-xs text-brand-700 font-medium mb-1">Estimasi Skor QC</p>
                <p className={`text-3xl font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-500"}`}>{score}</p>
                <p className="text-xs text-gray-400 mt-0.5">dari 100</p>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: Form & Rating */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Inspection Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Inspector Name</label>
                <input type="text" placeholder="Enter full name" value={form.inspectorName} onChange={(e) => updateField("inspectorName", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sales yang Dinilai</label>
                <select value={form.salesTarget} onChange={(e) => updateField("salesTarget", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-gray-600" required>
                  <option value="">Pilih Sales...</option>
                  {allSales.map((s) => <option key={s.id || s.name} value={s.name}>{s.name} — {s.region}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-500 mb-1">Inspection Date</label>
              <input type="date" value={form.inspectionDate} onChange={(e) => updateField("inspectionDate", e.target.value)} className="w-full md:w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" required />
            </div>

            {/* Core Factor */}
            <div className="mb-2 pb-1 border-b border-gray-100">
              <span className="inline-block text-[10px] font-bold tracking-widest text-brand-700 bg-brand-50 px-2 py-0.5 rounded mb-1">CORE FACTOR · Bobot 40%</span>
              <h3 className="text-sm font-semibold text-gray-700">Evaluation Criteria</h3>
            </div>
            <RatingScale label="Program Information Accuracy" description="Ketepatan informasi program/produk." value={form.programAccuracy} onChange={(val) => updateField("programAccuracy", val)} />

            {/* Secondary Factor */}
            <div className="mb-2 pb-1 border-b border-gray-100 mt-4">
              <span className="inline-block text-[10px] font-bold tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded mb-1">SECONDARY FACTOR · Bobot 60%</span>
              <h3 className="text-sm font-semibold text-gray-700">Evaluation Criteria</h3>
            </div>
            <RatingScale label="Response Time" description="Kecepatan sales membalas pesan." value={form.responseTime} onChange={(val) => updateField("responseTime", val)} />
            <RatingScale label="Follow-Up Technical" description="Metode dan strategi follow-up." value={form.followUpTechnical} onChange={(val) => updateField("followUpTechnical", val)} />
            <RatingScale label="Empathy & Comm" description="Kemampuan memahami kebutuhan klien." value={form.empathyComm} onChange={(val) => updateField("empathyComm", val)} />
            <RatingScale label="Grammar" description="Penggunaan bahasa yang tepat." value={form.grammar} onChange={(val) => updateField("grammar", val)} />
            <RatingScale label="Closing & Conversion" description="Kemampuan mengonversi prospek." value={form.closingConversion} onChange={(val) => updateField("closingConversion", val)} />

            <div className="mb-5 mt-2">
              <label className="block text-xs text-gray-500 mb-1">Additional Comments</label>
              <textarea rows={3} placeholder="Detail temuan spesifik..." value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={handleReset} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Reset Form</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 text-sm rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors disabled:opacity-60 font-medium">
                {submitting ? "Menyimpan..." : "Submit Evaluation"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}