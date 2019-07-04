const express = require('express');
const router = express.Router();
const pupilController = require('../controllers/pupils');

router.get('/', pupilController.getAll);
router.post('/', pupilController.create);
router.get('/:pupilId', pupilController.getById);
router.put('/:pupilId', pupilController.updateById);
router.delete('/:pupilId', pupilController.deleteById);

router.post('/:pupilId/report', pupilController.createReport);

module.exports = router;