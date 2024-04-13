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

    //total data pegawai
    try {
        const responsTotalDataPegawai = await fetch('/totalDataPegawai', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataTotalDataPegawai = await responsTotalDataPegawai.json()
        if (dataTotalDataPegawai.success) {
            const h1 = document.getElementById('totalDataPegawai')
            h1.textContent = `${dataTotalDataPegawai.total}`
            console.log(dataTotalDataPegawai.total);
        } else {
            Swal.fire({
                title: dataTotalDataPegawai.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    // total data penilaian
    try {
        const responsTotalDataPenilaian = await fetch('/totalDataPenilaian', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataTotalDataPenilaian = await responsTotalDataPenilaian.json()
        if (dataTotalDataPenilaian.success) {
            const h1 = document.getElementById('totalDataPenilaian')
            h1.textContent = `${dataTotalDataPenilaian.total}`
        } else {
            Swal.fire({
                title: dataTotalDataPenilaian.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    // nama Pegawai terbaik
    try {
        const responsNamaPegawaiTerbaik = await fetch('/namaPegawaiTerbaik', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataNamaPegawaiTerbaik = await responsNamaPegawaiTerbaik.json()
        if (dataNamaPegawaiTerbaik.success) {
            console.log(dataNamaPegawaiTerbaik.data.dataKaryawanHasil.nama);
            const h2 = document.getElementById('namaPegawaiTerbaik')
            const span = document.getElementById('nama')
            span.textContent = `${dataNamaPegawaiTerbaik.data.dataKaryawanHasil.nama}`
            h2.textContent = `${dataNamaPegawaiTerbaik.data.dataKaryawanHasil.nama}`
            if (dataNamaPegawaiTerbaik.data.dataKaryawanHasil.foto !== null) {
                document.getElementById('pp').src=`/images/karyawan/${dataNamaPegawaiTerbaik.data.dataKaryawanHasil.foto}`
            } else if (dataNamaPegawaiTerbaik.data.dataKaryawanHasil.foto === null) {
                document.getElementById('pp').src = "/profile.png"
            }

        } else {
            Swal.fire({
                title: dataNamaPegawaiTerbaik.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    // total data pegawai terbaik
    try {
        const responsTotalPegawaiTerbaik = await fetch('/totalPegawaiTerbaik', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataTotalPegawaiTerbaik = await responsTotalPegawaiTerbaik.json()
        if (dataTotalPegawaiTerbaik.success) {
            console.log(dataTotalPegawaiTerbaik.total);
            const h1 = document.getElementById('totalPegawaiTerbaik')
            h1.textContent = `${dataTotalPegawaiTerbaik.total}`
        } else {
            Swal.fire({
                title: dataTotalPegawaiTerbaik.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

});