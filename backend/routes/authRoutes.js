const express = require('express');
const { signup, login } = require('../controllers/authController');
const { adminLogin } = require('../controllers/adminController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', adminLogin);



module.exports = router;
