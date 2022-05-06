const SignInForm = (function() {
    let playerNum = null;
    const getPlayerNum = function(){
        return playerNum;
    }
    // This function initializes the UI
    const initialize = function() {
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
                    GamePanel.createPlayer();
                    Socket.connect();
                    playerNum = Authentication.getPlayerNum();
                    console.out(playerNum);
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
            const avatar   = $("#register-avatar").val();
            const name     = $("#register-name").val().trim();
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
    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide, getPlayerNum };
})();

const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
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
    const show = function(user) {
        $("#user-panel").show();
    };

    // This function hides the form
    const hide = function() {
        $("#user-panel").hide();
    };

    // This function updates the user panel
    const update = function(user) {
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

const OnlineUsersPanel = (function() {
    // This function initializes the UI
    const initialize = function() {};

    // This function updates the online users panel
    const update = function(onlineUsers) {
        const onlineUsersArea = $("#online-users-area");

        // Clear the online users area
        onlineUsersArea.empty();

		// Get the current user
        const currentUser = Authentication.getUser();

        // Add the user one-by-one
        for (const username in onlineUsers) {
            if (username != currentUser.username) {
                onlineUsersArea.append(
                    $("<div id='username-" + username + "'></div>")
                        .append(UI.getUserDisplay(onlineUsers[username]))
                );
            }
        }
    };

    // This function adds a user in the panel
	const addUser = function(user) {
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
	const removeUser = function(user) {
        const onlineUsersArea = $("#online-users-area");
		
		// Find the user
		const userDiv = onlineUsersArea.find("#username-" + user.username);
		
		// Remove the user
		if (userDiv.length > 0) userDiv.remove();
	};

    return { initialize, update, addUser, removeUser };
})();

const ChatPanel = (function() {
	// This stores the chat area
    let chatArea = null;

    // This function initializes the UI
    const initialize = function() {
		// Set up the chat area
		chatArea = $("#chat-area");

        // Submit event for the input form
        $("#chat-input-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the message content
            const content = $("#chat-input").val().trim();

            // Post it
            Socket.postMessage(content);

			// Clear the message
            $("#chat-input").val("");
        });
        $("#chat-input-form").on("keydown", () =>{
            

            Socket.sendingMessage();
        })
 	};

    // This function updates the chatroom area
    const update = function(chatroom) {
        // Clear the online users area
        chatArea.empty();

        // Add the chat message one-by-one
        for (const message of chatroom) {
			addMessage(message);
        }
    };

    // This function adds a new message at the end of the chatroom
    const addMessage = function(message) {
		const datetime = new Date(message.datetime);
		const datetimeString = datetime.toLocaleDateString() + " " +
							   datetime.toLocaleTimeString();

		chatArea.append(
			$("<div class='chat-message-panel row'></div>")
				.append(UI.getUserDisplay(message.user))
				.append($("<div class='chat-message col'></div>")
					.append($("<div class='chat-date'>" + datetimeString + "</div>"))
					.append($("<div class='chat-content'>" + message.content + "</div>"))
				)
		);
		chatArea.scrollTop(chatArea[0].scrollHeight);
    };
    var clock;
    const showUp = function(username){
        
        clearTimeout(clock);
        $("#chat-whoIsUsing").text(username + " is typing....");
        $("#chat-whoIsUsing").show();
        clock = setTimeout(hide,3000);
    }

    const hide = function(){
        $("#chat-whoIsUsing").hide();
    }

    return { initialize, update, addMessage, showUp };
})();

const GamePanel = (function() {
    let cv = null;
    let context = null;
    let gameArea = null;
    let player = [];
    let playerNum = null;
    const initialize = function(){
        /* Get the canvas and 2D context */
        cv = $("canvas").get(0);
        context = cv.getContext("2d");

        /* Create the game area */
        gameArea = BoundingBox(context, 165, 60, 420, 800);

        /* Create the sprites in the game */
        //player = Player(context, 427, 240, gameArea); // The player     

        

        

        //starting the game
        $("#startButton").on("click", function() {
            
            Authentication.startGame(()=>{
                Socket.startGame(Authentication.getTotalPlayerNum());
            });

        //    $("#game-panel").show();
            /* Hide the start screen */
        //    $("#chat-panel").hide();
    
        });
    }
    const detectKeys = function(){
        playerNum = SignInForm.getPlayerNum(); //local player number for the broswer
        /* Handle the keydown of arrow keys and spacebar */
        $(document).on("keydown", function(event) {
            
            /* TODO */
            /* Handle the key down */
            
            //player.move(event.keyCode%36);

            //cheat key: "Space Bar"
            if(event.keyCode == 32)
                player[playerNum-1].speedUp();

            // Send a move request
            Authentication.move(playerNum, event.keyCode%36,
                () => {
                    //player.move(event.keyCode%36);
                    Socket.newMoveSignal(playerNum, event.keyCode%36);
                    console.log(playerNum)
                },
                console.log(playerNum)

                //error, do nothing
            );
        });

        /* Handle the keyup of arrow keys and spacebar */
        $(document).on("keyup", function(event) {
            /* TODO */
            /* Handle the key up */
            //player.stop(event.keyCode%36);
            if(event.keyCode == 32)
                player[playerNum-1].slowDown();
            Authentication.stop(playerNum, event.keyCode%36,
                () => {
                    //player.move(event.keyCode%36);
                    Socket.newStopSignal(playerNum, event.keyCode%36);
                },
                //error, do nothing
            );
        });

        /* Start the game */
        //sounds.background.play();
        requestAnimationFrame(doFrame);
    }

    /* The main processing of the game */

    function doFrame(now) {

        /* Update the sprites */
        for(let i=0; i<player.length; i++)
            player[i].update(now);

        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);

        /* Draw the sprites */
        for(let i=0; i<player.length; i++)
            player[i].draw();

        /* Process the next frame */
        requestAnimationFrame(doFrame);
    };

    
    const movePlayer = function(playerNum, keyCode){
        player[playerNum-1].move(keyCode);
        
    }

    const stopPlayer = function(playerNum, keycode){
        player[playerNum-1].stop(keycode);
    }

    const createPlayer = function(playerNum){
        for(let i=0; i<playerNum; i++){
            player.push(Player(context, 427+i*100, 240, gameArea));
            console.log(player[i]);
        }


    }
    
    return {createPlayer, stopPlayer, movePlayer, initialize, detectKeys};
})();

const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
			        Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, UserPanel, OnlineUsersPanel, ChatPanel, GamePanel];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { getUserDisplay, initialize };
})();
