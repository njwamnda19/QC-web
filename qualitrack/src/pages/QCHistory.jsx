// QCHistory.jsx
// Halaman riwayat semua evaluasi QC yang telah disubmit.
// Membaca dari localStorage ("qcRecords") dan menampilkan dalam tabel terfilter.

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ClipboardCheck, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Topbar from "../components/Topbar";

const ITEMS_PER_PAGE = 8;

function ScoreBadge({ score }) {
  if (score === null || score === undefined)
    return <span className="text-gray-400 text-xs">—</span>;

  const color =
    score >= 80
      ? "bg-green-50 text-green-700"
      : score >= 60
      ? "bg-yellow-50 text-yellow-700"
      : "bg-red-50 text-red-600";

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${color}`}>
      {score}/100
    </span>
  );
}

function StatusBadge({ score }) {
  if (score === null || score === undefined)
    return <span className="text-gray-400 text-xs">—</span>;

  if (score >= 80)
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
        Lulus
      </span>
    );
  if (score >= 60)
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700">
        Perlu Perbaikan
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600">
      Tidak Lulus
    </span>
  );
}

export default function QCHistory() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("qcRecords")) || [];
    // Urutkan dari terbaru
    setRecords([...stored].reverse());
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        (r.salesTarget || "").toLowerCase().includes(q) ||
        (r.inspectorName || "").toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function formatDate(isoStr) {
    if (!isoStr) return "—";
    return new Date(isoStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function handleClearAll() {
    if (!confirm("Hapus semua riwayat QC? Tindakan ini tidak bisa dibatalkan."))
      return;
    localStorage.removeItem("qcRecords");
    setRecords([]);
  }

  return (
    <div>
      <Topbar
        title="Riwayat QC"
        description="Semua evaluasi Quality Control yang telah disubmit."
      >
        {records.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-500 hover:text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Hapus Semua
          </button>
        )}
        <button
          onClick={() => navigate("/qc")}
          className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Audit
        </button>
      </Topbar>

      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        {/* Search */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari sales atau inspektor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <span className="text-xs text-gray-400">
            {filtered.length} evaluasi ditemukan
          </span>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">SALES DINILAI</th>
                <th className="px-4 py-3 font-medium">INSPEKTOR</th>
                <th className="px-4 py-3 font-medium">TGL INSPEKSI</th>
                <th className="px-4 py-3 font-medium">SKOR</th>
                <th className="px-4 py-3 font-medium">STATUS</th>
                <th className="px-4 py-3 font-medium">DISUBMIT</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((record, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-semibold flex items-center justify-center shrink-0">
                        {(record.salesTarget || "?")
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">
                        {record.salesTarget || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {record.inspectorName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {record.inspectionDate
                      ? formatDate(record.inspectionDate)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={record.score} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge score={record.score} />
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {formatDate(record.submittedAt)}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ClipboardCheck size={32} className="text-gray-200" />
                      <p className="text-sm font-medium">Belum ada riwayat evaluasi</p>
                      <p className="text-xs">
                        Submit QC pertama kamu dari halaman{" "}
                        <button
                          onClick={() => navigate("/qc")}
                          className="text-brand-600 underline"
                        >
                          QC Assessment
                        </button>
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-400 border-t border-gray-50">
            <span>
              Showing{" "}
              {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}{" "}
              –{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-md text-xs transition-colors ${
                    page === currentPage
                      ? "bg-brand-700 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
