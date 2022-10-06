const verify = async () =>
{
    let logado = await JSON.parse(localStorage.getItem('logado'));

    if (logado == null)
    {
        document.location.href = '../index.html';
    }
}

const out = () =>
{
    Swal.fire({
        title: 'Are you sure you want to leave?',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            localStorage.removeItem('logado');
            document.location.href = '../index.html'
        }
    });
}

verify();