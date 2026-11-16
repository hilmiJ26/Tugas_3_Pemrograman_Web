"use strict";

/**
 * Komponen: order-form
 * Deskripsi: Menangani formulir pemesanan paket bahan ajar dan ekspedisi pengiriman.
 */
Vue.component("order-form", {
  template: "#tpl-order",
  props: {
    paket: {
      type: Array,
      required: true,
    },
    ekspedisiList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedPaket: "",
      selectedEkspedisi: "",
      namaPemesan: "",
      pesanOrder: "",
    };
  },
  methods: {
    formatRupiah(val) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    },
    onPaketSelect() {
      // Logika tambahan saat paket dipilih jika diperlukan
    },
    submitOrder() {
      if (
        !this.selectedPaket ||
        !this.selectedEkspedisi ||
        !this.namaPemesan.trim()
      ) {
        alert("Mohon lengkapi seluruh field pemesanan terlebih dahulu!");
        return;
      }

      const pktInfo = this.paket.find((p) => p.kode === this.selectedPaket);
      this.pesanOrder = `Terima kasih, ${this.namaPemesan.trim()}! Pesanan paket "${pktInfo ? pktInfo.nama : this.selectedPaket}" berhasil dibuat.`;

      // Kirim event ke root jika diperlukan
      this.$emit("created", {
        nama: this.namaPemesan.trim(),
        paket: this.selectedPaket,
        ekspedisi: this.selectedEkspedisi,
      });

      // Reset form
      this.selectedPaket = "";
      this.selectedEkspedisi = "";
      this.namaPemesan = "";

      setTimeout(() => {
        this.pesanOrder = "";
      }, 5000);
    },
  },
});
