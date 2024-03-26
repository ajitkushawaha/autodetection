// app.js

const express = require('express');
const bodyParser = require('body-parser');
const deviceRoutes = require('./routes/deviceRoutes');
const streamRoutes = require('./routes/streamRoutes');
const app = express();

app.use(bodyParser.json());
app.use('/api/devices', deviceRoutes);
app.use('/stream', streamRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
