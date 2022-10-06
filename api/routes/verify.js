const User = require('../models/User');

const router = require('express').Router();

router.get('/auth', async (request, response) =>
{
    const logado = await authentication(request);
    
    response.json(logado);
});

router.get('/verify', async (request, response) =>
{
    const logado = await authentication(request);

    response.json(logado);
});

const authentication = async (request) =>
{
    let authorization = String(request.headers.authorization).replace('Basic ', '');
    let ascii = Buffer.from(authorization, 'base64').toString('ascii');
    let dados = ascii.split(':');

    let username = dados[0];
    let password = dados[1];

    let logado = await User.findUser(username, password);
    console.log(logado?.toJSON());

    return logado;
}

module.exports = router;