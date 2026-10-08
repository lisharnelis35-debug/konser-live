// ====== PENGATURAN ======
// Waktu mulai konser (WIB = +07:00)
const WAKTU_KONSER = new Date("2026-12-29T19:00:00+07:00");

// Tempel payment link dari Midtrans / Xendit / Mayar / LOKET di sini.
// Selama masih berisi kata "example", link tidak dibuka.
const LINK_BAYAR = {
  regular: "https://link-pembayaran-regular.example",
  premium: "https://link-pembayaran-premium.example"
};


document.querySelectorAll(".link-bayar").forEach(function (tombol) {
  const link = LINK_BAYAR[tombol.dataset.bayar];
  if (link && !link.includes("example")) {
    tombol.href = link;
    tombol.target = "_blank";
    tombol.rel = "noopener";
  }
});


const kotak = document.getElementById("countdown");
const elHari = document.getElementById("cd-hari");
const elJam = document.getElementById("cd-jam");
const elMenit = document.getElementById("cd-menit");
const elDetik = document.getElementById("cd-detik");

function dua(angka) {
  return String(angka).padStart(2, "0");
}

function perbaruiHitungMundur() {
  const selisih = WAKTU_KONSER - new Date();

  if (selisih <= 0) {
    kotak.innerHTML = '<div class="cd-pesan">Konser sudah dimulai!</div>';
    clearInterval(pewaktu);
    return;
  }

  const totalDetik = Math.floor(selisih / 1000);
  elHari.textContent = Math.floor(totalDetik / 86400);
  elJam.textContent = dua(Math.floor((totalDetik % 86400) / 3600));
  elMenit.textContent = dua(Math.floor((totalDetik % 3600) / 60));
  elDetik.textContent = dua(totalDetik % 60);
}

const pewaktu = setInterval(perbaruiHitungMundur, 1000);
perbaruiHitungMundur();

(function () {
  const tiket = {
    regular: { nama: "Regular", harga: 100000 },
    premium: { nama: "Premium", harga: 150000 }
  };
  const rupiah = function (n) { return "Rp " + n.toLocaleString("id-ID"); };

  const modal = document.getElementById("modal-bayar");
  if (!modal) {
    console.error("Elemen #modal-bayar tidak ditemukan di HTML");
    return;
  }

  const email = document.getElementById("mb-email");
  const tombolBayar = document.getElementById("mb-bayar");
  let pilihan = null;

  function cek() {
    const metode = modal.querySelector('input[name="metode"]:checked');
    tombolBayar.disabled = !(metode && email.value && email.checkValidity());
  }

  function buka(jenis) {
    pilihan = tiket[jenis];
    document.getElementById("mb-nama").textContent = pilihan.nama;
    document.getElementById("mb-harga").textContent = rupiah(pilihan.harga);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    cek();
  }

  function tutup() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".link-bayar").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      buka(el.dataset.bayar);
    }, true);
  });

  document.getElementById("mb-tutup").addEventListener("click", tutup);
  modal.addEventListener("click", function (e) { if (e.target === modal) tutup(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) tutup();
  });
  modal.addEventListener("change", cek);
  email.addEventListener("input", cek);


  tombolBayar.addEventListener("click", function () {
    const metode = modal.querySelector('input[name="metode"]:checked').value;
    const link = LINK_BAYAR[pilihan.nama.toLowerCase()];

    console.log({ tiket: pilihan.nama, harga: pilihan.harga, metode: metode, email: email.value });

    if (link && !link.includes("example")) {
      window.open(link, "_blank", "noopener");
    } else {
      alert("Pesanan " + pilihan.nama + " via " + metode + " dicatat. Link pembayaran belum dipasang.");
    }
    tutup();
  });
})();