const verify = async () =>
{
    let logado = await JSON.parse(localStorage.getItem('logado'));

    if (logado == null)
    {
        document.location.href = '../index.html';
    }
}

verify();