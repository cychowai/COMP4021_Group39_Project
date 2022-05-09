const Registration = (function () {
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
                if (json.status == "success") {
                    onSuccess(json.success);
                }
                else if (onError) onError(json.error);
            })
            .catch((err) => {
                console.log("Error!", err);
            });
        // Delete when appropriate
        if (onError) onError("This function is not yet implemented.");
    };

    return { register };
})();
