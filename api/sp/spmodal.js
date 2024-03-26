// models/deviceModel.js

const connection = require('../db/connection');

class Device {
  static getAllDevices(callback) {
    connection.query('CALL GetAllDevices()', callback);
  }

  static getDeviceById(deviceId, callback) {
    connection.query('CALL GetDeviceById(?)', [deviceId], callback);
  }

  static addDevice(deviceData, callback) {
    connection.query('CALL AddDevice(?, ?, ?, ?, ?, ?, ?, ?)', [deviceData.device_id, deviceData.device_name, deviceData.password, deviceData.device_type, deviceData.url, deviceData.ip, deviceData.port, deviceData.suffix], callback);
  }

  static updateDevice(deviceId, newData, callback) {
    const query = 'CALL UpdateDevice(?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [deviceId, newData.device_name, newData.password, newData.device_type, newData.url, newData.ip, newData.port, newData.suffix];
    connection.query(query, params, callback);
  }

  static deleteDevice(deviceId, callback) {
    connection.query('CALL DeleteDevice(?)', [deviceId], callback);
  }
}

module.exports = Device;
