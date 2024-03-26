// routes/streamRoutes.js

const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');

router.get('/', streamController.startStream);

module.exports = router;
