// 1. DATA STUDI KASUS PROYEK
const dataProyek = [
  {
    id: 1,
    judul: "Sistem Kasir & Inventaris Cloud",
    kategori: "Fullstack",
    ringkasan: "Aplikasi POS berbasis web dengan sinkronisasi stok real-time.",
    teknis: "Dibangun menggunakan Node.js, PostgreSQL, dan WebSocket untuk pembaruan stok tanpa refresh halaman.",
    demo: "https://example.com",
    repo: "https://github.com"
  },
  {
    id: 2,
    judul: "Generator Kartu Profil Interaktif",
    kategori: "JavaScript",
    ringkasan: "Alat pembuat kartu bio dinamis dengan kustomisasi tema dan ekspor.",
    teknis: "Menggunakan Vanilla JS DOM Manipulation dan CSS Custom Properties untuk performa ringan < 10KB.",
    demo: "https://example.com",
    repo: "https://github.com"
  },
  {
    id: 3,
    judul: "Sistem Desain Komponen UI",
    kategori: "UI/UX",
    ringkasan: "Pustaka komponen antarmuka yang memenuhi standar aksesibilitas WCAG AA.",
    teknis: "Fokus pada kontras warna, navigasi keyboard penuh, dan dukungan screen reader.",
    demo: "https://example.com",
    repo: "https://github.com"
  }
];

// 2. KAMUS MULTI-BAHASA (i18n)
const kamus = {
  id: {
    nav_projects: "Proyek", nav_contact: "Kontak",
    bio_text: "Membangun aplikasi web yang cepat, aksesibel, dan terukur dari Magetan, Indonesia.",
    btn_hire: "Hubungi Saya", btn_cv: "Unduh CV",
    sec_projects: "Proyek & Studi Kasus", sec_contact: "Kirim Pesan Langsung",
    lbl_name: "Nama Anda", lbl_email: "Email Anda", lbl_msg: "Pesan", btn_send: "Kirim Pesan"
  },
  en: {
    nav_projects: "Projects", nav_contact: "Contact",
    bio_text: "Building fast, accessible, and scalable web applications from Magetan, Indonesia.",
    btn_hire: "Contact Me", btn_cv: "Download CV",
    sec_projects: "Projects & Case Studies", sec_contact: "Send a Direct Message",
    lbl_name: "Your Name", lbl_email: "Your Email", lbl_msg: "Message", btn_send: "Send Message"
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
    kartu.tabIndex = 0; // Bisa diakses lewat tombol Tab
    kartu.innerHTML = `
      <div>
        <div class="repo-judul">${item.judul}</div>
        <p class="repo-deskripsi">${item.ringkasan}</p>
      </div>
      <div class="repo-meta">
        <span>🏷️ ${item.kategori}</span>
        <span>Klik untuk studi kasus →</span>
      </div>
    `;
    kartu.addEventListener('click', () => bukaModal(item));
    kartu.addEventListener('keydown', (e) => { if (e.key === 'Enter') bukaModal(item); });
    gridProyek.appendChild(kartu);
  });
}

function bukaModal(proyek) {
  document.getElementById('modalJudul').textContent = proyek.judul;
  document.getElementById('modalDeskripsi').textContent = proyek.ringkasan;
  document.getElementById('modalTeknis').textContent = proyek.teknis;
  document.getElementById('modalDemo').href = proyek.demo;
  document.getElementById('modalRepo').href = proyek.repo;
  modalProyek.hidden = false;
}

document.getElementById('tutupModal').addEventListener('click', () => modalProyek.hidden = true);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.aktif').classList.remove('aktif');
    btn.classList.add('aktif');
    renderProyek(btn.dataset.filter);
  });
});

// 4. INTEGRASI GITHUB API REAL-TIME
async function muatDataGitHub(username) {
  const wadah = document.getElementById('githubStats');
  try {
    const res = await fetch(`https://github.com{username}`);
    if (!res.ok) throw new Error('Gagal memuat profil');
    const data = await res.json();
    wadah.innerHTML = `
      <div>📦 <strong>${data.public_repos}</strong> Repositori Publik</div>
      <div>👥 <strong>${data.followers}</strong> Pengikut di GitHub</div>
    `;
  } catch {
    wadah.textContent = 'Statistik GitHub sedang offline.';
  }
}

// 5. COMMAND PALETTE (Ctrl + K) & TEMA
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
document.getElementById('btnTheme').addEventListener('click', toggleTema);
document.getElementById('btnLang').addEventListener('click', () => {
  bahasaAktif = bahasaAktif === 'id' ? 'en' : 'id';
  terapkanBahasa(bahasaAktif);
});

function toggleTema() {
  const saatIni = document.documentElement.getAttribute('data-theme');
  const baru = saatIni === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', baru);
  localStorage.setItem('theme', baru);
}

document.getElementById('cmdList').addEventListener('click', (e) => {
  const aksi = e.target.dataset.action;
  if (aksi === 'projects') location.hash = '#proyek';
  if (aksi === 'contact') location.hash = '#kontak';
  if (aksi === 'theme') toggleTema();
  if (aksi === 'lang') { bahasaAktif = bahasaAktif === 'id' ? 'en' : 'id'; terapkanBahasa(bahasaAktif); }
  cmdPalette.hidden = true;
});

// 6. PENGIRIMAN FORM KONTAK KE BACKEND API
document.getElementById('formKontak').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('statusForm');
  const honeypot = document.getElementById('honeypot').value;

  // Blokir jika bot mengisi kolom jebakan
  if (honeypot) return;

  const payload = {
    nama: document.getElementById('namaPengirim').value.trim(),
    email: document.getElementById('emailPengirim').value.trim(),
    pesan: document.getElementById('pesanPengirim').value.trim()
  };

  status.textContent = 'Mengirim pesan...';
  try {
    const res = await fetch('http://localhost:3000/api/kontak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const hasil = await res.json();
    status.textContent = hasil.message;
    if (res.ok) e.target.reset();
  } catch {
    status.textContent = 'Gagal terhubung ke server backend.';
  }
});

// Inisialisasi Awal
const temaTersimpan = localStorage.getItem('theme');
if (temaTersimpan) document.documentElement.setAttribute('data-theme', temaTersimpan);
terapkanBahasa(bahasaAktif);
renderProyek();
muatDataGitHub('octocat'); // Ganti 'octocat' dengan username GitHub Anda
