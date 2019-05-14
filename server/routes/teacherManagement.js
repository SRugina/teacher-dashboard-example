const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teachers');

router.get('/', teacherController.getAll);
router.get('/:profId', teacherController.getById);
router.put('/:profId', teacherController.updateById);
router.delete('/:profId', teacherController.deleteById);

module.exports = router;