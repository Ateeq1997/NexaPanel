const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/demo-credentials', authController.getDemoCredentials);
router.post('/login', authController.login);


module.exports = router;
