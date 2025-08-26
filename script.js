let daftarBarang = [];
let totalKeseluruhan = 0;

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

function tambahBarang() {
    const nama = document.getElementById('namaBarang').value.trim();
    const harga = parseInt(document.getElementById('hargaBarang').value) || 0;
    const jumlah = parseInt(document.getElementById('jumlahBarang').value) || 0;

    if (!nama || harga <= 0 || jumlah <= 0) {
        alert('Mohon lengkapi semua field dengan benar!');
        return;
    }

    const subtotal = harga * jumlah;
    const barang = {
        id: Date.now(),
        nama,
        harga,
        jumlah,
        subtotal
    };

    daftarBarang.push(barang);
    updateTabel();
    clearForm();
}

function hapusBarang(id) {
    daftarBarang = daftarBarang.filter(barang => barang.id !== id);
    updateTabel();
}

function updateTabel() {
    const tbody = document.getElementById('tabelBarang');

    if (daftarBarang.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">
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
}

function cetakNota() {
    if (daftarBarang.length === 0) {
        alert('Mohon tambahkan minimal satu barang!');
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
    document.getElementById('print-footer').textContent = `Terima kasih telah berbelanja di ${namaMitra}`;

    // Print
    window.print();
}

// Autofocus
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('namaBarang').focus();
});

// Enter key = tambah barang
document.addEventListener('keypress', e => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        tambahBarang();
    }
});
