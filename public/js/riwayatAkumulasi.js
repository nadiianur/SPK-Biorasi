document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/logoutKabag', {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Logout berhasil');
                window.location.href = '/loginKabag';
            } else {
                console.error('Logout gagal');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    })

    var selectTahun = document.getElementById("tahun");
    selectTahun.innerHTML = '';

    var tahunSaatIni = new Date().getFullYear();
    var jumlahTahun = 10;
    var pilihTahunOption = document.createElement("option");
    pilihTahunOption.value = '';
    pilihTahunOption.textContent = 'Pilih Tahun';
    selectTahun.appendChild(pilihTahunOption);

    for (var i = 0; i < jumlahTahun; i++) {
        var option = document.createElement("option");
        var tahun = tahunSaatIni - i;
        option.text = tahun;
        option.value = tahun;
        selectTahun.appendChild(option);
    }

    const sendRiwayat = document.getElementById('sendRiwayat')
    sendRiwayat.addEventListener('click', async function () {
        const periode = document.getElementById('bulan').value
        const tahun = document.getElementById('tahun').value

        const responseRiwayatAkumulasi = await fetch('riwayatPenilaianKabag', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                periode: periode,
                tahun: tahun
            })
        })

        const dataRiwayatAkumulasi = await responseRiwayatAkumulasi.json()
        console.log(dataRiwayatAkumulasi);
        if (dataRiwayatAkumulasi.success) {
            Swal.fire({
                title: dataRiwayatAkumulasi.message,
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            });
            const tableBody = document.querySelector('table tbody')
            tableBody.innerHTML = ''

            dataRiwayatAkumulasi.data.forEach((riwayat, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', riwayat.id_riwayat);

                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${riwayat.dataDetailGeneratePenilaian.dataKaryawan.nip_karyawan}</td>
                    <td>${riwayat.dataDetailGeneratePenilaian.dataKaryawan.nama}</td>
                    <td>${riwayat.dataDetailGeneratePenilaian.dataKaryawan.golongan}</td>
                    <td>${riwayat.nilai_rata_rata}</td>
                    <td>${periode} ${tahun}</td>
                `;
                tableBody.appendChild(newRow);
            })
        } else {
            Swal.fire({
                title: dataRiwayatAkumulasi.message,
                timer: 2000,
                icon: "error",
                timerProgressBar: true
            });
        }
    })

});