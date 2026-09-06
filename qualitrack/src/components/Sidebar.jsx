// Sidebar.jsx
// Komponen ini adalah MENU NAVIGASI di sisi kiri layar.
// Dipakai berulang di 3 halaman (Dashboard, QC, Data Sales) supaya kode tidak duplikat.
//
// "NavLink" dari react-router-dom otomatis tahu link mana yang sedang aktif
// (sesuai URL saat ini), jadi kita bisa memberi style berbeda tanpa logic manual.

import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardCheck, Users, Plus, HelpCircle, LogOut } from "lucide-react";

// Daftar menu didefinisikan sebagai array supaya mudah ditambah/diubah,
// tidak perlu tulis <NavLink> berkali-kali secara manual.
const menuItems = [
  { to: "/dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
  { to: "/dataSales", label: "Data Sales", icon: Users },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* ===== Logo & Nama Aplikasi ===== */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
          Q
        </div>
        <div>
          <p className="font-semibold text-gray-800 leading-none">QualiTrack</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Precision Control</p>
        </div>
      </div>

      {/* ===== Tombol "New Audit" ===== */}
      <div className="px-4 mb-3">
        <button 
        onClick={() => navigate ('/QC')}
        className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 transition-colors text-white text-sm font-medium py-2.5 rounded-lg">
          <Plus size={16} />
          New Audit
        </button>
      </div>

      {/* ===== Daftar Menu Navigasi ===== */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            // "end" penting khusus untuk path "/" agar tidak selalu dianggap aktif
            end={to === "/"}
            // NavLink memberi kita fungsi (isActive) => className, sehingga kita bisa
            // menentukan warna berbeda saat menu ini adalah halaman yang sedang dibuka.
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ===== Bagian bawah: Bantuan & Keluar ===== */}
      <div className="px-3 pb-5 space-y-1 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <HelpCircle size={18} />
          Bantuan
        </button>
        <button
        onClick={handleLogout} 
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
