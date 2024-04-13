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

    const generateData = document.getElementById('generateData')
    document.getElementById('generateData').addEventListener('click', async function () {
        const bulanPenilaian = document.getElementById('bulanPenilaian').value

        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            showConfirmButton: false,
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://sweetalert2.github.io/images/nyan-cat.gif")
                left top
                no-repeat
            `,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        });

        try {
            const responseGenerate = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    periode: bulanPenilaian
                })
            })
            const dataGenerate = await responseGenerate.json()
            if (dataGenerate.success) {
                Swal.close();
                Swal.fire({
                    title: dataGenerate.message,
                    icon: "success"
                }).then((result) => {
                        location.reload();
                })
                console.log(dataGenerate);
                setTimeout(() => {
                    Swal.close();
                }, 15000);
            } else {
                Swal.close();
                Swal.fire({
                    title: dataGenerate.message,
                    timer: 1500,
                    icon: "error"
                });
                console.error("ada masalah", dataGenerate.message);
            }
        } catch (error) {
            Swal.close();
            console.error(error);
        }
    })

});