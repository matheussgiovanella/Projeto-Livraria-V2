const router = require('express').Router();
const CategoryModel = require('../models/Categories.js');
const categoryController = require('../controllers/categoriesController.js');

router.get('/categories', categoryController.index);
router.get('/categories/:categoryId', categoryController.show);
router.post('/categories', categoryController.create);
router.put('/categories/:categoryId', categoryController.update);
router.delete('/categories/:categoryId', categoryController.delete);

module.exports = router;