const router = require('express').Router();
const StateModel = require('../models/State.js');
const stateController = require('../controllers/statesController.js');

router.get('/states', stateController.index);
router.get('/states/:stateId', stateController.show);
router.post('/states', stateController.create);
router.put('/states/:stateId', stateController.update);
router.delete('/states/:stateId', stateController.delete);

module.exports = router;