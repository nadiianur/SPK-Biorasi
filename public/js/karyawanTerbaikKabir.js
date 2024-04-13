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

    try {
        const responsSemuaTerbaik = await fetch('/dataPegawaiTerbaik', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const dataSemuaTerbaik = await responsSemuaTerbaik.json();
        if (dataSemuaTerbaik.success) {
            console.log(dataSemuaTerbaik);
            const tableBody = document.querySelector('table tbody')
            tableBody.innerHTML = ''

            dataSemuaTerbaik.data.forEach((terbaik, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', terbaik.id_terbaik);

                const periode = terbaik.periode;
                const periodeAwalBesar = periode.charAt(0).toUpperCase() + periode.slice(1);

                const createdDate = new Date(terbaik.created_at);
                const formattedDate = createdDate.getFullYear();

                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${terbaik.dataKaryawanHasil.nip_karyawan}</td>
                    <td>${terbaik.dataKaryawanHasil.nama}</td>
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

});