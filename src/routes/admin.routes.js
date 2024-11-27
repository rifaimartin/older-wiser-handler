const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const AdminController = require('../controllers/AdminController');

router.get('/activities', adminAuth, AdminController.getAllActivities);
router.post('/activities', adminAuth, AdminController.createActivity);
router.put('/activities/:id', adminAuth, AdminController.updateActivity);
router.delete('/activities/:id', adminAuth, AdminController.deleteActivity);

router.get('/users', adminAuth, AdminController.getAllUsers);
router.put('/users/:id', adminAuth, AdminController.updateUser);
router.get('/dashboard/stats', adminAuth, AdminController.getDashboardStats);

module.exports = router;