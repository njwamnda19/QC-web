// Topbar.jsx
// Header di bagian atas tiap halaman: judul besar + deskripsi singkat di kiri,
// dan slot kosong ("children") di kanan yang bisa diisi berbeda-beda tergantung halaman
// (contoh: filter tanggal di Dashboard, tombol "+ Add New" di Data Sales).
//
// Pola "children" ini dipakai supaya Topbar tetap satu komponen yang fleksibel,
// tidak perlu bikin Topbar terpisah untuk tiap halaman.

export default function Topbar({ title, description, children }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>

      {/* Konten kanan disisipkan dari komponen pemanggil (page-specific) */}
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
