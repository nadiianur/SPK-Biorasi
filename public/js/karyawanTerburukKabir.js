document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/logoutBiro', {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Logout berhasil');
                window.location.href = '/loginKabir';
            } else {
                console.error('Logout gagal');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    })

    const pegawaiTerburuk = document.getElementById('pegawaiTerburuk')
    console.log(pegawaiTerburuk);
    const today = new Date();
    const currentYear = today.getFullYear();
    try {
        const responsSemuaTerburuk = await fetch('/allTerburukBiro', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const dataSemuaTerburuk = await responsSemuaTerburuk.json();
        console.log(dataSemuaTerburuk);
        if (dataSemuaTerburuk.success) {
            const tableBody = document.querySelector('table tbody')
            tableBody.innerHTML = ''

            dataSemuaTerburuk.data.forEach((terburuk, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', terburuk.id_terburuk);
                const periode = terburuk.periode;
                const periodeAwalBesar = periode.charAt(0).toUpperCase() + periode.slice(1);
                newRow.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${terburuk.dataKaryawanHasilTerburuk.nip_karyawan}</td>
                            <td>${terburuk.dataKaryawanHasilTerburuk.nama}</td>
                            <td>${periodeAwalBesar} ${terburuk.created_at}</td>
                        `;
                tableBody.appendChild(newRow);
            })
        } else {
            Swal.fire({
                title: dataSemuaTerburuk.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    document.getElementById('pegawaiTerburuk').addEventListener('click', async function () {
        const periode = document.getElementById('periode').value
        console.log(periode);
        try {
            const responsPegawaiTerburuk = await fetch('/pegawaiTerburuk', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    periode: periode
                })
            });
            const dataPegawaiTerburuk = await responsPegawaiTerburuk.json();
            console.log(dataPegawaiTerburuk);
            if (dataPegawaiTerburuk.success) {
                Swal.fire({
                    title: dataPegawaiTerburuk.message,
                    timer: 2000,
                    icon: "success",
                    confirmButtonText: "Oke",
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    }
                });
            } else {
                console.error(dataPegawaiTerburuk.message);
                Swal.fire({
                    title: dataPegawaiTerburuk.message,
                    timer: 2000,
                    icon: "error",
                });
            }
        } catch (error) {
            console.error(error);
        }
    })

});