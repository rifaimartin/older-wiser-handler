// src/routes/index.js
const express = require('express');
const router = express.Router();
const activityRoutes = require('./activity.routes');

router.use('/activities', activityRoutes);

module.exports = router;