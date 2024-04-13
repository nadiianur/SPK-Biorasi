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

    try {
        const responseProfile = await fetch('/dataProfileAdmin', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataProfile = await responseProfile.json()
        if (dataProfile.success) {
            console.log(dataProfile);
            const h3 = document.getElementById('namaAdmin')
            h3.textContent = `${dataProfile.data.username}`
            document.getElementById('username').value = dataProfile.data.username
            document.getElementById('nama').value = dataProfile.data.nama
            document.getElementById('nip').value = dataProfile.data.nip_admin
            document.getElementById('email').value = dataProfile.data.email
            document.getElementById('golongan').value = dataProfile.data.golongan
            document.getElementById('jenis_kelamin').value = dataProfile.data.jenis_kelamin
            if (dataProfile.data.foto !== null) {
                document.getElementById('pp').src=`/images/admin/${dataProfile.data.foto}`
                console.log("asdasd");
            } else if (dataProfile.data.foto === null) {
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
        const username = document.getElementById('username').value
        const nama = document.getElementById('nama').value
        const nip = document.getElementById('nip').value
        const email = document.getElementById('email').value
        const golongan = document.getElementById('golongan').value
        const jenis_kelamin = document.getElementById('jenis_kelamin').value
        const password = document.getElementById('password').value
        const newPassword = document.getElementById('newPassword').value

        const formData = new FormData()
        formData.append('file', file.files[0])
        formData.append('username', username)
        formData.append('nama', nama)
        formData.append('nip_admin', nip)
        formData.append('email', email)
        formData.append('golongan', golongan)
        formData.append('jenis_kelamin', jenis_kelamin)
        formData.append('password_lama', password)
        formData.append('password_baru', newPassword)

        const response = await fetch('/updateProfileAdmin', {
            method: 'POST',
            // headers: {
            //     'Content-type': 'application/json'
            // },
            body: formData,
        });

        const data = await response.json();
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
        }else{
            Swal.fire({
                title: data.message,
                icon: "error"
            });
        }
    })

});