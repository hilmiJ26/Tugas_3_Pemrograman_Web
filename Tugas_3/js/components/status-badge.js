"use strict";

/**
 * Komponen: status-badge
 * Deskripsi: Komponen Vue untuk menampilkan badge status ketersediaan stok
 * berdasarkan perbandingan antara jumlah stok (qty) dan safety stock (safety).
 */
Vue.component("status-badge", {
  // Menghubungkan komponen dengan ID template di file HTML eksternal
  template: "#tpl-badge",

  // Properti yang diterima dari komponen induk (parent)
  props: {
    qty: {
      type: Number,
      required: true,
    },
    safety: {
      type: Number,
      required: true,
    },
  },

  computed: {
    /**
     * Computed property untuk menentukan teks status dan simbol visual
     * - qty === 0      -> Kosong (Merah)
     * - qty < safety   -> Menipis (Orange)
     * - qty >= safety  -> Aman (Hijau)
     */
    statusText() {
      if (this.qty === 0) {
        return "🔴 Kosong";
      } else if (this.qty < this.safety) {
        return "🟠 Menipis";
      } else {
        return "🟢 Aman";
      }
    },

    /**
     * Computed property untuk menentukan kelas CSS pada badge
     * menyesuaikan dengan kondisi stok saat ini.
     */
    badgeClass() {
      if (this.qty === 0) {
        return "badge-danger";
      } else if (this.qty < this.safety) {
        return "badge-warning";
      } else {
        return "badge-success";
      }
    },
  },
});
