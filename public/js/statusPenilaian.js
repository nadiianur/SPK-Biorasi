document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/logoutAdmin', {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Logout berhasil');
                window.location.href = '/loginAdmin';
            } else {
                console.error('Logout gagal');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    })
    const bulanPenilaianSelect = document.getElementById('bulanPenilaian');
    const tableBody = document.querySelector('table tbody');

    bulanPenilaianSelect.addEventListener('change', async () => {
        const periode = bulanPenilaianSelect.value;
        try {
            const response = await fetch('/statusPenilaian', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    periode: periode
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    Swal.fire({
                        title: data.message,
                        timer: 2000,
                        icon: "success",
                        confirmButtonText: "Oke",
                    }).then((result) => {
                        tableBody.innerHTML = ''; // Kosongkan isi tabel
                        data.data.forEach((pegawai, index) => {
                            const row = `<tr>
                            <td>${index + 1}</td>
                            <td>${pegawai.nip_karyawan}</td>
                            <td>${pegawai.nama}</td>
                            <td>
                            <button type="button" class="btn btn-primary" style="background-color: #FC9F9F; border-color: #FC9F9F; border-radius: 100px; font-size: smaller;" disabled>Belum Selesai</button>
                            </td>
                        </tr>`;
                            tableBody.innerHTML += row;
                        });
                    });
                } else {
                    Swal.fire({
                        title: data.message,
                        timer: 2000,
                        icon: "error",
                    });
                }
            } else {
                Swal.fire({
                    title: 'Semua Penilaian Telah Selesai Dilakukan',
                    icon: 'error'
                }).then((result) => {
                    location.reload()
                });;
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });

});