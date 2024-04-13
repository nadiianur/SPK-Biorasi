document.addEventListener('DOMContentLoaded', async () => {
    try {
        const form = document.querySelector('form')
        form.addEventListener('submit', async (event) => {
            const username = document.getElementById('username').value
            const email = document.getElementById('email').value
            const nip = document.getElementById('nip').value
            event.preventDefault()
            console.log(username, email, nip)
            const responForgot = await fetch('/forgotPasswordAdmin', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    nip_admin: nip
                })
            });
            const dataForgot = await responForgot.json()
            console.log(dataForgot);
            if (dataForgot.succes) {
                window.location.href = "/changePass/?id=" + dataForgot.id_admin;
            } else {
                Swal.fire({
                    title: dataForgot.message,
                    icon: "error"
                });
            }
        })
    } catch (error) {
        console.error(error);
    }

});