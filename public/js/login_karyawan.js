document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const nip = document.getElementById('nip').value
        const password = document.getElementById('password').value

        const response = await fetch('/loginKaryawan', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                nip: nip,
                password: password
            })
        })

        const dataLogin = await response.json()
        console.log(dataLogin);
        if (dataLogin.success) {
            Swal.fire({
                title: dataLogin.message,
                timer: 2000,
                icon: "success"
            });
            window.location.href = '/homePegawai'
        } else {
            Swal.fire({
                title: dataLogin.message,
                timer: 2000,
                icon: "error"
            });
        }
    })

})