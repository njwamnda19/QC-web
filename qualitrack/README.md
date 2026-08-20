# QualiTrack - Precision Control

Website dashboard QC (Quality Control) & Sales, dibangun dengan **React + Vite + Tailwind CSS**.

## Struktur Halaman

| Route         | Halaman              |
|---------------|----------------------|
| `/`           | Dashboard Utama      |
| `/qc`         | Quality Control Assessment |
| `/data-sales` | Data Sales           |

## Struktur Folder

```
src/
├── components/       # Komponen kecil yang dipakai berulang di beberapa halaman
│   ├── Sidebar.jsx           -> menu navigasi kiri
│   ├── Topbar.jsx            -> header judul halaman
│   ├── StatCard.jsx          -> kartu statistik (Dashboard)
│   ├── DashboardCharts.jsx   -> 3 grafik (bar, donut, area) pakai recharts
│   └── RatingScale.jsx       -> tombol rating 1-5 (halaman QC)
├── pages/            # Satu file = satu halaman penuh
│   ├── Dashboard.jsx
│   ├── QC.jsx
│   └── DataSales.jsx
├── data/
│   └── dummyData.js  # Data contoh (nanti diganti data asli dari API/backend)
├── App.jsx           # Routing utama (react-router-dom)
└── main.jsx           # Entry point React
```

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka di browser
http://localhost:5173
```

## Build untuk Production

```bash
npm run build
```
Hasil build akan ada di folder `dist/`.

## Library yang Dipakai

- **react-router-dom** — untuk navigasi antar halaman (Dashboard, QC, Data Sales) tanpa reload browser.
- **recharts** — untuk membuat grafik (bar chart, donut chart, area chart) di Dashboard.
- **lucide-react** — kumpulan ikon (bell, upload, search, dll).
- **tailwindcss** — utility-first CSS framework untuk styling.

## Menghubungkan ke Data Asli (Backend)

Saat ini semua data (statistik, grafik, tabel sales) masih berupa **data contoh** di file
`src/data/dummyData.js`. Untuk memakai data asli:

1. Ganti isi `dummyData.js` dengan hasil `fetch()`/`axios.get()` ke API kamu, biasanya
   dipanggil di dalam `useEffect` pada tiap halaman (`Dashboard.jsx`, `DataSales.jsx`).
2. Untuk form di halaman QC (`QC.jsx`), fungsi `handleSubmit` adalah tempat untuk
   mengirim data form ke server (misalnya `fetch('/api/qc', { method: 'POST', body: ... })`).
