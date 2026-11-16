"use strict";

/**
 * Komponen: app-modal
 * Deskripsi: Komponen pop-up universal untuk menampilkan dialog konfirmasi
 * (seperti konfirmasi penghapusan data bahan ajar) kepada pengguna.
 */
Vue.component("app-modal", {
  template: "#tpl-modal",
  data() {
    return {
      isOpen: false, // Status visibilitas modal (buka/tutup)
      title: "", // Judul pop-up modal
      message: "", // Pesan atau keterangan konfirmasi
      onConfirm: null, // Callback function yang dijalankan jika pengguna menekan "Ya"
    };
  },
  methods: {
    /**
     * Membuka modal dengan menyertakan judul, pesan, dan fungsi aksi konfirmasi.
     */
    show(title, message, callback) {
      this.title = title;
      this.message = message;
      this.onConfirm = callback;
      this.isOpen = true;
    },

    /**
     * Menutup modal tanpa menjalankan aksi.
     */
    closeModal() {
      this.isOpen = false;
      this.title = "";
      this.message = "";
      this.onConfirm = null;
    },

    /**
     * Menjalankan fungsi callback yang dikirimkan saat tombol konfirmasi ditekan.
     */
    confirmAction() {
      if (typeof this.onConfirm === "function") {
        this.onConfirm();
      }
      this.closeModal();
    },
  },
});
