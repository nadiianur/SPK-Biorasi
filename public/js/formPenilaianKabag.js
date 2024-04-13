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
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        console.log(id);

        const responsdataKaryawan = await fetch(`/detailHasilNamaKabag/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const dataDinilai = await responsdataKaryawan.json()
        console.log(dataDinilai);
        if (dataDinilai.success) {
            document.getElementById('nama').placeholder = dataDinilai.data.dataKaryawan.nama
            document.getElementById('nip').placeholder = dataDinilai.data.dataKaryawan.nip_karyawan
            document.getElementById('golongan').placeholder = dataDinilai.data.dataKaryawan.golongan
        }
    } catch (error) {
        console.error(error);
    }

    try {
        const responsPertanyaan = await fetch('/penilaianKabag/dataKriteria', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const dataPertanyaan = await responsPertanyaan.json();
        console.log(dataPertanyaan);
        document.getElementById('penilaian').innerHTML = '';

        const form = document.getElementById('penilaian')
        dataPertanyaan.data.forEach((pertanyaan, index) => {
            const fieldset = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = `${index + 1}. ${pertanyaan.nama_kriteria}`;
            fieldset.appendChild(legend);
            legend.classList.add('kriteria', 'mt-4', 'fw-bold');

            const label1 = document.createElement('label');
            const input1 = document.createElement('input');
            input1.className = 'me-2 mt-2';
            input1.id = pertanyaan.id_kriteria;
            input1.type = 'radio';
            input1.name = pertanyaan.nama_kriteria;
            input1.value = 5;
            input1.required = true;
            label1.appendChild(input1);
            label1.appendChild(document.createTextNode(`${pertanyaan.dataDetailKriteria[0].sub_penilaian1}`));
            fieldset.appendChild(label1);

            const label2 = document.createElement('label');
            const input2 = document.createElement('input');
            input2.className = 'me-2 mt-2';
            input2.id = pertanyaan.id_kriteria;
            input2.type = 'radio';
            input2.name = pertanyaan.nama_kriteria;
            input2.value = 4;
            label2.appendChild(input2);
            label2.appendChild(document.createTextNode(`${pertanyaan.dataDetailKriteria[0].sub_penilaian2}`));
            fieldset.appendChild(label2);

            const label3 = document.createElement('label');
            const input3 = document.createElement('input');
            input3.className = 'me-2 mt-2';
            input3.type = 'radio';
            input3.id = pertanyaan.id_kriteria;
            input3.name = pertanyaan.nama_kriteria;
            input3.value = 3;
            label3.appendChild(input3);
            label3.appendChild(document.createTextNode(`${pertanyaan.dataDetailKriteria[0].sub_penilaian3}`));
            fieldset.appendChild(label3);

            const label4 = document.createElement('label');
            const input4 = document.createElement('input');
            input4.className = 'me-2 mt-2';
            input4.type = 'radio';
            input4.id = pertanyaan.id_kriteria;
            input4.name = pertanyaan.nama_kriteria;
            input4.value = 2;
            label4.appendChild(input4);
            label4.appendChild(document.createTextNode(`${pertanyaan.dataDetailKriteria[0].sub_penilaian4}`));
            fieldset.appendChild(label4);

            const label5 = document.createElement('label');
            const input5 = document.createElement('input');
            input5.className = 'me-2 mt-2';
            input5.type = 'radio';
            input5.name = pertanyaan.nama_kriteria;
            input5.value = 1;
            input5.id = pertanyaan.id_kriteria;
            label5.appendChild(input5);
            label5.appendChild(document.createTextNode(`${pertanyaan.dataDetailKriteria[0].sub_penilaian5}`));
            fieldset.appendChild(label5);

            form.appendChild(fieldset);
        });

        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'button');
        submitButton.classList.add('btn', "btn-primary", "mt-5", "d-flex", "justify-content-center", "mx-auto");
        submitButton.textContent = 'Submit';
        document.getElementById('penilaian').appendChild(submitButton);
        form.appendChild(submitButton);
        submitButton.addEventListener('click', async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');
                let isAllQuestionsAnswered = true;

                dataPertanyaan.data.forEach((pertanyaan, index) => {
                    const radioButtons = document.querySelectorAll(`input[name="${pertanyaan.nama_kriteria}"]:checked`);
                    if (radioButtons.length === 0) {
                        isAllQuestionsAnswered = false;
                    }
                });

                if (isAllQuestionsAnswered) {
                    const radios = document.querySelectorAll('input[type="radio"]:checked');
                    const penilaianData = Array.from(radios).map(radio => {
                        return {
                            id_kriteria: radio.id,
                            nilai_kriteria: radio.value
                        };
                    });
                    console.log(penilaianData);

                    const response = await fetch(`/penilaianKabag/tambahPenilaian/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(penilaianData)
                    });

                    const dataResponse = await response.json()
                    if (dataResponse.success) {
                        Swal.fire({
                            title: dataResponse.message,
                            confirmButtonText: "Oke",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '/penilaianKabag'
                            }
                        })
                    } else {
                        console.error('Gagal mengirim data penilaian');
                    }
                } else {
                    Swal.fire({
                        title: "Harap isi semua pertanyaan",
                        timer: 7100,
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Terjadi kesalahan:', error);
            }
        });
    } catch (error) {
        console.error(error);
    }

});