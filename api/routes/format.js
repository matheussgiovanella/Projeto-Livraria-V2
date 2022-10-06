const router = require('express').Router();
const FormatModel = require('../models/Format.js');
const formatController = require('../controllers/formatsController.js');

router.get('/formats', formatController.index);
router.get('/formats/:formatId', formatController.show);
router.post('/formats', formatController.create);
router.put('/formats/:formatId', formatController.update);
router.delete('/formats/:formatId', formatController.delete);

module.exports = router;