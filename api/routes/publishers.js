const router = require('express').Router();
const PublisherModel = require('../models/Publisher.js');
const publisherController = require('../controllers/publishersController.js');

router.get('/publishers', publisherController.index);
router.get('/publishers/:publisherId', publisherController.show);
router.post('/publishers', publisherController.create);
router.put('/publishers/:publisherId', publisherController.update);
router.delete('/publishers/:publisherId', publisherController.delete);

module.exports = router;