/* Simulasi lokal: tidak memproses pembayaran atau mengirim email. */
(() => {
  const harga = { regular: 100000, premium: 150000 };
  const rupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  const root = document.createElement('div');
  root.className='sim-overlay'; root.hidden=true;
  root.innerHTML=`<div class="sim-panel" role="dialog" aria-modal="true" aria-label="Simulasi pembelian tiket"><div class="sim-head"><h2 id="sim-title">Pembelian tiket</h2><button class="sim-close" type="button" aria-label="Tutup">×</button></div><div id="sim-content"></div></div>`;
  document.body.append(root);
  const content=root.querySelector('#sim-content');
  let order=null;
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function close(){root.hidden=true;document.body.style.overflow=''}
  function open(){root.hidden=false;document.body.style.overflow='hidden'}
  root.querySelector('.sim-close').onclick=close;
  root.addEventListener('click',e=>{if(e.target===root)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close()});
  function form(jenis){
    const namaTiket=jenis==='regular'?'Regular':'Premium';
    root.querySelector('#sim-title').textContent='Pesan Tiket '+namaTiket;
    content.innerHTML=`<span class="sim-badge"></span><div class="sim-summary">${namaTiket} · <strong>${rupiah(harga[jenis])}</strong></div><form id="sim-form"><label>Nama lengkap<input name="nama" required minlength="2" maxlength="80" autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Nomor WhatsApp<input name="wa" type="tel" required pattern="[0-9+ -]{9,18}" placeholder="08xxxxxxxxxx"></label><label>Metode pembayaran<select name="metode" required><option value="">Pilih metode</option><option>QRIS</option><option>DANA</option><option>GoPay</option><option>OVO</option><option>ShopeePay</option><option>BCA Virtual Account</option><option>Mandiri Virtual Account</option><option>BNI Virtual Account</option><option>BRI Virtual Account</option></select></label><button class="sim-main">Lanjut ke pembayaran</button></form><p class="sim-note">Hanya simulasi. Jangan transfer uang ke nomor apa pun.</p>`;
    content.querySelector('form').onsubmit=e=>{
      e.preventDefault(); const d=new FormData(e.target);
      order={jenis,nama:d.get('nama').trim(),email:d.get('email').trim(),wa:d.get('wa').trim(),metode:d.get('metode'),kode:'LMC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()};
      pembayaran();
    };
    open();
  }
  function pembayaran(){
    root.querySelector('#sim-title').textContent='Instruksi Pembayaran';
    const petunjuk=order.metode.includes('Virtual Account')?'Nomor VA : 0000 0000 0000 0000 (BUKAN rekening asli)':'Kode pembayaran : -'+order.kode;
    content.innerHTML=`<span class="sim-badge"></span><div class="sim-summary"><p>Pesanan: <b>${escapeHTML(order.kode)}</b></p><p>Metode: ${escapeHTML(order.metode)}</p><p>Total: <b>${rupiah(harga[order.jenis])}</b></p><p>${escapeHTML(petunjuk)}</p></div><p>Untuk melanjutkan , klik tombol di bawah. .</p><button id="sim-paid" class="sim-main">Pembayaran Berhasil</button>`;
    content.querySelector('#sim-paid').onclick=berhasil;
  }
  function berhasil(){
    root.querySelector('#sim-title').textContent='Pembayaran Berhasil (Simulasi)';
    const date='29 Desember 2026 · 19.00 WIB';
    content.innerHTML=`<span class="sim-badge">pembarayan berhasil</span><div class="sim-ticket" id="sim-ticket"><div style="font-weight:bold;color:#e14d2f">LIVE STREAM MUSIC CONCERT</div><h3>E-TICKET</h3><p><b>${escapeHTML(order.jenis.toUpperCase())}</b></p><hr><p>Nama: <b>${escapeHTML(order.nama)}</b></p><p>Kode: <b>${escapeHTML(order.kode)}</b></p><p>${date}</p><p>Akses: ${order.jenis==='regular'?'YouTube':'LOKET Live'}</p><hr><p style="font-size:11px"></p></div><button id="sim-download" class="sim-main">Unduh E-Ticket (Gambar)</button><p class="sim-note">Tiket hanya muncul di perangkat ini. Tidak dikirim melalui email.</p>`;
    content.querySelector('#sim-download').onclick=unduh;
  }
  function unduh(){
    const c=document.createElement('canvas');c.width=1000;c.height=600;const x=c.getContext('2d');
    x.fillStyle='#0e0b14';x.fillRect(0,0,1000,600);x.fillStyle='#ff5a36';x.fillRect(0,0,22,600);
    x.fillStyle='#ffc933';x.font='bold 34px sans-serif';x.fillText('LIVE STREAM MUSIC CONCERT',60,75);
    x.fillStyle='white';x.font='bold 66px sans-serif';x.fillText('E-TICKET · ',60,170);
    x.font='30px sans-serif';
    const lines=[`Nama: ${order.nama}`,`Kategori: ${order.jenis.toUpperCase()}`,`Kode booking: ${order.kode}`,'29 Desember 2026 · 19.00 WIB',`Akses: ${order.jenis==='regular'?'YouTube':'LOKET Live'}`];
    lines.forEach((s,i)=>x.fillText(s.slice(0,52),60,240+i*55));
    x.fillStyle='#ffc933';x.font='bold 24px sans-serif';x.fillText('SIMULASI — BUKAN TIKET ASLI',60,560);
    const a=document.createElement('a');a.download=`e-ticket--${order.kode}.png`;a.href=c.toDataURL('image/png');a.click();
  }
  // Capture click before the existing landing.js handlers run.
  document.querySelectorAll('.link-bayar').forEach(el=>el.addEventListener('click',e=>{
    e.preventDefault();e.stopImmediatePropagation();form(el.dataset.bayar);
  },true));
})();
