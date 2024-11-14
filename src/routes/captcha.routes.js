const express = require('express');
const router = express.Router();
const CaptchaController = require('../controllers/CaptchaController');

router.post('/verify', CaptchaController.verifyCaptcha);

module.exports = router;