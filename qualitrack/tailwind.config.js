/** @type {import('tailwindcss').Config} */
export default {
  // "content" memberi tahu Tailwind file mana saja yang harus di-scan
  // untuk mencari nama class (misal "bg-brand-600") agar CSS-nya ikut dibuat.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warna teal gelap khas QualiTrack (dipakai di sidebar, tombol utama, ikon logo)
        brand: {
          50: "#eaf2f1",
          100: "#d3e5e3",
          500: "#1f6b63",
          600: "#155e56",
          700: "#0f4a44",
          800: "#0c3936",
          900: "#092b28",
        },
      },
      // Bayangan lembut khusus untuk kartu (card) agar tidak terlalu tajam
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
}

