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
                    const selectBulan = document.getElementById('pilihBulan');
                    const selectTahun = document.getElementById('pilihTahun');
                    selectBulan.innerHTML = '';
                    selectTahun.innerHTML = '';

                    const responsPeriode = await fetch('/dataPeriodeTahun', {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    });

                    const dataPeriode = await responsPeriode.json();
                    if (dataPeriode.success) {
                        console.log(dataPeriode);
                        const optionPilihBulan = document.createElement('option');
                        optionPilihBulan.value = '';
                        optionPilihBulan.textContent = 'Pilih Bulan';
                        selectBulan.appendChild(optionPilihBulan);

                        const optionPilihTahun = document.createElement('option');
                        optionPilihTahun.value = '';
                        optionPilihTahun.textContent = 'Pilih Tahun';
                        selectTahun.appendChild(optionPilihTahun);
                        const addedYears = {};
                        dataPeriode.data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.periode;
                            option.textContent = item.periode;
                            selectBulan.appendChild(option);

                            if (!addedYears[item.created_at]) {
                                const optionTahun = document.createElement('option');
                                optionTahun.value = item.created_at;
                                optionTahun.textContent = item.created_at;
                                selectTahun.appendChild(optionTahun);
                                addedYears[item.created_at] = true;
                            }
                        });

                        let bulan = document.getElementById('pilihBulan').value
                        let tahun = document.getElementById('pilihTahun').value

                        selectBulan.addEventListener('change', function () {
                            bulan = selectBulan.value;
                            if (bulan !== "") {
                                selectTahun.addEventListener('change', function () {
                                    tahun = selectTahun.value
                                    if (tahun !== "") {
                                        kalender(bulan, tahun);
                                    }
                                })
                            }
                        })

                        selectTahun.addEventListener('change', function () {
                            tahun = selectTahun.value;
                            if (tahun !== "") {
                                selectBulan.addEventListener('change', function () {
                                    bulan = selectBulan.value
                                    if (bulan !== "") {
                                        kalender(bulan, tahun);
                                    }
                                })
                            }
                        })

                        async function kalender(bulan, tahun) {
                                const responsChangeTable = await fetch('dataPenilaianAkhir', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        periode: bulan,
                                        tahun: tahun
                                    })
                                })
                                let dataChangeTable = await responsChangeTable.json()
                                console.log(dataChangeTable);
                                if (dataChangeTable.success) {
                                    const tableBody = document.getElementById('bodyPelaporanTabel');
                                    tableBody.innerHTML = '';

                                    dataChangeTable.data.forEach((pelaporan, index) => {
                                        const newRow = document.createElement('tr');
                                        newRow.setAttribute('data-id', pelaporan.id_pelaporan);
                                        newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${pelaporan.dataDetailGeneratePenilaian.dataKaryawan.nip_karyawan}</td>
                <td>${pelaporan.dataDetailGeneratePenilaian.dataKaryawan.nama}</td>
                <td>${pelaporan.dataDetailGeneratePenilaian.dataKaryawan.golongan}</td>
                <td>${pelaporan.nilai_rata_rata !== null ? pelaporan.nilai_rata_rata : '-'}</td>
                <td>
                    <!-- Tombol untuk memicu modal -->
                    <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#modal-${index + 1}" id="detailPenilaian" id_karyawan=${pelaporan.dataDetailGeneratePenilaian.dataKaryawan.id_karyawan} periode=${pelaporan.dataDetailGeneratePenilaian.dataGenerate.periode} tahun=${pelaporan.dataDetailGeneratePenilaian.dataGenerate.created_at}>
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px"
                    viewBox="0 0 24 24" width="24px" fill="#000000">
                    <g>
                        <path d="M0,0h24v24H0V0z" fill="none" />
                        <path
                            d="M11,7h2v2h-2V7z M11,11h2v6h-2V11z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z" />
                    </g>
                </svg>
                    </button>
                    <!-- Modal -->
                    <div class="modal fade" id="modal-${index + 1}" tabindex="-1" aria-labelledby="modalTitle-${index + 1}" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                        style="max-width: 90%;">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitle-${index + 1}">Detail Karyawan</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                <table class="table text-center" style="margin-top: -4px;">
                                <thead>
                                    <tr style="background-color: #FFB500;">
                                        <th class="col-1" style="border-top-left-radius: 10px;">No</th>
                                        <th class="col-6">Kriteria</th>
                                        <th class="col-1">1</th>
                                        <th class="col-1">2</th>
                                        <th class="col-1">3</th>
                                        <th class="col-1">4</th>
                                        <th class="col-1" style="border-top-right-radius: 10px;">5</th>
                                    </tr>
                                </thead>
                                <tbody id="detailLaporan">
                                    <tr>
                                        <td>1</td>
                                        <td>Disiplin</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Tanggung Jawab</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Teamwork</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>Planning Skills</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td>Leadership</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>6</td>
                                        <td>Problem Solving and Decision Taking Skills</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td>Kepatuhan</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr>
                                        <td>8</td>
                                        <td>Kejujuran</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                        <td>0.1</td>
                                    </tr>
                                </tbody>
                            </table>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            `;
                                        tableBody.appendChild(newRow);
                                    });

                                    const detailButtons = document.querySelectorAll('button.btn-light')
                                    console.log(detailButtons);
                                    detailButtons.forEach((detailButton) => {
                                                detailButton.addEventListener('click', async function () {
                                                            const id_karyawan = detailButton.getAttribute('id_karyawan');
                                                            const periode = detailButton.getAttribute('periode');
                                                            const tahun = detailButton.getAttribute('tahun');

                                                            console.log(id_karyawan);
                                                            console.log(periode);
                                                            console.log(tahun);

                                                            try {
                                                                const response = await fetch(`http://localhost:5000/dataDetailPenilaian/${id_karyawan}/${periode}/${tahun}`, {
                                                                    method: 'GET',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    }
                                                                })
                                                                const dataResponse = await response.json()
                                                                console.log(dataResponse);
                                                                if (dataResponse.success) {
                                                                    const mergedData = {};
                                                                    dataResponse.data.forEach(item => {
                                                                        item.penilaian.forEach(kriteria => {
                                                                            if (!mergedData[kriteria.nama_kriteria]) {
                                                                                mergedData[kriteria.nama_kriteria] = [];
                                                                            }
                                                                            mergedData[kriteria.nama_kriteria].push(kriteria.nilai_kriteria);
                                                                        });
                                                                    });

                                                                    const tbody = document.getElementById("detailLaporan");
                                                                    tbody.innerHTML = "";
                                                                    let nomorUrutan = 1;

                                                                    for (const [kriteria, nilaiArray] of Object.entries(mergedData)) {
                                                                        const row = document.createElement("tr");
                                                                        row.innerHTML = `
                                    <td>${nomorUrutan}</td>
                                    <td>${kriteria}</td>
                                    ${nilaiArray.map(nilai => `<td>${nilai}</td>`).join('')}
                                    ${nilaiArray.length < 5 ? Array.from({ length: 5 - nilaiArray.length }, () => `-`).join('') : ''}
                                                                        `;
                            tbody.appendChild(row);
                            nomorUrutan++;
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        });
    }            

    const unduhButton = document.getElementById('unduh')
    unduhButton.addEventListener('click', async function(){
    unduhButton.setAttribute('href', `/generateLaporan/${bulan}/${tahun}`)})}
                                } else {
                                    Swal.fire({
                                        title: dataPeriode.message,
                                        timer: 1500,
                                        icon: "error"
                                    });
                                }

                            }
                            catch (error) {
                                console.error(error);
                            }
                        });