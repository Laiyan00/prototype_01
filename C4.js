// 1. DATA PROYEK & STUDI KASUS
const dataProyek = [
  {
    id: 1,
    judul: "Portofolio Gaya GitHub (v1)",
    kategori: "UI/UX",
    ringkasan: "Desain antarmuka developer dua kolom dengan grafik kontribusi interaktif.",
    teknis: "Menggunakan CSS Grid 2 kolom, palet warna gelap GitHub, dan generasi 104 node DOM via JavaScript.",
    demo: "A1.html",
    repo: "https://github.com"
  },
  {
    id: 2,
    judul: "Kartu Profil Ungu & Toska",
    kategori: "JavaScript",
    ringkasan: "Kartu bio digital dengan animasi melayang dan pertukaran warna gradasi.",
    teknis: "Memanfaatkan CSS Custom Properties dan event listener DOM untuk perubahan tema instan.",
    demo: "A3.html",
    repo: "https://github.com"
  },
  {
    id: 3,
    judul: "Aplikasi Kasir & Stok Web",
    kategori: "Fullstack",
    ringkasan: "Sistem pencatatan transaksi dan manajemen inventaris barang real-time.",
    teknis: "Arsitektur REST API dengan validasi input sisi klien dan penyimpanan data terstruktur.",
    demo: "A2.html",
    repo: "https://github.com"
  },
  {
    id: 4,
    judul: "Kalkulator Interaktif Responsif",
    kategori: "JavaScript",
    ringkasan: "Kalkulator web dengan dukungan tombol keyboard dan riwayat perhitungan.",
    teknis: "Logika parser ekspresi matematika murni tanpa library eksternal.",
    demo: "A1.html",
    repo: "https://github.com"
  }
];

// 2. SISTEM MULTI-BAHASA (INDONESIA & ENGLISH)
const kamus = {
  id: {
    nav_projects: "Proyek", nav_activity: "Aktivitas", nav_contact: "Kontak",
    bio_text: "Membangun aplikasi web yang interaktif, cepat, dan modern dari Magetan, Indonesia.",
    btn_hire: "Hubungi Saya", btn_archive: "Arsip v1", sec_skills: "Keahlian Utama",
    sec_projects: "Proyek & Studi Kasus", sec_activity: "Aktivitas Belajar Coding",
    sec_contact: "Kirim Pesan Langsung", lbl_name: "Nama Anda", lbl_email: "Email Anda",
    lbl_msg: "Pesan Anda", btn_send: "Kirim via Email"
  },
  en: {
    nav_projects: "Projects", nav_activity: "Activity", nav_contact: "Contact",
    bio_text: "Building interactive, fast, and modern web applications from Magetan, Indonesia.",
    btn_hire: "Contact Me", btn_archive: "Archive v1", sec_skills: "Core Skills",
    sec_projects: "Projects & Case Studies", sec_activity: "Coding Learning Activity",
    sec_contact: "Send a Direct Message", lbl_name: "Your Name", lbl_email: "Your Email",
    lbl_msg: "Your Message", btn_send: "Send via Email"
  }
};

let bahasaAktif = localStorage.getItem('lang') || 'id';

function terapkanBahasa(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const kunci = el.getAttribute('data-i18n');
    if (kamus[lang][kunci]) el.textContent = kamus[lang][kunci];
  });
  localStorage.setItem('lang', lang);
}

// 3. RENDER & FILTER PROYEK + MODAL DETAIL
const gridProyek = document.getElementById('gridProyek');
const modalProyek = document.getElementById('modalProyek');

function renderProyek(filter = 'all') {
  gridProyek.innerHTML = '';
  const hasil = filter === 'all' ? dataProyek : dataProyek.filter(p => p.kategori === filter);

  hasil.forEach(item => {
    const kartu = document.createElement('article');
    kartu.className = 'kartu-repo';
    kartu.innerHTML = `
      <div>
        <div class="repo-judul">${item.judul}</div>
        <p class="repo-deskripsi">${item.ringkasan}</p>
      </div>
      <div class="repo-meta">
        <span>🏷️ ${item.kategori}</span>
        <span>Detail studi kasus →</span>
      </div>
    `;
    kartu.addEventListener('click', () => {
      document.getElementById('modalJudul').textContent = item.judul;
      document.getElementById('modalDeskripsi').textContent = item.ringkasan;
      document.getElementById('modalTeknis').textContent = item.teknis;
      document.getElementById('modalDemo').href = item.demo;
      document.getElementById('modalRepo').href = item.repo;
      modalProyek.hidden = false;
    });
    gridProyek.appendChild(kartu);
  });
}

