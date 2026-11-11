require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// Koneksi ke database TiDB Cloud via Environment Variables
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

// Penanganan seluruh request CRUD mahasiswa
app.use((req, res, next) => {
  if (req.method === 'GET') {
    // 1. Ambil semua data (Read)
    const sql = 'SELECT * FROM mahasiswa';
    db.query(sql, (err, hasil) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(hasil);
    });
  } else if (req.method === 'POST') {
    // 2. Tambah data baru (Create)
    const { nim, nama, jurusan } = req.body;
    const sql = 'INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)';
    db.query(sql, [nim, nama, jurusan], (err, hasil) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send('Data berhasil disimpan');
    });
  } else if (req.method === 'PUT') {
    // 3. Ubah data (Update)
    const parts = req.url.split('?')[0].split('/');
    const id = parts[parts.length - 1];
    const { nim, nama, jurusan } = req.body;
    const sql = 'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ? WHERE id = ?';
    db.query(sql, [nim, nama, jurusan, id], (err, hasil) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send('Data berhasil diupdate');
    });
  } else if (req.method === 'DELETE') {
    // 4. Hapus data (Delete)
    const parts = req.url.split('?')[0].split('/');
    const id = parts[parts.length - 1];
    const sql = 'DELETE FROM mahasiswa WHERE id = ?';
    db.query(sql, [id], (err, hasil) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send('Data berhasil dihapus');
    });
  } else {
    next();
  }
});

module.exports = app;
