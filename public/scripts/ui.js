const SignInForm = (function () {
    let playerNum = null;
    const getPlayerNum = function () {
        return playerNum;
    }
    // This function initializes the UI
    const initialize = function () {
        // Populate the avatar selection
        Avatar.populate($("#register-avatar"));

        // Hide it
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    UserPanel.update(Authentication.getUser());
                    UserPanel.show();
                    Socket.connect();
                    //create a player
                    GamePanel.createPlayer();
                    playerNum = Authentication.getPlayerNum();
                    //console.log(playerNum);
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const avatar = $("#register-avatar").val();
            const name = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, avatar, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function () {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function () {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide, getPlayerNum };
})();

const UserPanel = (function () {
    // This function initializes the UI
    const initialize = function () {
        // Hide it
        $("#user-panel").hide();

        // Click event for the signout button
        $("#signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();

                    hide();
                    SignInForm.show();
                }
            );
        });
    };

    // This function shows the form with the user
    const show = function (user) {
        $("#user-panel").show();
    };

    // This function hides the form
    const hide = function () {
        $("#user-panel").hide();
    };

    // This function updates the user panel
    const update = function (user) {
        if (user) {
            $("#user-panel .user-avatar").html(Avatar.getCode(user.avatar));
            $("#user-panel .user-name").text(user.name);
        }
        else {
            $("#user-panel .user-avatar").html("");
            $("#user-panel .user-name").text("");
        }
    };

    return { initialize, show, hide, update };
})();

const OnlineUsersPanel = (function () {
    // This function initializes the UI
    const initialize = function () { };

    // This function updates the online users panel
    const update = function (onlineUsers) {
        const onlineUsersArea = $("#online-users-area");

        // Clear the online users area
        onlineUsersArea.empty();

        // Get the current user
        const currentUser = Authentication.getUser();

        // Add the user one-by-one
        for (const username in onlineUsers) {
            //$("#player1").show();
            onlineUsersArea.append(
                $("<div id='username-" + username + "'></div>")
                    .append(UI.getUserDisplay(onlineUsers[username]))
            );
        }
    };

    // This function adds a user in the panel
    const addUser = function (user) {
        const onlineUsersArea = $("#online-users-area");

        // Find the user
        const userDiv = onlineUsersArea.find("#username-" + user.username);

        // Add the user
        if (userDiv.length == 0) {
            onlineUsersArea.append(
                $("<div id='username-" + user.username + "'></div>")
                    .append(UI.getUserDisplay(user))
            );
        }
    };

    // This function removes a user from the panel
    const removeUser = function (user) {
        const onlineUsersArea = $("#online-users-area");

        // Find the user
        const userDiv = onlineUsersArea.find("#username-" + user.username);

        // Remove the user
        if (userDiv.length > 0) userDiv.remove();
    };

    return { initialize, update, addUser, removeUser };
})();

const GamePanel = (function () {
    let gameArea = null;
    let player = [];
    let playerNum = null;

    const initialize = function () {
        /* Create the game area */
        gameArea = BoundingBox(context, 0, 0, 560, 560);

        /* Create the sprites in the game */
        //player = Player(context, 427, 240, gameArea); // The player     

        //starting the game
        $("#startButton").on("click", function () {
            Authentication.startGame(() => {
                Socket.startGame(Authentication.getTotalPlayerNum());
            });
        });
    }

    const detectKeys = function () {
        playerNum = SignInForm.getPlayerNum(); //local player number for the broswer
        /* Handle the keydown of arrow keys and spacebar */
        $(document).on("keydown", function (event) {
            //cheat key: "Space Bar"
            if (event.keyCode == 32)
                player[playerNum - 1].speedUp();

            // Send a move request
            Authentication.move(playerNum, event.keyCode % 36,
                () => {
                    //player.move(event.keyCode%36);
                    Socket.newMoveSignal(playerNum, event.keyCode % 36);
                    //console.log(playerNum);
                },
                //console.log(playerNum)
            );
        });

        /* Handle the keyup of arrow keys and spacebar */
        $(document).on("keyup", function (event) {
            //player.stop(event.keyCode%36);
            if (event.keyCode == 32)
                player[playerNum - 1].slowDown();
            /*
            Authentication.stop(playerNum, event.keyCode % 36,
                () => {
                    //player.move(event.keyCode%36);
                    Socket.newStopSignal(playerNum, event.keyCode % 36);
                },
                //error, do nothing
            );
            */
        });

        /* Start the game */
        //sounds.background.play();
        requestAnimationFrame(doFrame);
    }

    /* The main processing of the game */
    function doFrame(now) {
        /* Update the sprites */
        for (let i = 0; i < player.length; i++)
            player[i].update(now);

        //if(player[playerNum-1].getBoundingBox().isPointInBox(dot.getXY().x,dot.getXY().y)){
        //    collectedDot++;
        //}

        /* Clear the screen */
        context.clearRect(0, 0, canvas.width, canvas.height);
        createBoard();
        /* Draw the sprites */
        for (let i = 0; i < player.length; i++)
            player[i].draw();

        /* Process the next frame */
        requestAnimationFrame(doFrame);
    };

    const movePlayer = function (playerNum, keyCode) {
        player[playerNum - 1].move(keyCode);
    };

    const stopPlayer = function (playerNum, keycode) {
        player[playerNum - 1].stop(keycode);
    };
    
    const createPlayer = function (totalPlayerNum) {
        playerNum = SignInForm.getPlayerNum(); //local player number for the broswer
        for (let i = 0; i < totalPlayerNum; i++) {
            player.push(Player(context, 30 + i * 100, 30, gameArea, i));
            console.log(playerNum);
        }
    };

    return { createPlayer, stopPlayer, movePlayer, initialize, detectKeys };
})();

const UI = (function () {
    // This function gets the user display
    const getUserDisplay = function (user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
                Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, UserPanel, OnlineUsersPanel, GamePanel];

    // This function initializes the UI
    const initialize = function () {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { getUserDisplay, initialize };
})();
