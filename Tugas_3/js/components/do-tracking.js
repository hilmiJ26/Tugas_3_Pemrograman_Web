"use strict";

/**
 * Komponen: do-tracking
 * Deskripsi: Mengelola pencarian DO/NIM (via Enter/Esc), penambahan DO baru
 * dengan nomor otomatis, format tanggal lokal, dan riwayat perjalanan.
 */
Vue.component("do-tracking", {
  template: "#tpl-tracking",
  props: {
    trackingData: {
      type: Object,
      required: true,
    },
    pengirimanList: {
      type: Array,
      required: true,
    },
    paketList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchKeyword: "",
      searchResult: null,
      currentFoundDoNumber: "",
      searchedAttempted: false,
      newProgressText: "",

      formDO: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
      },
      selectedPaketDetail: null,
      pesanDO: "",
    };
  },
  computed: {
    nextDoNumber() {
      const currentYear = new Date().getFullYear();
      const keys = Object.keys(this.trackingData);
      const count = keys.length + 1;
      const seq = String(count).padStart(3, "0");
      return `DO${currentYear}-${seq}`;
    },
  },
  methods: {
    formatRupiah(val) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    },
    formatDateLocal(dateStr) {
      // Format tanggal lokal (contoh: 25 Agustus 2025)
      const options = { day: "numeric", month: "long", year: "numeric" };
      const date = new Date(dateStr);
      return isNaN(date) ? dateStr : date.toLocaleDateString("id-ID", options);
    },
    handleSearch() {
      this.searchedAttempted = true;
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) {
        this.searchResult = null;
        return;
      }

      let foundEntry = null;
      let foundKey = "";

      for (const [doNum, data] of Object.entries(this.trackingData)) {
        if (
          doNum.toLowerCase().includes(keyword) ||
          data.nim.toLowerCase().includes(keyword)
        ) {
          foundEntry = data;
          foundKey = doNum;
          break;
        }
      }

      if (foundEntry) {
        this.searchResult = foundEntry;
        this.currentFoundDoNumber = foundKey;
      } else {
        this.searchResult = null;
        this.currentFoundDoNumber = "";
      }
    },
    resetSearch() {
      this.searchKeyword = "";
      this.searchResult = null;
      this.currentFoundDoNumber = "";
      this.searchedAttempted = false;
    },
    onPaketChange() {
      const found = this.paketList.find(
        (p) => p.kode === this.formDO.paketKode,
      );
      this.selectedPaketDetail = found ? found : null;
    },
    addNewDO() {
      if (
        !this.formDO.nim ||
        !this.formDO.nama ||
        !this.formDO.ekspedisi ||
        !this.formDO.paketKode
      ) {
        alert("Mohon lengkapi semua field formulir DO!");
        return;
      }

      const newNo = this.nextDoNumber;
      const pkt = this.selectedPaketDetail;
      const nowIso = new Date().toISOString().split("T")[0];
      const nowTimestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);

      const newData = {
        nim: this.formDO.nim.trim(),
        nama: this.formDO.nama.trim(),
        status: "Dalam Perjalanan",
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: nowIso,
        paket: pkt.kode,
        total: pkt.harga,
        perjalanan: [
          {
            waktu: nowTimestamp,
            keterangan: "Delivery Order berhasil dibuat dan diproses.",
          },
        ],
      };

      // Memasukkan data baru secara reaktif
      this.$set(this.trackingData, newNo, newData);
      this.pesanDO = `Berhasil! Delivery Order baru dengan nomor ${newNo} telah disimpan.`;

      // Reset form
      this.formDO = { nim: "", nama: "", ekspedisi: "", paketKode: "" };
      this.selectedPaketDetail = null;

      setTimeout(() => {
        this.pesanDO = "";
      }, 5000);
    },
    addProgress(doNum) {
      if (!this.newProgressText.trim()) return;
      const nowTimestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);

      if (this.trackingData[doNum]) {
        this.trackingData[doNum].perjalanan.push({
          waktu: nowTimestamp,
          keterangan: this.newProgressText.trim(),
        });
        this.newProgressText = "";
      }
    },
  },
});
