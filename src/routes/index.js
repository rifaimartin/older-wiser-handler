// src/routes/index.js
const express = require('express');
const router = express.Router();
const activityRoutes = require('./activity.routes');
const auth = require('./auth.routes.js')

router.use('/activities', activityRoutes);
router.use('/auth', auth);

module.exports = router;