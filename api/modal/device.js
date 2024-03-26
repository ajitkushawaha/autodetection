// models/device.js

const connection = require('../db/connection');

class Device {
  static getAllDevices(callback) {
    connection.query('SELECT * FROM custom_device_tableS', callback);
  }

  static getDeviceById(deviceId, callback) {
    connection.query('SELECT * FROM custom_device_tableS WHERE device_id = ?', [deviceId], callback);
  }

  static addDevice(deviceData, callback) {
    connection.query('INSERT INTO custom_device_tableS SET ?', deviceData, callback);
  }

  static updateDevice(deviceId, newData, callback) {
    connection.query('UPDATE custom_device_tableS SET ? WHERE id = ?', [newData, deviceId], callback);
  }

  static deleteDevice(deviceId, callback) {
    connection.query('DELETE FROM custom_device_tableS WHERE id = ?', [deviceId], callback);
  }
}

module.exports = Device;
