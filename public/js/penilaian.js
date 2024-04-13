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
        const responsDataPenilaian = await fetch('/dataKriteria', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const dataPenilaian = await responsDataPenilaian.json();
        if (dataPenilaian.success) {
            console.log("pos", dataPenilaian);
            const tableBody = document.querySelector('table tbody');
            tableBody.innerHTML = '';

            dataPenilaian.data.forEach((kriteria, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', kriteria.id_kriteria);

                newRow.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${kriteria.nama_kriteria}</td>
                            <td>${kriteria.bobot_kriteria}</td>
                            <td>
                                <button type="button" class="btn btn-warning" style="color: white; border-radius: 30px; vertical-align: middle; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);" id_kriteria=${kriteria.id_kriteria}>
                                    Edit
                                </button>
                                &nbsp;
                                <button type="button" class="btn btn-danger delete-btn" style="border-radius: 30px; vertical-align: middle; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);" id_kriteria=${kriteria.id_kriteria}>
                                    Hapus
                                </button>
                            </td>
                        `;
                tableBody.appendChild(newRow);
            });

            const editButtons = document.querySelectorAll('button.btn-warning');
            editButtons.forEach((editButton) => {
                editButton.addEventListener('click', function () {
                    const id_kriteria = editButton.getAttribute('id_kriteria');
                    const penilaian = dataPenilaian.data.find((k) => k.id_kriteria === id_kriteria);

                    document.getElementById('kriteriaEdit').value = penilaian.nama_kriteria
                    document.getElementById('bobotEdit').value = penilaian.bobot_kriteria
                    document.getElementById('sub_penilaian1Edit').value = penilaian.sub_penilaian1
                    document.getElementById('sub_penilaian2Edit').value = penilaian.sub_penilaian2
                    document.getElementById('sub_penilaian3Edit').value = penilaian.sub_penilaian3
                    document.getElementById('sub_penilaian4Edit').value = penilaian.sub_penilaian4
                    document.getElementById('sub_penilaian5Edit').value = penilaian.sub_penilaian5
                    console.log(id_kriteria);

                    // Menampilkan modal edit
                    const modal = new bootstrap.Modal(document.getElementById('modalEditKriteria'));
                    modal.show();
                    const simpanPerubahanBtn = document.getElementById('simpanEditKriteria')
                    console.log("pp", simpanPerubahanBtn);
                    document.getElementById('simpanEditKriteria').addEventListener('click', async function () {
                        const nama_kriteria = document.getElementById('kriteriaEdit').value
                        const bobot_kriteria = document.getElementById('bobotEdit').value
                        const sub_penilaian1 = document.getElementById('sub_penilaian1Edit').value
                        const sub_penilaian2 = document.getElementById('sub_penilaian2Edit').value
                        const sub_penilaian3 = document.getElementById('sub_penilaian3Edit').value
                        const sub_penilaian4 = document.getElementById('sub_penilaian4Edit').value
                        const sub_penilaian5 = document.getElementById('sub_penilaian5Edit').value
                        try {
                            const response = await fetch(`/editKriteria/${id_kriteria}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    nama_kriteria: nama_kriteria,
                                    bobot_kriteria: bobot_kriteria,
                                    sub_penilaian1: sub_penilaian1,
                                    sub_penilaian2: sub_penilaian2,
                                    sub_penilaian3: sub_penilaian3,
                                    sub_penilaian4: sub_penilaian4,
                                    sub_penilaian5: sub_penilaian5
                                }),
                            });
                            const data = await response.json();
                            if (data.success) {
                                Swal.fire({
                                    title: data.message,
                                    icon: "success",
                                    confirmButtonText: "OK"
                                }).then((result) => {
                                    location.reload();
                                })
                                console.log('Data berhasil disimpan:', data);
                            } else {
                                Swal.fire({
                                    title: data.message,
                                    timer: 2000,
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
                text: "Data kriteria penilaian akan dihapus permanen",
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
                    const id_kriteria = deleteButton[index].getAttribute('id_kriteria')
                    console.log(id_kriteria);
                    try {
                        const response = await fetch(`/hapusKriteria/${id_kriteria}`, {
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
                                timer: 2000,
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
                        text: "Data Kriteria Penilaian batal di hapus",
                        icon: "error"
                    });
                }
            });

        })
    }

    document.getElementById('simpanKriteria').addEventListener('click', async function () {
        const kriteria = document.getElementById('kriteria').value;
        const bobot = document.getElementById('bobot').value;
        const sub_penilaian1 = document.getElementById('sub_penilaian1').value;
        const sub_penilaian2 = document.getElementById('sub_penilaian2').value;
        const sub_penilaian3 = document.getElementById('sub_penilaian3').value;
        const sub_penilaian4 = document.getElementById('sub_penilaian4').value;
        const sub_penilaian5 = document.getElementById('sub_penilaian5').value;
        try {
            const response = await fetch('/tambahKriteria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama_kriteria: kriteria,
                    bobot_kriteria: bobot,
                    sub_penilaian1: sub_penilaian1,
                    sub_penilaian2: sub_penilaian2,
                    sub_penilaian3: sub_penilaian3,
                    sub_penilaian4: sub_penilaian4,
                    sub_penilaian5: sub_penilaian5
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
                    timer: 2000,
                    icon: "error"
                });
                console.error("ada masalah", data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

});