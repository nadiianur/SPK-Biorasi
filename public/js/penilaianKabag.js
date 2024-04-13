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
        const responsdataKaryawan = await fetch('/getNamaKaryawanKabag', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const dataKaryawan = await responsdataKaryawan.json();
        const tableBody = document.querySelector('table tbody');

        if (dataKaryawan.success && dataKaryawan.data[0].dataDetailGenerate.length > 0) {
            tableBody.innerHTML = '';

            dataKaryawan.data[0].dataDetailGenerate.forEach((karyawan, index) => {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-id', karyawan.id_karyawan);

                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${karyawan.dataKaryawan.nip_karyawan}</td>
                    ${karyawan.status === "belum selesai" ? 
                        `<td>
                            <button type="button" class="btn btn-primary" style="background-color: #FC9F9F; border-color: #FC9F9F; border-radius: 100px; font-size: smaller;" disabled>Belum</button>
                        </td> 
                        <td id="aksi">
                            <a href="/formPenilaianKabag/?id=${karyawan.id_detail_generate}">
                                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px"
                                    viewBox="0 0 24 24" width="18px" fill="#000000">
                                    <g>
                                        <path d="M0,0h24v24H0V0z" fill="none" />
                                        <path
                                            d="M11,7h2v2h-2V7z M11,11h2v6h-2V11z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z" />
                                    </g>
                                </svg>
                            </a>
                        </td>`
                        : 
                        `<td>
                            <button type="button" class="btn btn-light" style="background-color: #D0E7DC; border-radius: 100px; font-size: smaller; font-weight: 600; color:black;" disabled>Selesai</button>
                        </td>
                        <td id="aksi">
                                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px"
                                    viewBox="0 0 24 24" width="18px" fill="#000000">
                                    <g>
                                        <path d="M0,0h24v24H0V0z" fill="none" />
                                        <path
                                            d="M11,7h2v2h-2V7z M11,11h2v6h-2V11z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z" />
                                    </g>
                                </svg>
                        </td>`
                    }
                `;
                tableBody.appendChild(newRow);
            });
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">Periode Penilaian Belum dimulai</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error(error);
    }

    const timestampElement = document.getElementById('timestamp');
    const currentDate = new Date();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const timestampText = `${currentMonth} ${currentYear}`;
    timestampElement.innerText = 'Periode Penilaian ' + timestampText;

});