const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// koneksi ke database MySQL via Laragon
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_kampus'
});

db.connect((err) => {
  if (err) {
    console.log('Gagal konek ke database:', err.message);
  } else {
    console.log('Berhasil konek ke MySQL Laragon');
  }
});

// ambil semua data (Read)
app.get('/mahasiswa', (req, res) => {
  const sql = 'SELECT * FROM mahasiswa';
  db.query(sql, (err, hasil) => {
    if (err) throw err;
    res.send(hasil);
  });
});

// tambah data baru (Create)
app.post('/mahasiswa', (req, res) => {
  const nim = req.body.nim;
  const nama = req.body.nama;
  const jurusan = req.body.jurusan;

  const sql = 'INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)';
  db.query(sql, [nim, nama, jurusan], (err, hasil) => {
    if (err) throw err;
    res.send('Data berhasil disimpan');
  });
});

// ubah data (Update)
app.put('/mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const nim = req.body.nim;
  const nama = req.body.nama;
  const jurusan = req.body.jurusan;

  const sql = 'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ? WHERE id = ?';
  db.query(sql, [nim, nama, jurusan, id], (err, hasil) => {
    if (err) throw err;
    res.send('Data berhasil diupdate');
  });
});

// hapus data (Delete)
app.delete('/mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM mahasiswa WHERE id = ?';
  db.query(sql, [id], (err, hasil) => {
    if (err) throw err;
    res.send('Data berhasil dihapus');
  });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
