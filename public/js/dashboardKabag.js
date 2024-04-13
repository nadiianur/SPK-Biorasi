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
})