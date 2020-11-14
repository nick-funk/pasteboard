function insertBoard(board) {
    var boards = $("#boards");
    if (!boards) {
        return;
    }

    boards.prepend("<li><a href=\"/board/" + board.id + "\">" + board.name + "</a></li>");
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
    var name = $("#nameField").val();
    if (!name) {
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/board/create",
        data: JSON.stringify({
            name: name
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            try {
                insertBoard(data);
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