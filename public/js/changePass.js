document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const form = document.querySelector('form')
        form.addEventListener('submit', async (event) =>{
            const password = document.getElementById('password').value
            const confirmpass = document.getElementById('confirmpass').value
          
            event.preventDefault()
            const responChange = await fetch(`/confirmPassword/${id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body:  JSON.stringify({
                    new_password: password,
                    confirm_new: confirmpass,
                })
            });
            const dataChange = await responChange.json()
            console.log(dataChange);
            if (dataChange.succes) {
                Swal.fire({
                    title: dataChange.message,
                    icon: "success",
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (result.isConfirmed) {
                       window.location.href = "/loginAdmin"
                    }
                })
            }else{
                Swal.fire({
                    title: dataChange.message,
                    icon: "error"
                });
            }
        })
     
    } catch (error) {
        console.error(error);
    }

});