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
        const responsdataKaryawan = await fetch('/dataKaryawan', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const dataKaryawan = await responsdataKaryawan.json();
        if (dataKaryawan.success) {
            const tableBody = document.querySelector('table tbody');
            console.log("indonesia", dataKaryawan);

            tableBody.innerHTML = '';

            dataKaryawan.data.forEach((karyawan, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', karyawan.id_karyawan);
                newRow.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${karyawan.nip_karyawan}</td>
                            <td>${karyawan.nama}</td>
                            <td>${karyawan.dataBagian.nama_bagian}</td>
                            <td>${karyawan.golongan}</td>
                            <td>${karyawan.jabatan}</td>
                            <td>${karyawan.jenis_kelamin}</td>
                            <td>
                                <button type="button" class="btn btn-warning" style="color: white;font-size:13px;  border-radius: 30px; vertical-align: middle; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);" id_karyawan=${karyawan.id_karyawan}>
                                    Edit
                                </button>
                                &nbsp;
                                <button type="button" class="btn btn-danger delete-btn" style="border-radius: 30px; font-size:13px; vertical-align: middle; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);" id_karyawan=${karyawan.id_karyawan}>
                                    Hapus
                                </button>
                            </td>
                        `;
                tableBody.appendChild(newRow);
            });

            const editButtons = document.querySelectorAll('button.btn-warning');
            editButtons.forEach((editButton) => {
                editButton.addEventListener('click', function () {

                    const id_karyawan = editButton.getAttribute('id_karyawan');
                    const karyawan = dataKaryawan.data.find((k) => k.id_karyawan === id_karyawan);

                    document.getElementById('namaEdit').value = karyawan.nama;
                    // document.getElementById('nipEdit').value = karyawan.nip_karyawan;
                    document.getElementById('bagianEdit').value = karyawan.dataBagian.id_bagian;
                    document.getElementById('golonganEdit').value = karyawan.golongan;
                    document.getElementById('jabatanEdit').value = karyawan.jabatan;
                    document.getElementById('jenis_kelaminEdit').value = karyawan.jenis_kelamin;
                    document.getElementById('roleEdit').value = karyawan.role;
                    document.getElementById('emailEdit').value = karyawan.email;
                    console.log(id_karyawan);

                    // Menampilkan modal edit
                    const modal = new bootstrap.Modal(document.getElementById('modalEditKaryawan'));
                    modal.show();
                    const simpanPerubahanBtn = document.getElementById('editKaryawan')
                    console.log("pp", simpanPerubahanBtn);
                    document.getElementById('editKaryawan').addEventListener('click', async function () {
                        const nama = document.getElementById('namaEdit').value
                        const nip = document.getElementById('nipEdit').value
                        const bagian = document.getElementById('bagianEdit').value
                        const golongan = document.getElementById('golonganEdit').value
                        const jabatan = document.getElementById('jabatanEdit').value
                        const role = document.getElementById('roleEdit').value
                        const jenis_kelamin = document.getElementById('jenis_kelaminEdit').value
                        const email = document.getElementById('emailEdit').value
                        const password = document.getElementById('passwordEdit').value
                        try {
                            const response = await fetch(`/editKaryawan/${id_karyawan}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    nama: nama,
                                    nip_karyawan: nip,
                                    jabatan: jabatan,
                                    jenis_kelamin: jenis_kelamin,
                                    email: email,
                                    password: password,
                                    role: role,
                                    golongan: golongan,
                                    bagian: bagian
                                }),
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
                                console.log('Data berhasil disimpan:', data);
                            } else {
                                Swal.fire({
                                    title: data.message,
                                    timer: 1500,
                                    icon: "error"
                                });
                                console.error("ada masalah", data.message);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    })
                });
            });
        }
    } catch (error) {
        console.error(error);
    }

    const deleteButton = document.getElementsByClassName('delete-btn');
    for (let index = 0; index < deleteButton.length; index++) {
        deleteButton[index].addEventListener('click', async function () {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Apakah Kamu Yakin?",
                text: "Data pegawai akan dihapus permanen",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Hapus",
                cancelButtonText: "Batal",
                reverseButtons: true,
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary me-3'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const id_karyawan = deleteButton[index].getAttribute('id_karyawan')
                    console.log(id_karyawan);
                    try {
                        const response = await fetch(`/hapusKaryawan/${id_karyawan}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const data = await response.json();
                        if (data.success) {
                            swalWithBootstrapButtons.fire({
                                title: "Data Berhasil dihapus",
                                text: data.message,
                                timer: 1500,
                                icon: "success",
                                confirmButtonText: "OK"
                            }).then((result) => {
                                location.reload();
                            })
                        } else {
                            Swal.fire({
                                title: data.message,
                                timer: 1500,
                                icon: "error"
                            });
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Batal",
                        text: "Data Pegawai batal di hapus",
                        icon: "error"
                    });
                }
            });

        })
    }

    const simpanKaryawan = document.getElementById('simpanKaryawan')
    document.getElementById('simpanKaryawan').addEventListener('click', async function () {
        const nama = document.getElementById('nama').value
        const nip = document.getElementById('nip').value
        const golongan = document.getElementById('golongan').value
        const jabatan = document.getElementById('jabatan').value
        const bagian = document.getElementById('bagian').value
        const role = document.getElementById('role').value
        const jenis_kelamin = document.getElementById('jenis_kelamin').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        try {
            const response = await fetch('/tambahKaryawan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama: nama,
                    nip_karyawan: nip,
                    jabatan: jabatan,
                    jenis_kelamin: jenis_kelamin,
                    email: email,
                    password: password,
                    role: role,
                    golongan: golongan,
                    bagian: bagian
                }),
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
                console.log('Data berhasil disimpan:', data);
                $('#modalTambahKriteria').modal('hide');
            } else {
                Swal.fire({
                    title: data.message,
                    timer: 1500,
                    icon: "error"
                });
                console.error("ada masalah", data.message);
            }
        } catch (error) {
            console.error(error);
        }
    })

});