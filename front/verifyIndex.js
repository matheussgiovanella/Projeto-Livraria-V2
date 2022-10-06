const auth = async () =>
{
    let url = `${ENDPOINT}/auth`

    let formData = getFormData();

    if (typeof formData === 'string')
    {
        popUp(formData);
    }
    else
    {
        let authorization = `${formData.email}:${formData.password}`;
        let base64 = btoa(authorization);

        let headers = new Headers(
            {
                authorization: `Basic ${base64}`
            }
        );
        let options =
        {
            headers: headers,
            method: 'GET',
            cache: 'no-store'
        }

        const response = await fetch(url, options);
        const usuario = await response.json();

        if (usuario != null && usuario.id)
        {
            localStorage.setItem('logado', JSON.stringify(usuario));
            popUp('Login efetuado com sucesso!');
            document.location.href = './html/menu.html'
        }
        else
        {
            popUp('Problemas no login, verifique dados digitados!');
        }

        console.log(usuario);
    }
}

const verify = async () =>
{
    let url = `${ENDPOINT}/verify`;

    let logado = await JSON.parse(localStorage.getItem('logado'));

    if (logado == null)
    {
        return;
    }

    let authorization = `${logado.email}:${logado.password}`;
    let base64 = btoa(authorization);

    let headers = new Headers(
        {
            authorization: `Basic ${base64}`
        }
    );
    let options =
    {
        headers: headers,
        method: 'GET',
        cache: 'no-store'
    }

    const response = await fetch(url, options);
    const usuario = await response.json();

    if (usuario)
    {
        document.location.href = './html/menu.html'
    }
}

const getFormData = () =>
{
    const sign_in = document.querySelector('.sign_in-field');
    const email = sign_in.querySelector('#email').value;
    let password = sign_in.querySelector('#password').value;
    if (email === '')
    {
        return `Email cannot be empty!`;
    }
    else if (password === '')
    {
        return `Password cannot be empty!`;
    }
    else
    {
        password = md5(password);
        return { email, password }
    }
}

verify();