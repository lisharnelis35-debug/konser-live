// =====================================
// LIVE STREAM MUSIC CONCERT
// COUNTDOWN KONSER
// =====================================

// Tanggal konser: 29 Desember 2026, 19.00 WIB
const WAKTU_KONSER = new Date("2026-12-29T19:00:00+07:00");

// Mengambil elemen countdown dari HTML
const kotak = document.getElementById("countdown");
const elHari = document.getElementById("cd-hari");
const elJam = document.getElementById("cd-jam");
const elMenit = document.getElementById("cd-menit");
const elDetik = document.getElementById("cd-detik");

// Menambahkan angka 0 di depan angka satu digit
function dua(angka) {
  return String(angka).padStart(2, "0");
}

// Fungsi countdown
function perbaruiHitungMundur() {

  if (!kotak) return;

  const sekarang = new Date();
  const selisih = WAKTU_KONSER - sekarang;

  // Jika konser sudah dimulai
  if (selisih <= 0) {
    kotak.innerHTML =
      '<div class="cd-pesan">Konser sudah dimulai!</div>';
    return;
  }

  // Menghitung waktu
  const totalDetik = Math.floor(selisih / 1000);

  const hari = Math.floor(totalDetik / 86400);
  const jam = Math.floor((totalDetik % 86400) / 3600);
  const menit = Math.floor((totalDetik % 3600) / 60);
  const detik = totalDetik % 60;

  // Menampilkan countdown
  if (elHari) elHari.textContent = hari;
  if (elJam) elJam.textContent = dua(jam);
  if (elMenit) elMenit.textContent = dua(menit);
  if (elDetik) elDetik.textContent = dua(detik);
}

// Menjalankan countdown setiap 1 detik
perbaruiHitungMundur();

const pewaktu = setInterval(function () {
  perbaruiHitungMundur();

  if (new Date() >= WAKTU_KONSER) {
    clearInterval(pewaktu);
  }
}, 1000);