const express = require("express");
const middleware = require("./middleware");
const routes = require("./routes");

const app = express();
const port = 3002;

// Use middleware from middleware.js
app.use(middleware);

// Use routes from routes.js
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
