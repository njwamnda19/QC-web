// Sidebar.jsx — Updated dengan navigasi QC + user info

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Plus,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";

const menuItems = [
  { to: "/dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
  { to: "/qc", label: "QC Assessment", icon: ClipboardCheck },
  { to: "/datasales", label: "Data Sales", icon: Users },
];

export default function Sidebar() {
  const navigate = useNavigate();

  // Ambil info user dari localStorage (disimpan saat login)
  const authUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("auth_user")) || { name: "Najwa", email: "najwa@gmail.com" };
    } catch {
      return { name: "Najwa", email: "najwa@gmail.com" };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    navigate("/");
  };

  // Inisial avatar dari nama user
  const initials = authUser.name
    ? authUser.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "N";

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo & App Name */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          Q
        </div>
        <div>
          <p className="font-semibold text-gray-800 leading-none text-sm">
            QualiTrack
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Precision Control</p>
        </div>
      </div>

      {/* Tombol New Audit */}
      <div className="px-4 py-3">
        <button
          onClick={() => navigate("/qc")}
          className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 transition-colors text-white text-sm font-medium py-2.5 rounded-lg"
        >
          <Plus size={15} />
          New Audit
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase px-3 py-2">
          Menu
        </p>
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  className={isActive ? "text-brand-600" : "text-gray-400"}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: Bantuan + User + Keluar */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <HelpCircle size={17} className="text-gray-400" />
          Bantuan
        </button>

        {/* User info */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg bg-gray-50">
          <div className="w-7 h-7 rounded-full bg-brand-700 text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">
              {authUser.name}
            </p>
            <p className="text-[10px] text-gray-400 truncate">
              {authUser.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={17} className="text-gray-400" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
