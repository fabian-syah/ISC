require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Koneksi ke database TiDB Cloud menggunakan Environment Variables (.env)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'db_kampus',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

// Ambil semua data (Read)
app.get('/mahasiswa', (req, res) => {
  const sql = 'SELECT * FROM mahasiswa';
  db.query(sql, (err, hasil) => {
    if (err) return res.status(500).send(err);
    res.send(hasil);
  });
});

// Tambah data baru (Create)
app.post('/mahasiswa', (req, res) => {
  const nim = req.body.nim;
  const nama = req.body.nama;
  const jurusan = req.body.jurusan;

  const sql = 'INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)';
  db.query(sql, [nim, nama, jurusan], (err, hasil) => {
    if (err) return res.status(500).send(err);
    res.send('Data berhasil disimpan');
  });
});

// Ubah data (Update)
app.put('/mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const nim = req.body.nim;
  const nama = req.body.nama;
  const jurusan = req.body.jurusan;

  const sql = 'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ? WHERE id = ?';
  db.query(sql, [nim, nama, jurusan, id], (err, hasil) => {
    if (err) return res.status(500).send(err);
    res.send('Data berhasil diupdate');
  });
});

// Hapus data (Delete)
app.delete('/mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM mahasiswa WHERE id = ?';
  db.query(sql, [id], (err, hasil) => {
    if (err) return res.status(500).send(err);
    res.send('Data berhasil dihapus');
  });
});

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan port jika di komputer lokal (bukan Vercel)
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

module.exports = app;
