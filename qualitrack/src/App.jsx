import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import QC from "./pages/QC";
import DataSales from "./pages/DataSales";
import AddSales from "./pages/addSales";

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
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}