function insertPost(body) {
    var posts = $("#posts");
    if (!posts) {
        return;
    }

    posts.prepend("<li>" + body + "</li>");
}

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
    var boardId = $("#boardIdField").val();
    var body = $("#bodyField").val();

    if (!boardId || !body) {
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/post/create",
        data: JSON.stringify({
            boardId: boardId,
            body: body
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            try {
                insertPost(data.body);
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