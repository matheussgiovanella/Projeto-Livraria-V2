const router = require('express').Router();
const BookModel = require('../models/Books.js');
const bookController = require('../controllers/booksController.js');

router.get('/books', bookController.index);
router.get('/books/:bookId', bookController.show);
router.post('/books', bookController.create);
router.put('/books/:bookId', bookController.update);
router.delete('/books/:bookId', bookController.delete);

module.exports = router;