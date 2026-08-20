// RatingScale.jsx
// Komponen kecil untuk menampilkan pilihan angka 1-5 (skala poor-excellent)
// yang dipakai di form "Evaluation Criteria" pada halaman QC.
//
// Ini adalah "controlled component": nilai yang dipilih (value) dan fungsi
// untuk mengubahnya (onChange) dikirim dari komponen induk (parent),
// komponen ini sendiri tidak menyimpan state-nya sendiri.

export default function RatingScale({ label, description, value, onChange }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {description && <p className="text-xs text-gray-400 mb-2">{description}</p>}

      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                isSelected
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