document.getElementById('tutupModal').addEventListener('click', () => modalProyek.hidden = true);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.aktif').classList.remove('aktif');
    btn.classList.add('aktif');
    renderProyek(btn.dataset.filter);
  });
});

// 4. GRAFIK AKTIVITAS BELAJAR (104 KOTAK INTERAKTIF)
const gridKontribusi = document.getElementById('gridKontribusi');
const infoKotak = document.getElementById('infoKotak');

for (let i = 1; i <= 104; i++) {
  const kotak = document.createElement('div');
  const level = Math.floor(Math.random() * 4);
  kotak.className = `kotak lv-${level}`;
  kotak.addEventListener('mouseenter', () => {
    infoKotak.textContent = `Hari ke-${i}: ${level * 2} jam latihan pemrograman`;
  });
  gridKontribusi.appendChild(kotak);
}

// 5. INTEGRASI GITHUB API ASLI
async function muatDataGitHub(username) {
  const wadah = document.getElementById('githubStats');
  try {
    const res = await fetch(`https://github.com{username}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    wadah.innerHTML = `📦 <strong>${data.public_repos}</strong> Repositori · 👥 <strong>${data.followers}</strong> Pengikut`;
  } catch {
    wadah.textContent = '📦 Mode Portofolio Lokal Aktif';
  }
}

// 6. COMMAND PALETTE (Ctrl + K) & TUKAR TEMA
const cmdPalette = document.getElementById('cmdPalette');
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    cmdPalette.hidden = !cmdPalette.hidden;
    if (!cmdPalette.hidden) document.getElementById('cmdInput').focus();
  }
  if (e.key === 'Escape') {
    cmdPalette.hidden = true;
    modalProyek.hidden = true;
  }
});

document.getElementById('btnCmd').addEventListener('click', () => cmdPalette.hidden = false);
document.getElementById('btnTheme').addEventListener('click', tukarTema);
document.getElementById('btnLang').addEventListener('click', () => {
  bahasaAktif = bahasaAktif === 'id' ? 'en' : 'id';
  terapkanBahasa(bahasaAktif);
});

function tukarTema() {
  const saatIni = document.documentElement.getAttribute('data-theme');
  const baru = saatIni === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', baru);
  localStorage.setItem('theme', baru);
}

document.getElementById('cmdList').addEventListener('click', (e) => {
  const aksi = e.target.dataset.action;
  if (aksi === 'projects') location.hash = '#proyek';
  if (aksi === 'activity') location.hash = '#aktivitas';
  if (aksi === 'contact') location.hash = '#kontak';
  if (aksi === 'theme') tukarTema();
  if (aksi === 'lang') { bahasaAktif = bahasaAktif === 'id' ? 'en' : 'id'; terapkanBahasa(bahasaAktif); }
  cmdPalette.hidden = true;
});

// 7. FORMULIR KONTAK AKTIF (LANGSUNG BUKA EMAIL / WHATSAPP TANPA PERLU SERVER)
document.getElementById('formKontak').addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = document.getElementById('namaPengirim').value.trim();
  const email = document.getElementById('emailPengirim').value.trim();
  const pesan = document.getElementById('pesanPengirim').value.trim();
  
  const subjek = encodeURIComponent(`Pesan Portofolio dari ${nama}`);
  const isi = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`);
  window.location.href = `mailto:emailkamu@://example.com{subjek}&body=${isi}`;
  document.getElementById('statusForm').textContent = 'Membuka aplikasi email Anda...';
});

document.getElementById('btnWa').addEventListener('click', () => {
  const nama = document.getElementById('namaPengirim').value.trim() || 'Pengunjung Web';
  const pesan = document.getElementById('pesanPengirim').value.trim() || 'Halo, saya melihat portofolio Anda.';
  const teksWa = encodeURIComponent(`Halo, saya ${nama}. ${pesan}`);
  // Ganti 6281234567890 dengan nomor WhatsApp Anda
  window.open(`https://wa.me{teksWa}`, '_blank');
});

// JALANKAN INISIALISASI
const temaTersimpan = localStorage.getItem('theme');
if (temaTersimpan) document.documentElement.setAttribute('data-theme', temaTersimpan);
terapkanBahasa(bahasaAktif);
renderProyek();
muatDataGitHub('octocat');
