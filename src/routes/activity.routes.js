const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const { auth, adminOnly, checkRole } = require('../middlewares/auth');


router.get('/', ActivityController.getAllActivities);
router.get('/:id', ActivityController.getActivityById);
router.post('/', ActivityController.createActivity);
router.put('/:id', ActivityController.updateActivity);
router.delete('/:id', ActivityController.deleteActivity);

router.get('/user-created', ActivityController.getUserCreatedActivities);
router.post('/upload', auth, ActivityController.uploadImage);
router.post('/create', auth, ActivityController.createActivity);

module.exports = router;