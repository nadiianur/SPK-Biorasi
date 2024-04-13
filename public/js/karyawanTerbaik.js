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

    const pegawaiTerbaik = document.getElementById('pegawaiTerbaik')
    console.log(pegawaiTerbaik);
    const today = new Date();

    const currentYear = today.getFullYear();
    try {
        const responsSemuaTerbaik = await fetch('/allPegawaiTerbaik', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const dataSemuaTerbaik = await responsSemuaTerbaik.json();
        if (dataSemuaTerbaik.success) {
            const tableBody = document.querySelector('table tbody')

            tableBody.innerHTML = ''
            dataSemuaTerbaik.data.forEach((terbaik, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', terbaik.id_terbaik);

                const periode = terbaik.periode;
                const periodeAwalBesar = periode.charAt(0).toUpperCase() + periode.slice(1);
                const fotoKaryawan = terbaik.dataKaryawanHasil.foto !== null ? `/images/karyawan/${terbaik.dataKaryawanHasil.foto}` : "/profile.png";

                const createdDate = new Date(terbaik.created_at);
                const formattedDate = createdDate.getFullYear();

                newRow.innerHTML = `
                        <td>${index + 1}</td>
                        <td><img src="${fotoKaryawan}" alt="Foto Profil" style="width: 56%"></td>
                        <td>${terbaik.dataKaryawanHasil.nip_karyawan}</td>
                        <td>${terbaik.dataKaryawanHasil.nama}</td>
                        <td>${terbaik.dataKaryawanHasil.golongan}</td>
                        <td>${terbaik.total_nilai}</td>
                        <td>${periodeAwalBesar} ${formattedDate}</td>
                        
                    `;
                tableBody.appendChild(newRow);
            })
        } else {
            Swal.fire({
                title: dataSemuaTerbaik.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    document.getElementById('pegawaiTerbaik').addEventListener('click', async function () {
        const periode = document.getElementById('periode').value
        console.log(periode);
        try {
            const responsPegawaiTerbaik = await fetch('/pegawaiTerbaik', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    periode: periode
                })
            });
            const dataPegawaiTerbaik = await responsPegawaiTerbaik.json();
            console.log(dataPegawaiTerbaik);
            if (dataPegawaiTerbaik.success) {
                Swal.fire({
                    title: dataPegawaiTerbaik.message,
                    timer: 2000,
                    icon: "success",
                    confirmButtonText: "Oke",
                }).then((result) => {
                    location.reload()
                });
            } else {
                Swal.fire({
                    title: dataPegawaiTerbaik.message,
                    timer: 2000,
                    icon: "error",
                });
            }
        } catch (error) {
            console.error(error);
        }
    })

});