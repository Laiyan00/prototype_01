const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

// Nonfungsional: Keamanan Header HTTP & CORS
app.use(helmet());
app.use(cors({ origin: '*' })); // Saat rilis, ganti '*' dengan domain portofolio Anda
app.use(express.json({ limit: '10kb' })); // Batasi ukuran payload agar aman dari serangan DoS

// Nonfungsional: Rate Limiting (Maksimal 5 pesan per 15 menit per IP)
const pembatasSpam = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Terlalu banyak percobaan. Silakan coba lagi 15 menit kemudian.' }
});

// Fungsi sanitasi sederhana mencegah injeksi HTML/XSS
function bersihkanTeks(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// Endpoint API Kontak
app.post('/api/kontak', pembatasSpam, (req, res) => {
  const { nama, email, pesan } = req.body;

  // Validasi sisi server
  if (!nama || !email || !pesan || !email.includes('@')) {
    return res.status(400).json({ message: 'Data formulir tidak valid.' });
  }

  const dataAman = {
    nama: bersihkanTeks(nama),
    email: bersihkanTeks(email),
    pesan: bersihkanTeks(pesan),
    waktu: new Date().toISOString()
  };

  // Di tahap produksi, hubungkan ke layanan email (Nodemailer / Resend) atau Database (PostgreSQL)
  console.log('Pesan baru diterima:', dataAman);

  res.status(200).json({ message: 'Terima kasih! Pesan Anda berhasil dikirim.' });
});

app.listen(PORT, () => {
  console.log(`Server portofolio berjalan di http://localhost:${PORT}`);
});
