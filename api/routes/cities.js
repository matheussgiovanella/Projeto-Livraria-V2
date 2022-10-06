const router = require('express').Router();
const CityModel = require('../models/City.js');
const cityController = require('../controllers/citiesController.js');

router.get('/cities', cityController.index);
router.get('/cities/:cityId', cityController.show);
router.post('/cities', cityController.create);
router.put('/cities/:cityId', cityController.update);
router.delete('/cities/:cityId', cityController.delete);

module.exports = router;