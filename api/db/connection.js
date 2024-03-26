// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'your_database_host',
//   user: 'your_database_user',
//   password: 'your_database_password',
//   database: 'your_database_name' 
// });

// module.exports = connection;


// db/connection.js

const mysql = require('mysql2');

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'your_database_host',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'your_database_name',
    multipleStatements: true // Enable multiple statements for stored procedures
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds
    } else {
      console.log('Connected to database');
    }
  });

  connection.on('error', (err) => {
    console.error('Database connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Reconnecting to database...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
