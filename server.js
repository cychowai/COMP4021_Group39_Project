const express = require("express");

//const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
/*
const gameSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 }
});
app.use(gameSession);
*/

// Use a web server to listen at port 8000
app.listen(8000, () => {
  console.log("The server has started...");
});
