const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const upload = require('../config/multerConfig');
const { auth, adminOnly, checkRole } = require('../middlewares/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/update-profile',  upload.single('avatar'), AuthController.updateProfile);
router.post('/update-settings',  AuthController.updateSettings);
router.get('/profile', AuthController.getProfile);

router.get('/me', auth, AuthController.getMyProfile);

module.exports = router;