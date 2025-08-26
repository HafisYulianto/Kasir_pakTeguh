let daftarBarang = [];
let totalKeseluruhan = 0;
let editId = null; // Untuk menyimpan id barang yang sedang diedit

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Toast notification
function showToast(msg, color = 'bg-green-600') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = `fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-50 transition-all duration-300 ${color}`;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 1500);
}

function tambahBarang() {
    const nama = document.getElementById('namaBarang').value.trim();
    const harga = parseInt(document.getElementById('hargaBarang').value) || 0;
    const jumlah = parseInt(document.getElementById('jumlahBarang').value) || 0;

    if (!nama || harga <= 0 || jumlah <= 0) {
        showToast('Mohon lengkapi semua field dengan benar!', 'bg-red-600');
        return;
    }

    const subtotal = harga * jumlah;

    // Cek duplikasi nama barang (case-insensitive)
    const idxDuplikat = daftarBarang.findIndex(b => b.nama.toLowerCase() === nama.toLowerCase());
    if (editId === null && idxDuplikat !== -1) {
        // Jika sudah ada, tawarkan tambah jumlah
        if (confirm('Barang sudah ada. Tambah jumlah ke barang yang sama?')) {
            daftarBarang[idxDuplikat].jumlah += jumlah;
            daftarBarang[idxDuplikat].subtotal = daftarBarang[idxDuplikat].harga * daftarBarang[idxDuplikat].jumlah;
            updateTabel();
            clearForm();
            showToast('Jumlah barang ditambahkan');
            return;
        } else {
            return;
        }
    }

    if (editId !== null) {
        // Edit mode
        const idx = daftarBarang.findIndex(b => b.id === editId);
        if (idx !== -1) {
            daftarBarang[idx] = {
                id: editId,
                nama,
                harga,
                jumlah,
                subtotal
            };
        }
        editId = null;
        document.getElementById('btnTambah').textContent = '➕ Tambah Barang';
        document.getElementById('btnBatal').classList.add('hidden');
        showToast('Barang berhasil diubah');
    } else {
        // Tambah mode
        const barang = {
            id: Date.now(),
            nama,
            harga,
            jumlah,
            subtotal
        };
        daftarBarang.push(barang);
        showToast('Barang berhasil ditambahkan');
    }
    updateTabel();
    clearForm();
}

function hapusBarang(id) {
    if (!confirm('Yakin ingin menghapus barang ini?')) return;
    daftarBarang = daftarBarang.filter(barang => barang.id !== id);
    updateTabel();
    showToast('Barang dihapus', 'bg-yellow-600');
}

function editBarang(id) {
    const barang = daftarBarang.find(b => b.id === id);
    if (barang) {
        document.getElementById('namaBarang').value = barang.nama;
        document.getElementById('hargaBarang').value = barang.harga;
        document.getElementById('jumlahBarang').value = barang.jumlah;
        editId = id;
        document.getElementById('btnTambah').textContent = '💾 Simpan Perubahan';
        document.getElementById('btnBatal').classList.remove('hidden');
        document.getElementById('namaBarang').focus();
    }
}

function batalEdit() {
    clearForm();
}

function updateTabel() {
    const tbody = document.getElementById('tabelBarang');

    if (daftarBarang.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    Belum ada barang yang ditambahkan
                </td>
            </tr>
        `;
        totalKeseluruhan = 0;
    } else {
        tbody.innerHTML = daftarBarang.map(barang => `
            <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">${barang.nama}</td>
                <td class="px-4 py-3 text-right text-gray-600">${formatRupiah(barang.harga)}</td>
                <td class="px-4 py-3 text-center text-gray-600">${barang.jumlah}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-800">${formatRupiah(barang.subtotal)}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="editBarang(${barang.id})" class="text-blue-600 hover:text-blue-800 font-medium mr-2">✏️</button>
                    <button onclick="hapusBarang(${barang.id})" class="text-red-600 hover:text-red-800 font-medium">🗑️</button>
                </td>
            </tr>
        `).join('');

        totalKeseluruhan = daftarBarang.reduce((total, barang) => total + barang.subtotal, 0);
    }

    document.getElementById('totalHarga').textContent = formatRupiah(totalKeseluruhan);
}

function clearForm() {
    document.getElementById('namaBarang').value = '';
    document.getElementById('hargaBarang').value = '';
    document.getElementById('jumlahBarang').value = '';
    document.getElementById('namaBarang').focus();
    editId = null;
    document.getElementById('btnTambah').textContent = '➕ Tambah Barang';
    document.getElementById('btnBatal').classList.add('hidden');
}

function cetakNota() {
    if (daftarBarang.length === 0) {
        showToast('Mohon tambahkan minimal satu barang!', 'bg-red-600');
        return;
    }

    // Pembayaran
    const bayar = parseInt(document.getElementById('bayar').value) || 0;
    if (bayar < totalKeseluruhan) {
        showToast('Nominal pembayaran kurang!', 'bg-red-600');
        document.getElementById('bayar').focus();
        return;
    }

    // Data mitra
    const namaMitra = 'Warung Pak Teguh';
    const alamatMitra = 'Jl. Raya Sukamaju No. 88';
    const telpMitra = '0812-5555-7777';

    // Update header nota
    document.getElementById('print-nama-mitra').textContent = namaMitra;
    document.getElementById('print-alamat-mitra').textContent = alamatMitra;
    document.getElementById('print-telp-mitra').textContent = `Telp: ${telpMitra}`;

    // Update tanggal
    const tanggal = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('print-tanggal').textContent = tanggal;

    // Update tabel barang
    const printTabel = document.getElementById('print-tabel-barang');
    printTabel.innerHTML = daftarBarang.map(barang => `
        <tr class="border-b border-gray-200">
            <td class="py-2">${barang.nama}</td>
            <td class="py-2 text-right">${formatRupiah(barang.harga)}</td>
            <td class="py-2 text-center">${barang.jumlah}</td>
            <td class="py-2 text-right">${formatRupiah(barang.subtotal)}</td>
        </tr>
    `).join('');

    // Update total
    document.getElementById('print-total').textContent = formatRupiah(totalKeseluruhan);

    // Update footer
    const kembalian = bayar - totalKeseluruhan;
    document.getElementById('print-footer').textContent = `Terima kasih telah berbelanja di ${namaMitra}. Kembalian: ${formatRupiah(kembalian)}`;

    // Tampilkan nota-print, lalu print, lalu sembunyikan lagi
    const notaPrint = document.getElementById('nota-print');
    notaPrint.classList.remove('hidden');
    setTimeout(() => {
        window.print();
        notaPrint.classList.add('hidden');
        // Reset data setelah print
        daftarBarang = [];
        updateTabel();
        clearForm();
        document.getElementById('bayar').value = '';
        showToast('Transaksi selesai');
    }, 100);
}

// Export ke CSV
function exportCSV() {
    if (daftarBarang.length === 0) {
        showToast('Tidak ada data untuk diexport', 'bg-red-600');
        return;
    }
    let csv = 'Nama Barang,Harga,Jumlah,Subtotal\n';
    daftarBarang.forEach(b => {
        csv += `"${b.nama}",${b.harga},${b.jumlah},${b.subtotal}\n`;
    });
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar-barang.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data diexport ke CSV');
}

// Autofocus
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('namaBarang').focus();
    document.getElementById('btnBatal').classList.add('hidden');
});

// Enter key = tambah barang
document.addEventListener('keypress', e => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        tambahBarang();
    }
});
