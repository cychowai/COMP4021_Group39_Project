const express = require("express");
const session = require("express-session");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const gameSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 }
});
app.use(gameSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
  return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
  // Get the JSON data from the body
  const { username, avatar, name, password } = req.body;

  // Reading the users.json file
  const usersRead = JSON.parse(fs.readFileSync("data/users.json"));

  // Checking for the user data correctness
  if (username == "" || avatar == "" || name == "" || password == "") {
    res.json({ status: "error", error: "contains empty field" });
  }
  else if (!containWordCharsOnly(username)) {
    res.json({ status: "error", error: "contains non word Char" })
  }
  else if (username in usersRead) {
    res.json({ status: "error", error: "name used" });
  }
  else {
    // Adding the new user account
    const hash = bcrypt.hashSync(password, 10);

    // Saving the users.json file
    usersRead[username] = {
      "avatar": avatar,
      "name": name,
      "password": hash
    };
    fs.writeFileSync("data/users.json", JSON.stringify(usersRead, null, " "));
    // Sending a success response to the browser
    res.json({ status: "success" });
    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented.1" });
  }
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
  // Get the JSON data from the body
  const { username, password } = req.body;

  // Reading the users.json file
  const usersRead = JSON.parse(fs.readFileSync("data/users.json"));

  // Checking for username/password
  /* a hashed password stored in users.json */
  // const hashedPassword = usersRead[username].password;
  if (!(username in usersRead)) {
    res.json({ status: "error", error: "user does not exist" });
  }
  else if (!bcrypt.compareSync(password, usersRead[username].password)) {
    res.json({ status: "error", error: "Incorrect password" });
  }
  else {
    const userReturn = {
      "username": username,
      "avatar": usersRead[username].avatar,
      "name": usersRead[username].name
    };
    req.session.user = userReturn;
    res.json({ status: "success", user: userReturn/* the user object */ });
  }
  // Sending a success response with the user account

  // Delete when appropriate
  // res.json({ status: "error", error: "This endpoint is not yet implemented.2" });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
  // Getting req.session.user
  if (req.session.user) {
    res.json({ status: "success", user: req.session.user });
  }
  else {
    res.json({ status: "error" });
  }
  // Sending a success response with the user account

  // Delete when appropriate
  // res.json({ status: "error", error: "This endpoint is not yet implemented.3" });
});

// Use a web server to listen at port 8000
app.listen(8000, () => {
  console.log("The server has started...");
});
