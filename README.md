# Alcohol Test App - Internal MVP

Sistem internal pemeriksaan kadar alkohol karyawan dengan kalkulasi status otomatis, penelusuran riwayat kronologis (*trace*), pelaporan periodik/individual siap cetak PDF/share WhatsApp, dan perekaman jejak audit (*audit trail*).

Aplikasi ini dirancang dengan antarmuka modern yang didominasi warna biru, bersih, intuitif, dan responsif.

## 🚀 Fitur Utama MVP

1. **Dashboard Ringkas**: Menampilkan kartu ringkasan harian (total tes, normal, fail, total orang) dan 5 transaksi pemeriksaan terbaru.
2. **Data Orang (Master)**: Pengelolaan identitas karyawan (nama, NRP/ID, departemen, jabatan, lokasi kerja) lengkap dengan status aktif/nonaktif.
3. **Input Tes (Transaksi Inti)**:
   - Pencarian karyawan dinamis.
   - Kolom isian parameter pemeriksaan (lokasi, petugas, nama alat, catatan).
   - **Kalkulasi Status Otomatis**: `0` = **NORMAL** (badge biru), `>0` = **FAIL** (badge merah), `<0` = **INVALID** (badge kuning). Status tidak dapat diubah manual.
   - State sukses instan dengan opsi cetak draf PDF dan bagikan ke WhatsApp.
4. **Riwayat Tes**: Tabel log lengkap dengan pencarian global, saringan tanggal, dan filter status (*Semua, Normal, Fail*). Dilengkapi panel detail transaksi.
5. **Trace (Penelusuran)**: Pencarian cepat pegawai untuk menyajikan statistik akumulatif personal serta lini masa (*timeline*) pemeriksaan kronologis terurut kebawah.
6. **Laporan (Reporting)**: Cetak laporan periode (rekap departemen) atau laporan perorangan dengan visual draf kertas PDF bawaan (`window.print()`) dan integrasi share WhatsApp kustom.
7. **Audit Log (Keamanan)**: Perekaman setiap transaksi manipulasi data (*CREATE, UPDATE, DELETE*), lengkap dengan panel perbandingan JSON sebelum (*Before*) dan sesudah (*After*) perubahan data.
8. **Pengaturan (Settings)**: Konfigurasi nama aplikasi, lokasi default, petugas default, alat default, dan template PDF yang secara dinamis mengisi form pemeriksaan baru.

---

## 📂 Struktur Folder Proyek Frontend

Kami merekomendasikan struktur folder **React (Vite + TypeScript/JavaScript)** berikut untuk diunggah ke repositori GitHub Anda:

```text
frontend/
├── .gitignore               # Mengabaikan node_modules & file sampah build
├── package.json             # Library dependencies (React, Tailwind, Lucide, Recharts)
├── tailwind.config.js       # Konfigurasi utility Tailwind CSS (tema warna biru)
├── vite.config.js           # Konfigurasi build server Vite
├── index.html               # Entry point HTML utama aplikasi
└── src/
    ├── main.jsx             # Titik masuk eksekusi React
    ├── App.jsx              # Komponen pembungkus utama & routing
    ├── index.css            # Styles global Tailwind CSS
    │
    ├── components/          # Reusable UI Components
    │   └── ui/              # Shadcn / Tailwind primitive elements
    │       ├── button.jsx
    │       ├── card.jsx
    │       ├── badge.jsx
    │       ├── input.jsx
    │       ├── label.jsx
    │       └── textarea.jsx
    │
    └── pages/               # Halaman Aplikasi
        └── AlcoholTestApp.jsx  # File utama berisi 1606 baris kode UI MVP terintegrasi
```

---

## 🛠️ Langkah Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan prototipe frontend ini di komputer Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18 ke atas rekomendasi) dan **Git** di komputer Anda.

### 2. Kloning Repositori & Masuk ke Folder
```bash
git clone <URL_REPOSITORI_GITHUB_ANDA>
cd alcohol-test-app/frontend
```

### 3. Instalasi Dependencies
Instal library yang diperlukan (React, Lucide Icons, Tailwind, Shadcn components):
```bash
npm install
```

### 4. Jalankan Server Dev Lokal
```bash
npm run dev
```
Setelah berjalan, buka tautan local host yang tertera di terminal Anda (biasanya `http://localhost:5173`) di browser.

---

## 🎨 Konfigurasi Tema Warna (Tailwind CSS)

Pastikan file `tailwind.config.js` Anda menyertakan konfigurasi palet biru agar konsisten dengan tema aplikasi:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
    },
  },
  plugins: [],
}
```

---

## 📝 Catatan Pengembangan MVP
- Kode halaman utama saat ini menggunakan **state lokal terpadu** (React `useState`) untuk mempermudah simulasi alur data tanpa database aktif.
- Pada fase berikutnya, semua state lokal di `AlcoholTestApp.jsx` akan diganti dengan pemanggilan API (`fetch`/`axios`) yang diarahkan ke file service di folder `src/services/` untuk menghubungkan aplikasi ke backend server RESTful atau Google Apps Script Anda.
