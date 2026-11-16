"use strict";

/**
 * Root Vue Instance
 * Deskripsi: Menginisialisasi aplikasi utama SITTA UT, mengatur routing tab state,
 * serta memuat data asinkron dari file JSON.
 */
document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    data: {
      tab: "stok", // Tab aktif default ('stok', 'tracking', 'order')
      loading: true, // Status loading data
      upbjjList: [],
      kategoriList: [],
      pengirimanList: [],
      paket: [],
      stok: [],
      tracking: {},
    },
    created() {
      this.loadAppData();
    },
    methods: {
      /**
       * Mengambil data secara asinkron dari file JSON menggunakan ApiService
       */
      async loadAppData() {
        this.loading = true;
        const data = await window.ApiService.fetchAllData();
        if (data) {
          this.upbjjList = data.upbjjList || [];
          this.kategoriList = data.kategoriList || [];
          this.pengirimanList = data.pengirimanList || [];
          this.paket = data.paket || [];
          this.stok = data.stok || [];
          this.tracking = data.tracking || {};
        }
        this.loading = false;
      },
      handleNewOrder(orderData) {
        console.log("Pesanan baru diterima di root:", orderData);
        // Anda dapat menambahkan logika tambahan untuk mencatat pesanan ke tracking jika diperlukan
      },
    },
  });
});
