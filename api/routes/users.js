const router = require('express').Router();
const UserModel = require('../models/User.js');
const userController = require('../controllers/usersController.js');

router.get('/users', userController.index);
router.get('/users/:userId', userController.show);
router.post('/users', userController.create);
router.put('/users/:userId', userController.update);
router.delete('/users/:userId', userController.delete);

module.exports = router;