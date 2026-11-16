"use strict";

/**
 * Komponen: stock-table
 * Deskripsi: Menampilkan daftar stok bahan ajar, filter dependent, sort,
 * formatting harga & satuan buah, edit/tambah dengan Enter, serta integrasi modal hapus.
 */
Vue.component("stock-table", {
  template: "#tpl-stock",
  props: {
    stokData: {
      type: Array,
      required: true,
    },
    upbjjList: {
      type: Array,
      required: true,
    },
    kategoriList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedUpbjj: "",
      selectedKategori: "",
      filterReorderType: "",
      sortBy: "",

      editIndex: null,
      editForm: { qty: 0 },

      formNew: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      },
      errors: {},
      pesanFeedback: "",
      pesanClass: "",
    };
  },
  computed: {
    /**
     * Computed property untuk menyaring dan mengurutkan data stok
     * tanpa recompute berlebihan di luar perubahan state filter/sort.
     */
    filteredStok() {
      let result = this.stokData;

      if (this.selectedUpbjj) {
        result = result.filter((item) => item.upbjj === this.selectedUpbjj);
      }

      if (this.selectedKategori) {
        result = result.filter(
          (item) => item.kategori === this.selectedKategori,
        );
      }

      if (this.filterReorderType === "menipis") {
        result = result.filter(
          (item) => item.qty < item.safety && item.qty > 0,
        );
      } else if (this.filterReorderType === "kosong") {
        result = result.filter((item) => item.qty === 0);
      }

      if (this.sortBy === "judul") {
        result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (this.sortBy === "qty") {
        result = result.slice().sort((a, b) => a.qty - b.qty);
      } else if (this.sortBy === "harga") {
        result = result.slice().sort((a, b) => a.harga - b.harga);
      }

      return result;
    },
  },
  watch: {
    /**
     * Watcher 1: Memantau perubahan pada pilihan UT-Daerah (selectedUpbjj)
     * untuk menerapkan dependent options (mereset kategori jika daerah berubah).
     */
    selectedUpbjj(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedKategori = "";
      }
    },

    /**
     * Watcher 2: Memantau perubahan pada filter re-order untuk memberikan log/notifikasi konsol.
     */
    filterReorderType(newVal) {
      if (newVal) {
        console.log(`Filter re-order aktif: ${newVal}`);
      }
    },
  },
  methods: {
    onUpbjjChange() {
      this.selectedKategori = "";
    },
    resetFilter() {
      this.selectedUpbjj = "";
      this.selectedKategori = "";
      this.filterReorderType = "";
      this.sortBy = "";
    },
    formatRupiah(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(value);
    },
    getCatatanPlain(htmlStr) {
      // Mengubah string HTML menjadi teks biasa untuk keperluan tooltip hover
      const temp = document.createElement("div");
      temp.innerHTML = htmlStr;
      return temp.textContent || temp.innerText || "";
    },
    startEdit(index, item) {
      this.editIndex = index;
      this.editForm.qty = item.qty;
    },
    cancelEdit() {
      this.editIndex = null;
    },
    saveEdit(index) {
      const targetItem = this.filteredStok[index];
      const originalIndex = this.stokData.findIndex(
        (s) => s.kode === targetItem.kode,
      );

      if (originalIndex !== -1) {
        this.stokData[originalIndex].qty = this.editForm.qty;
      }
      this.editIndex = null;
    },
    addBahanAjar() {
      this.errors = {};
      let isValid = true;

      if (!this.formNew.kode.trim()) {
        this.errors.kode = "Kode kosong.";
        isValid = false;
      }
      if (!this.formNew.judul.trim()) {
        this.errors.judul = "Judul kosong.";
        isValid = false;
      }
      if (!this.formNew.kategori) {
        this.errors.kategori = "Pilih kategori.";
        isValid = false;
      }
      if (!this.formNew.upbjj) {
        this.errors.upbjj = "Pilih UT-Daerah.";
        isValid = false;
      }

      if (!isValid) {
        this.pesanFeedback = "Mohon lengkapi data wajib.";
        this.pesanClass = "pesan-error";
        return;
      }

      this.stokData.push({
        kode: this.formNew.kode.trim(),
        judul: this.formNew.judul.trim(),
        kategori: this.formNew.kategori,
        upbjj: this.formNew.upbjj,
        lokasiRak: this.formNew.lokasiRak.trim() || "R1-01",
        harga: Number(this.formNew.harga),
        qty: Number(this.formNew.qty),
        safety: Number(this.formNew.safety),
        catatanHTML: this.formNew.catatanHTML
          ? this.formNew.catatanHTML
          : "<em>Baru ditambahkan</em>",
      });

      this.formNew = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      };
      this.pesanFeedback = "Bahan ajar berhasil ditambahkan!";
      this.pesanClass = "pesan-sukses";

      setTimeout(() => {
        this.pesanFeedback = "";
      }, 4000);
    },
    confirmDelete(item) {
      // Memanggil modal global yang ada di root app
      if (this.$root.$refs.modal) {
        this.$root.$refs.modal.show(
          "Konfirmasi Hapus",
          `Apakah Anda yakin ingin menghapus bahan ajar "${item.judul}" (${item.kode})?`,
          () => {
            const idx = this.stokData.findIndex((s) => s.kode === item.kode);
            if (idx !== -1) {
              this.stokData.splice(idx, 1);
            }
          },
        );
      }
    },
  },
});
