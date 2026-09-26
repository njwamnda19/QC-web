// login.jsx — Redesign premium dengan glassmorphism

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulasi delay autentikasi
    await new Promise((r) => setTimeout(r, 600));

    if (email === "najwa@gmail.com" && password === "123456") {
      localStorage.setItem("auth_user", JSON.stringify({ email, name: "Najwa" }));
      navigate("/dashboard");
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a1628]">
      {/* Background decorative blobs */}
      <div
        className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, #155e56 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, #1f6b63 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, #ffffff 0%, transparent 60%)",
        }}
      />

      {/* Card glassmorphism */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-8 border border-white/10"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-brand-700 flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            QualiTrack
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Quality Control & Sales Management
          </p>
        </div>

        {/* Welcome text */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold text-white">
            Selamat Datang Kembali
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Masuk untuk melanjutkan ke dashboard
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(21,94,86,0.8)";
                e.target.style.boxShadow = "0 0 0 3px rgba(21,94,86,0.2)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(21,94,86,0.8)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(21,94,86,0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Hint credentials */}
          <p className="text-xs text-white/25 text-center">
            Demo: najwa@gmail.com / 123456
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60"
            style={{
              background: loading
                ? "rgba(21,94,86,0.6)"
                : "linear-gradient(135deg, #155e56 0%, #0f4a44 100%)",
              boxShadow: loading
                ? "none"
                : "0 4px 15px rgba(21,94,86,0.4)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Memverifikasi...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-6">
          © 2025 QualiTrack · Precision Quality Control
        </p>
      </div>
    </div>
  );
}