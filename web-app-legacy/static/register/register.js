function showMessage(message, classNames) {
    var el = $("#message");
    el.html(message);

    el.removeClass();
    for (var c = 0; c < classNames.length; c++) {
        var cl = classNames[c];
        el.addClass(cl);
    }
}

function submit() {
    var emailField = $("#email");
    var usernameField = $("#username");
    var passField = $("#pass");

    if (!emailField || !usernameField || !passField) {
        return;
    }

    var email = emailField.val();
    var username = usernameField.val();
    var pass = passField.val();

    if (!email || email.trim().length === 0) {
        showMessage("an email is required to create a new account", ["message-error"]);
        return;
    }
    if (!username || username.trim().length === 0) {
        showMessage("a username is required to create a new account", ["message-error"]);
        return;
    }
    if (!pass || pass.trim().length === 0) {
        showMessage("a password is required to create a new account", ["message-error"]);
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/user/create",
        data: JSON.stringify({
            email: email,
            username: username,
            pass: pass,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            try {
                if (data.email === email && data.username === username) {
                    showMessage("successfully create account!", ["message-success"]);
                }
            } catch {
                showMessage("unknown response received", ["message-error"]);
            }
        },
        error: function(xhr) {
            try {
                var data = JSON.parse(xhr.responseText);
                showMessage(data.message, ["message-error"]);
            } catch {
                showMessage("unknown error occurred", ["message-error"]);
            }
        }
    });
}