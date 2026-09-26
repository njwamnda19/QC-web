// App.jsx — Updated dengan route editSales + simple protected route

import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import QC from "./pages/QC";
import DataSales from "./pages/DataSales";
import AddSales from "./pages/addSales";
import EditSales from "./pages/editSales";

// Protected route: redirect ke login jika belum auth
function RequireAuth({ children }) {
  const isLoggedIn = !!localStorage.getItem("auth_user");
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/qc" element={<QC />} />
          <Route path="/datasales" element={<DataSales />} />
          <Route path="/addSales" element={<AddSales />} />
          <Route path="/editSales/:id" element={<EditSales />} />
          {/* Redirect catch-all ke dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      />
    </Routes>
  );
}