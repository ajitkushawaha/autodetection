// routes/deviceRoutes.js

const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.get('/', deviceController.getAllDevices);
router.patch('/:device_id', deviceController.updateDevice);
router.post('/', deviceController.addDevice);
router.delete('/:device_id', deviceController.deleteDevice);

module.exports = router;
