const express = require('express');
const router = express.Router();
const deviceModel = require('../models/device');

router.get('/api/devicesinfo', (req, res) => {
  deviceModel.getAllDevices((error, devices) => {
    if (error) return res.status(500).send({ error: 'Internal Server Error' });
    return res.send({ devices });
  });
});

router.patch('/api/devices/:device_id', (req, res) => {
  const { device_id } = req.params;
  const changes = req.body;

  deviceModel.getDeviceById(device_id, (error, device) => {
    if (error) return res.status(500).send({ error: 'Internal Server Error' });
    if (!device) return res.status(404).send({ error: 'Device not found' });

    deviceModel.updateDevice(device_id, changes, (error) => {
      if (error) return res.status(500).send({ error: 'Internal Server Error' });
      return res.status(200).send({ message: 'Device info updated successfully' });
    });
  });
});

router.post('/api/devices', (req, res) => {
  const deviceData = req.body;

  deviceModel.addDevice(deviceData, (error) => {
    if (error) return res.status(500).send({ error: 'Internal Server Error' });
    return res.status(201).send({ message: 'Device added successfully' });
  });
});

router.delete('/api/devices/:device_id', (req, res) => {
  const { device_id } = req.params;

  deviceModel.deleteDevice(device_id, (error) => {
    if (error) return res.status(500).send({ error: 'Internal Server Error' });
    return res.status(200).send({ message: 'Device deleted successfully' });
  });
});

module.exports = router;
