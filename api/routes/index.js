const router = require('express').Router();
const users = require('./users.js');
const states = require('./states.js');
const cities = require('./cities.js');
const publishers = require('./publishers.js');
const categories = require('./categories.js');
const formats = require('./format.js');
const books = require('./books.js');
const logs = require('./logs.js');

router.use(users);
router.use(states);
router.use(cities);
router.use(publishers);
router.use(categories);
router.use(formats);
router.use(books);
router.use(logs);

module.exports = router;