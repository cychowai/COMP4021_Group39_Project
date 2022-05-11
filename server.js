const express = require("express")
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 3000000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

let playerNum = 0;   //this is the current number of players, serves 2 purpose in this program.
let playing = 0; //0=not playing
let randomNum = [];

function generateRandom(){
    setInterval(function() {
        for(let i=0; i<4; i++){
            randomNum[i] = Math.random();
        }
        io.emit("server random", randomNum);
        
        console.log(randomNum);
        }, 1000);
}
generateRandom();

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;

    // D. Reading the users.json file
    const usersRead = JSON.parse(fs.readFileSync("data/users.json"));
    //console.log(usersRead);

    // E. Checking for the user data correctness
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
        // G. Adding the new user account
        const hash = bcrypt.hashSync(password, 10);

        // H. Saving the users.json file
        usersRead[username] = {
            "avatar": avatar,
            "name": name,
            "password": hash
        };
        fs.writeFileSync("data/users.json", JSON.stringify(usersRead, null, " "));
        // I. Sending a success response to the browser
        res.json({ status: "success" });
    }
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;
    const usersRead = JSON.parse(fs.readFileSync("data/users.json"));
    /* a hashed password stored in users.json */
    //const hashedPassword = usersRead[username].password;
    if (!(username in usersRead)) {
        res.json({ status: "error", error: "user does not exist" });
    }
    else if (!bcrypt.compareSync(password, usersRead[username].password)) {
        res.json({ status: "error", error: "Incorrect password" });
    }
    else {
        playerNum++;
        console.log(playerNum);
        const userReturn = {
            "username": username,
            "avatar": usersRead[username].avatar,
            "name": usersRead[username].name
        };
        //console.log(userReturn);
        //this line is session
        req.session.user = userReturn;
        res.json({ status: "success", user: userReturn, playerNum: playerNum });
    }
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
    if (req.session.user) {
        res.json({ status: "success", user: req.session.user, playerNum: playerNum });
        //console.log(req.session.user);
    }
    else {
        res.json({ status: "error" });
    }
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {
    // Deleting req.session.user
    playerNum--;
    delete req.session.user;
    // Sending a success response
    res.json({ status: "success" });
});

app.post("/move", (req, res) => {
    const keyCode = req.body.keyCode;
    const playerNum = req.body.playerNum;
    //const mapRead = JSON.parse(fs.readFileSync("data/map.json"));
    //determine valid move or not
    if (true) {
        res.json({ status: "success", playerNum: playerNum, keyCode: keyCode })
    }
    //ghost gameover

    //wall, bounce
});

app.post("/stop", (req, res) => {
    const keyCode = req.body.keyCode;
    const playerNum = req.body.playerNum;
    //const mapRead = JSON.parse(fs.readFileSync("data/map.json"));
    //determine valid move or not
    if (true) {
        res.json({ status: "success", playerNum: playerNum, keyCode: keyCode })
    }
});

app.get("/start", (req, res) => {
    res.json({ status: "success", totalPlayerNum: playerNum });
});

app.get("/unlock", (req, res) => {
    playing = 0;
    res.json({ status: "success"});
});

const { createServer } = require("http");
const { Server } = require("socket.io");
const res = require("express/lib/response");
const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

const onlineUsers = {};

io.on("connection", (socket) => {
    // Add a new user to the online user list
    if (socket.request.session.user) {
        onlineUsers[socket.request.session.user.username] = {
            "avatar": socket.request.session.user.avatar,
            "name": socket.request.session.user.name
        };
    }
    io.emit("add user", JSON.stringify(socket.request.session.user));

    socket.on("disconnect", () => {
        // Remove the user from the online user list
        if (socket.request.session.user) {
            delete onlineUsers[socket.request.session.user.username];
        }
        //io.emit("remove user", JSON.stringify(socket.request.session.user));
        io.emit("users", JSON.stringify(onlineUsers));
    });

    socket.on("get users", () => {
        // Send the online users to the browser
        io.emit("users", JSON.stringify(onlineUsers));
    });

    socket.on("newMoveSignal", (playerNum, keyCode) => {
        io.emit("move signal", playerNum, keyCode);
    });

    socket.on("newStopSignal", (playerNum, keyCode) => {
        io.emit("stop signal", playerNum, keyCode);
    });

    socket.on("start game", (totalPlayerNum) => {
        if (playing == 0) {
            io.emit("start game", totalPlayerNum);
            playing = 1;
        }
        else
            io.emit("refuse starting");
    });

    socket.on("unlock game", () => {
        io.emit("unlock game");
    });
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});