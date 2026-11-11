let semuaMahasiswa = [];

function ambilData() {
  fetch('/mahasiswa')
    .then(res => res.json())
    .then(data => {
      semuaMahasiswa = data;
      let baris = '';

      if (data.length === 0) {
        baris = '<tr><td colspan="5" style="text-align: center;">Belum ada data</td></tr>';
      } else {
        data.forEach((mhs, i) => {
          baris += `
            <tr>
              <td>${i + 1}</td>
              <td>${mhs.nim}</td>
              <td>${mhs.nama}</td>
              <td>${mhs.jurusan}</td>
              <td>
                <button onclick="edit(${mhs.id})">Edit</button>
                <button onclick="hapus(${mhs.id})">Hapus</button>
              </td>
            </tr>
          `;
        });
      }

      document.getElementById('tabel-data').innerHTML = baris;
    });
}

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('id').value;
  const nim = document.getElementById('nim').value;
  const nama = document.getElementById('nama').value;
  const jurusan = document.getElementById('jurusan').value;

  if (id === '') {
    // Tambah data baru
    fetch('/mahasiswa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim, nama, jurusan })
    }).then(() => {
      alert('Data berhasil disimpan');
      batal();
      ambilData();
    });
  } else {
    // Edit data yang sudah ada
    fetch('/mahasiswa/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim, nama, jurusan })
    }).then(() => {
      alert('Data berhasil diupdate');
      batal();
      ambilData();
    });
  }
});

function edit(id) {
  const mhs = semuaMahasiswa.find(item => item.id === id);
  if (mhs) {
    document.getElementById('id').value = mhs.id;
    document.getElementById('nim').value = mhs.nim;
    document.getElementById('nama').value = mhs.nama;
    document.getElementById('jurusan').value = mhs.jurusan;

    document.getElementById('btn-simpan').textContent = 'Update';
    document.getElementById('btn-batal').style.display = 'inline';
  }
}

function hapus(id) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    fetch('/mahasiswa/' + id, {
      method: 'DELETE'
    }).then(() => {
      alert('Data berhasil dihapus');
      ambilData();
    });
  }
}

function batal() {
  document.getElementById('id').value = '';
  document.getElementById('form').reset();
  document.getElementById('btn-simpan').textContent = 'Simpan';
  document.getElementById('btn-batal').style.display = 'none';
}

ambilData();
