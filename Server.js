const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deviceController = require('./controllers/deviceController');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(deviceController);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
