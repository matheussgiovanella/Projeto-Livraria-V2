require('dotenv').config();
require('./db');

const express = require('express');
const User = require('./models/User.js');
const routes = require('./routes/index.js');
const cors = require('cors');

const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
    next();
});

app.use(routes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});