document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/logoutAdmin', {
                method: 'DELETE' // Atau sesuaikan dengan metode yang Anda gunakan
            });
            if (response.ok) {
                // Handle jika logout berhasil
                console.log('Logout berhasil');
                // Redirect ke halaman lain jika diperlukan
                window.location.href = '/loginAdmin';
            } else {
                // Handle jika logout gagal
                console.error('Logout gagal');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    })
    const akumulasiPenilaian = document.getElementById('akumulasiPenilaian')
    document.getElementById('akumulasiPenilaian').addEventListener('click', async function () {
        const bulanPenilaian = document.getElementById('bulanPenilaian').value
        console.log(bulanPenilaian);
        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            showConfirmButton: false,
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://sweetalert2.github.io/images/nyan-cat.gif")
                left top
                no-repeat
            `,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });
        
        try {
            const responsAkumulasiPenilaian = await fetch('/akumulasiNilai', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    periode: bulanPenilaian
                })
            });
            const dataAkumulasiPenilaian = await responsAkumulasiPenilaian.json();
            if (dataAkumulasiPenilaian.success) {
                Swal.close();
                Swal.fire({
                    title: dataAkumulasiPenilaian.message,
                    timer: 1500,
                    icon: "success"
                })
                const tableBody = document.querySelector('table tbody')

                tableBody.innerHTML = ''

                dataAkumulasiPenilaian.data.forEach((penilaian, index) => {
                    const newRow = document.createElement('tr');

                    // Set the data-id attribute with the criteria id
                    newRow.setAttribute('data-id', penilaian.id_penilaian);

                    newRow.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${penilaian.dataDetailGeneratePenilaian.dataKaryawan.nip_karyawan}</td>
                            <td>${penilaian.dataDetailGeneratePenilaian.dataKaryawan.nama}</td>
                            <td>${penilaian.dataDetailGeneratePenilaian.dataKaryawan.golongan}</td>
                            <td>${penilaian.nilai_akhir}</td>
                            
                        `;

                    // Tambahkan baris baru ke dalam tabel
                    tableBody.appendChild(newRow);
                })
            } else {
                Swal.close();
                Swal.fire({
                    title: dataAkumulasiPenilaian.message,
                    timer: 1500,
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.close();
            console.error(error);
        }
    })

});