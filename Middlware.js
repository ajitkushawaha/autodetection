const express = require("express");
const cors = require("cors");

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors());

module.exports = app;
