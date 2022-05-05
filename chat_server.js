const express = require("express");

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
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const usersRead = JSON.parse(fs.readFileSync("data/users.json"));
    //console.log(usersRead);
    
    //
    // E. Checking for the user data correctness
    //
    if(username == "" || avatar =="" || name == "" || password == ""){
        res.json({ status: "error", error: "contains empty field"});
    }
    else if(!containWordCharsOnly(username)){
        res.json({ status: "error", error: "contains non word Char"})
    } 
    else if(username in usersRead){
        res.json({ status: "error", error: "name used"});
    } 
    else{
    //
    // G. Adding the new user account
    //
    const hash = bcrypt.hashSync(password, 10);
  
    //
    // H. Saving the users.json file
    //
    usersRead[username] = { 
        "avatar": avatar, 
        "name": name, 
        "password": hash
    };
    fs.writeFileSync("data/users.json",JSON.stringify(usersRead, null, " "));
    //
    // I. Sending a success response to the browser
    //
    res.json({ status: "success" });
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented.1" });
    }

});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const usersRead = JSON.parse(fs.readFileSync("data/users.json"));

    //
    // E. Checking for username/password
    //
    /* a hashed password stored in users.json */
    //const hashedPassword = usersRead[username].password;
    if(!(username in usersRead)){
        res.json({ status: "error", error: "user does not exist"});
    }
    else if(!bcrypt.compareSync(password,usersRead[username].password)){
        res.json({ status: "error", error: "Incorrect password"});
    }
    else{
        //const userReturn = {};
        const userReturn = {
            "username": username,
            "avatar": usersRead[username].avatar, 
            "name": usersRead[username].name
        };
        //console.log(userReturn);
        req.session.user = userReturn;
        res.json({ status: "success", user: userReturn/* the user object */ });
    }
    //
    // G. Sending a success response with the user account
    //
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented.2" });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    if (req.session.user){
        res.json({ status: "success", user: req.session.user });
        //console.log(req.session.user);
    }
    else{
        res.json({ status: "error"});
    }
    //
    // D. Sending a success response with the user account
    //
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented.3" });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    delete req.session.user;
    //
    // Sending a success response
    //
    res.json({ status: "success"});
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented.4" });
});


//
// ***** Please insert your Lab 6 code here *****
//
const { createServer } = require("http");
const { Server } = require("socket.io");
const res = require("express/lib/response");
const httpServer = createServer( app );
const io = new Server(httpServer);

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});
const onlineUsers = {};

io.on("connection", (socket) => {
    // Add a new user to the online user list
   if(socket.request.session.user){
        //Object.assign(onlineUsers, socket.request.session.user);
        onlineUsers[socket.request.session.user.username] = {
            "avatar": socket.request.session.user.avatar,
            "name": socket.request.session.user.name
        };
        //console.log(onlineUsers);
       // console.log(socket.request.session.user);
    }
    //io.emit("add user", JSON.stringify(socket.request.session.user));
    
    socket.on("disconnect", () => {
        // Remove the user from the online user list
        
        if(socket.request.session.user){
            delete onlineUsers[socket.request.session.user.username];
            //console.log(onlineUsers);
        }
        //io.emit("remove user", JSON.stringify(socket.request.session.user));
        io.emit("users", JSON.stringify(onlineUsers));
    });

    socket.on("get users", () => {
        // Send the online users to the browser
        io.emit("users", JSON.stringify(onlineUsers));
    });

    socket.on("get messages", () => {
        // Send the chatroom messages to the browser
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));
        socket.emit("messages", JSON.stringify(chatroom));
    });

    socket.on("post message", (content) => {
        // Add the message to the chatroom
        const message = {
            user:     socket.request.session.user/* { username, avatar, name } */,
            datetime: new Date() /* date and time when the message is posted */,
            content: content /* content of the message */
        }
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));
        chatroom.push(message);
        fs.writeFileSync("data/chatroom.json",JSON.stringify(chatroom, null, " "));

        io.emit("add message", JSON.stringify(message))
    });

    socket.on("sending message", () => {
        io.emit("signal sending", socket.request.session.user.name);
        //console.log(socket.request.session.user.username);
    })
});