// controllers/deviceController.js

const Device = require('../models/device');

exports.getAllDevices = (req, res) => {
  Device.getAllDevices((error, devices) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ devices });
    }
  });
};

exports.updateDevice = (req, res) => {
  const { device_id } = req.params;
  const changes = req.body;

  Device.getDeviceById(device_id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        return res.status(404).send({ error: 'Device not found' });
      }
      
      // Update device fields
      Object.keys(changes).forEach((key) => {
        if (changes[key]) {
          Device.updateDevice(device_id, { [key]: changes[key] }, (error) => {
            if (error) {
              res.status(500).json({ error: 'Internal server error' });
            }
          });
        }
      });

      return res.status(200).send({ message: 'Device info updated successfully' });
    }
  });
};

exports.addDevice = (req, res) => {
  const { device_id, device_name, password, device_type, url, ip, port, suffix } = req.body;

  // Check if required fields are present
  if (!device_id || !device_name || !device_type || !url || !ip || !port || !suffix || !password) {
    return res.status(400).send({ error: 'Missing or empty value for one or more required fields' }); 
  }

  // Check if device with given ID exists
  Device.getDeviceById(device_id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        return res.status(400).send({ error: 'Device id already exists' });
      }

      // Insert device into database
      Device.addDevice({ device_id, device_name, password, device_type, url, ip, port, suffix }, (error) => {
        if (error) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          return res.status(201).send({ message: 'Device added successfully' });
        }
      });
    }
  });
};

exports.deleteDevice = (req, res) => {
  const { device_id } = req.params;

  Device.getDeviceById(device_id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        return res.status(404).send({ error: 'Device not found' });
      }

      // Delete device
      Device.deleteDevice(device_id, (error) => {
        if (error) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          return res.status(200).send({ message: 'Device deleted successfully' });
        }
      });
    }
  });
};
