const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teachers');


router.post('/signup', teacherController.create);
router.post('/auth', teacherController.authenticate);

module.exports = router;