
const Socket = (function () {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function () {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function () {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);
            //$("#player1").show();
            console.log(onlineUsers);
            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });

        socket.on("move signal", (playerNum, keyCode) => {
            GamePanel.movePlayer(playerNum, keyCode);
        });

        socket.on("stop signal", (playerNum, keyCode) => {
            GamePanel.stopPlayer(playerNum, keyCode);
        });

        socket.on("start game", (totalPlayerNum) => {
            $("#game-panel").show();
            /* Hide the start screen */
            $("#chat-panel").hide();
            GamePanel.createPlayer(totalPlayerNum);
            GamePanel.detectKeys();
            console.log(totalPlayerNum);
        });

        socket.on("refuse starting", () => {
            $("#someonePlaying").show();
        });

        socket.on("unlock game", () => {
            //UI.initialize();
            $("#game-panel").hide();
            /* Hide the start screen */
            $("#chat-panel").show();
            GamePanel.removeEverything();
            initializeMap();
            context.clearRect(0, 0, canvas.width, canvas.height);
            createBoard();
            GamePanel.setGameStartTime();
            GamePanel.createGhost();
        });
        
    };

    // This function disconnects the socket from the server
    const disconnect = function () {
        socket.disconnect();
        socket = null;
    };

    // This function sends a post message event to the server
    const postMessage = function (content) {
        if (socket && socket.connected) {
            socket.emit("post message", content);
        }
    };

    const sendingMessage = function () {
        socket.emit("sending message");
    };

    const newMoveSignal = function (playerNum, keyCode) {
        socket.emit("newMoveSignal", playerNum, keyCode);
    };

    const newStopSignal = function (playerNum, keyCode) {
        socket.emit("newStopSignal", playerNum, keyCode);
    };

    const startGame = function (totalPlayerNum) {
        socket.emit("start game", totalPlayerNum);
    };

    const unlockGame = function () {
        socket.emit("unlock game");
    };

    return { getSocket, connect, disconnect, postMessage, sendingMessage, newMoveSignal, newStopSignal, startGame, unlockGame };
})();
