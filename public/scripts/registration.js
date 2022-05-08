const Registration = (function () {
    // This function sends a register request to the server
    // * `username`  - The username for the sign-in
    // * `avatar`    - The avatar of the user
    // * `name`      - The name of the user
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const register = function (username, avatar, name, password, onSuccess, onError) {
        const users = {
            "username": username,
            "avatar": avatar,
            "name": name,
            "password": password
        };
        const jsonItem = JSON.stringify(users);

        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonItem
        })
            .then((res) => res.json())
            .then((json) => {
                //console.log("Successful!");
                if (json.status == "success") {
                    /* Run the onSuccess() callback */
                    onSuccess(json.success);
                }
                else if (onError) onError(json.error);
                //console.log(json);
            })
            .catch((err) => {
                console.log("Error!");
            });
        // Delete when appropriate
        if (onError) onError("This function is not yet implemented.");
    };

    return { register };
})();
