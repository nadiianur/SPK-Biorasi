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

    try {
        const responseProfile = await fetch('/dataProfileKabag', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })

        const dataProfile = await responseProfile.json()
        if (dataProfile.success) {
            console.log(dataProfile);
            const h3 = document.getElementById('namaKabag')
            h3.textContent = `${dataProfile.data.nama}`
            document.getElementById('nama').value = dataProfile.data.nama
            document.getElementById('nip').value = dataProfile.data.nip_karyawan
            document.getElementById('email').value = dataProfile.data.email
            document.getElementById('golongan').value = dataProfile.data.golongan
            document.getElementById('jenis_kelamin').value = dataProfile.data.jenis_kelamin
            if (dataProfile.data.foto !== null) {
                document.getElementById('pp').src = `/images/karyawan/${dataProfile.data.foto}`
                console.log("asdasd");
            } else if (dataProfile.data.foto == null) {
                document.getElementById('pp').src = "/profile.png"
            }
        } else {
            Swal.fire({
                title: dataProfile.message,
                timer: 1500,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const file = document.getElementById('fileInput')
        const nama = document.getElementById('nama').value
        const nip = document.getElementById('nip').value
        const email = document.getElementById('email').value
        const golongan = document.getElementById('golongan').value
        const jenis_kelamin = document.getElementById('jenis_kelamin').value
        const password = document.getElementById('password').value
        const newPassword = document.getElementById('newPassword').value

        const formData = new FormData()
        formData.append('file', file.files[0])
        formData.append('nip_karyawan', nip)
        formData.append('nama', nama)
        formData.append('email', email)
        formData.append('golongan', golongan)
        formData.append('jenis_kelamin', jenis_kelamin)
        formData.append('password_lama', password)
        formData.append('password_baru', newPassword)

        const response = await fetch('/updateProfileKabag', {
            method: 'POST',
            // headers: {
            //     'Content-type': 'application/json'
            // },
            body: formData,
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            Swal.fire({
                title: data.message,
                icon: "success",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            })
        } else {
            Swal.fire({
                title: data.message,
                icon: "error"
            });
        }
    })

});