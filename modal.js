const mysql = require('mysql2');

// Connect to MySQL database
const connection = mysql.createConnection({
  host: '192.168.1.36',
  user: 'Python',
  password: 'Python456',
  database: 'python' 
});

connection.connect();

const getAllDevices = (callback) => {
  connection.query('SELECT * FROM custom_device_tableS', (error, results) => {
    if (error) return callback(error, null);
    const devices = results.map((device) => {
      return {
        device_id: device.device_id,
        device_name: device.device_name,
        password: device.password,
        device_type: device.device_type,
        url: device.url,
        ip: device.ip,
        port: device.port,
        suffix: device.suffix, 
        active: device.active
      };
    });
    callback(null, devices);
  });
};

const getDeviceById = (deviceId, callback) => {
  connection.query('SELECT * FROM custom_device_tableS WHERE device_id = ?', [deviceId], (error, results) => {
    if (error) return callback(error, null);
    if (results.length === 0) return callback(null, null);
    const device = results[0];
    const formattedDevice = {
      device_id: device.device_id,
      device_name: device.device_name,
      password: device.password,
      device_type: device.device_type,
      url: device.url,
      ip: device.ip,
      port: device.port,
      suffix: device.suffix, 
      active: device.active
    };
    callback(null, formattedDevice);
  });
};

const addDevice = (deviceData, callback) => {
  const { device_id, device_name, password, device_type, url, ip, port, suffix } = deviceData;
  connection.query('INSERT INTO custom_device_tableS (device_id, device_name,password, device_type, url, ip, port, suffix) VALUES (?,?,?,?,?,?,?,?)', [device_id, device_name,password, device_type, url, ip, port, suffix], (error) => {
    if (error) return callback(error);
    callback(null);
  });
};

const updateDevice = (deviceId, changes, callback) => {
  // Update device fields
  Object.keys(changes).forEach((key) => {
    if (changes[key]) {
      connection.query(`UPDATE custom_device_tableS SET ${key} = ? WHERE device_id = ?`, [changes[key], deviceId], (error) => {
        if (error) return callback(error);
      });
    }
  });
  callback(null);
};

const deleteDevice = (deviceId, callback) => {
  connection.query('DELETE FROM custom_device_tableS WHERE device_id = ?', [deviceId], (error) => {
    if (error) return callback(error);
    callback(null);
  });
};

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice
};

