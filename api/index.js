require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// Koneksi ke database TiDB Cloud
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

// Fungsi pembantu mengambil ID dari URL
function dapatkanId(req) {
  if (req.params.id) return req.params.id;
  const bagian = req.url.split('?')[0].split('/');
  return bagian[bagian.length - 1];
}

// Ambil semua data (Read)
app.get('*', (req, res) => {
  const sql = 'SELECT * FROM mahasiswa';
  db.query(sql, (err, hasil) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(hasil);
  });
});

// Tambah data baru (Create)
app.post('*', (req, res) => {
  const nim = req.body.nim;
  const nama = req.body.nama;
  const jurusan = req.body.jurusan;

  const sql = 'INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)';
  db.query(sql, [nim, nama, jurusan], (err, hasil) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send('Data berhasil disimpan');
  });
});

// Ubah data (Update)
app.put('*', (req, res) => {
  const id = dapatkanId(req);
  const nim = req.body.nim;
  const nama = req.body.nama;
  const jurusan = req.body.jurusan;

  const sql = 'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ? WHERE id = ?';
  db.query(sql, [nim, nama, jurusan, id], (err, hasil) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send('Data berhasil diupdate');
  });
});

// Hapus data (Delete)
app.delete('*', (req, res) => {
  const id = dapatkanId(req);
  const sql = 'DELETE FROM mahasiswa WHERE id = ?';
  db.query(sql, [id], (err, hasil) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send('Data berhasil dihapus');
  });
});

module.exports = app;
