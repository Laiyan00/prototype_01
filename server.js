const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/kontak', (req, res) => {
  const { nama, email, pesan } = req.body;
  if (!nama || !email || !pesan) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
  }
  console.log('Pesan diterima:', { nama, email, pesan });
  res.status(200).json({ message: 'Pesan berhasil diterima server!' });
});

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));
