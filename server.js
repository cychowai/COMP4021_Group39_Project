const express = require("express");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use a web server to listen at port 8000
app.listen(8000, () => {
  console.log("The server has started...");
});
