# SITTA UT - Sistem Informasi Bahan Ajar Universitas Terbuka
> Tugas Praktik 3 - Pemrograman Berbasis Web (STSI4209)

Aplikasi web modular berbasis **Vue.js 2** untuk pengelolaan stok bahan ajar, pelacakan pengiriman (*Delivery Order*), dan pemesanan paket mata kuliah di lingkungan Universitas Terbuka (UT).

---

## 🚀 Fitur Utama

1. **Arsitektur Komponen Modular (Kebab-Case)**:
   - `<status-badge>`: Indikator status ketersediaan stok secara dinamis (*Aman, Menipis, Kosong*).
   - `<app-modal>`: Pop-up universal untuk dialog konfirmasi tindakan (seperti hapus data stok).
   - `<stock-table>`: Tabel data lengkap dengan fitur pencarian, filter *dependent* (UT-Daerah & Kategori), filter re-order, *sorting*, serta *tooltip* catatan.
   - `<do-tracking>`: Pelacakan status pengiriman berdasarkan Nomor DO atau NIM dengan riwayat progres perjalanan.
   - `<order-form>`: Formulir pemesanan paket bahan ajar dan pemilihan ekspedisi.

2. **Manajemen Data Asinkron & Fallback**:
   - Menggunakan layanan `ApiService` untuk memuat data dari file JSON eksternal (`data/dataBahanAjar.json`) dengan mekanisme pengamanan (*fallback*) agar aplikasi tetap berjalan stabil.

3. **Interaksi & *Event Handling***:
   - Dukungan tombol **Enter** untuk mempercepat proses input/pencarian data.
   - Dukungan tombol **Esc** untuk mereset filter atau pencarian secara cepat.
   - Format mata uang Rupiah (`IDR`) dan tanggal lokal Indonesia yang rapi.

---

## 🛠️ Struktur Proyek

```text
tugas3-vue-ut/
│
├── index.html                  # File utama aplikasi & template komponen
├── README.md                   # Dokumentasi proyek
├── assets/
│   └── css/
│       └── style.css           # Stylesheet konsisten (Tugas 1, 2, & 3)
├── data/
│   └── dataBahanAjar.json      # Sumber data utama aplikasi (JSON)
└── js/
    ├── app.js                  # Inisialisasi Root Vue Instance & State Management
    ├── components/
    │   ├── status-badge.js     # Logika komponen badge status
    │   ├── app-modal.js        # Logika komponen modal konfirmasi
    │   ├── stock-table.js      # Logika tabel stok, filter, sort, & edit
    │   ├── do-tracking.js      # Logika pelacakan & penambahan DO
    │   └── order-form.js       # Logika formulir pemesanan
    └── services/
        └── api.js              # Layanan pengambilan data (API Service)
