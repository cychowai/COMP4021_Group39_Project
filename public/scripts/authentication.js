const Authentication = (function () {
    // This stores the current signed-in user
    let user = null;
    let playerNum = null;
    let totalPlayerNum = null;

    // This function gets the signed-in user
    const getUser = function () {
        return user;
    }

    const getPlayerNum = function () {
        return playerNum;
    }

    const getTotalPlayerNum = function () {
        return totalPlayerNum;
    }

    const signin = function (username, password, onSuccess, onError) {

        const userData = JSON.stringify({
            "username": username,
            "password": password
        });

        fetch("/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: userData
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success") {
                    user = json.user;
                    playerNum = json.playerNum;
                    /* Run the onSuccess() callback */
                    onSuccess(json.success);
                    console.log(user);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error2!")
            })
    };


    const validate = function (onSuccess, onError) {

        fetch("/validate", {
            method: "GET",
            headers: { "Content-Type": "validate/json" }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success") {
                    /* Run the onSuccess() callback */
                    user = json.user;
                    playerNum = json.playerNum;
                    onSuccess(json.success);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error3!");
            });
    };

    const signout = function (onSuccess, onError) {
        fetch("/signout", {
            method: "GET",
            headers: { "Content-Type": "signout/json" }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success") {
                    /* Run the onSuccess() callback */
                    user = null;
                    onSuccess(json.success);
                    //console.log(user);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error4!");
            });
    };

    const move = function (playerNum, keyCode, onSuccess, onError) {
        fetch("/move", {
            method: "POST",
            header: { "Content-Type": "move/json" },
            body: { "playerNum": playerNum, "keyCode": keyCode }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success") {
                    /* Run the onSuccess() callback */
                    onSuccess(json.success);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error5!");
            });
    };

    const stop = function (playerNum, keyCode, onSuccess, onError) {
        fetch("/stop", {
            method: "POST",
            header: { "Content-Type": "stop/json" },
            body: { "playerNum": playerNum, "keyCode": keyCode }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success") {
                    /* Run the onSuccess() callback */
                    onSuccess(json.success);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error6!");
            });
    };

    const startGame = function (onSuccess, onError) {
        fetch("/start", {
            method: "GET",
            headers: { "Content-Type": "start/json" }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success") {
                    /* Run the onSuccess() callback */
                    totalPlayerNum = json.totalPlayerNum;
                    onSuccess(json.success);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error4!");
            });
    };

    return { getUser, signin, validate, signout, move, stop, getPlayerNum, startGame, getTotalPlayerNum };
})();
