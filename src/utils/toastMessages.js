/**
 * Kumpulan pesan toast untuk aplikasi admin panel
 * Semua pesan dalam bahasa Indonesia yang jelas, singkat, dan konsisten
 */

export const TOAST_MESSAGES = {
  SUCCESS: {
    CREATE: "Berhasil menambahkan data",
    UPDATE: "Berhasil memperbarui data",
    DELETE: "Berhasil menghapus data",
    SAVE: "Berhasil menyimpan perubahan",
    LOGIN: "Berhasil masuk ke sistem",
    LOGOUT: "Berhasil keluar dari sistem",
    UPLOAD: "Berhasil mengunggah file",
    PROCESS: "Berhasil memproses transaksi",
  },

  ERROR: {
    CREATE: "Gagal menambahkan data",
    UPDATE: "Gagal memperbarui data",
    DELETE: "Gagal menghapus data",
    NOT_FOUND: "Data tidak ditemukan",
    SERVER: "Terjadi kesalahan pada server",
    CONNECTION: "Koneksi terputus, silakan coba lagi",
    ACCESS_DENIED: "Akses ditolak, Anda tidak memiliki izin",
    VALIDATION: "Validasi gagal, periksa kembali data yang dimasukkan",
  },

  WARNING: {
    DELETE_CONFIRM: "Konfirmasi sebelum menghapus data",
    UNSAVED_CHANGES: "Data belum disimpan",
    LEAVE: "Perubahan akan hilang jika keluar dari halaman",
    IRREVERSIBLE: "Tindakan ini tidak dapat dibatalkan",
  },

  INFO: {
    PROCESSING: "Data sedang diproses",
    NO_DATA: "Tidak ada data yang ditampilkan",
    UNSAVED: "Perubahan belum disimpan",
    INCOMPLETE: "Silakan lengkapi data terlebih dahulu",
  },

  EMPTY: {
    DATA: "Data kosong",
    SEARCH_NOT_FOUND: "Hasil pencarian tidak ditemukan",
    INVALID_FILE: "File tidak valid",
    FILE_TOO_LARGE: "Ukuran file terlalu besar",
  },
}

