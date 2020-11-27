function createBoardDiv(board) {
    var url = "/board/" + board.id;
    
    var anchor = $("<a></a>");
    anchor.text(board.name);
    anchor.attr("href", url);

    var li = $("<li></li>");
    li.append(anchor);

    return li;
}

function insertBoard(board) {
    var boards = $("#boards");
    if (!boards) {
        return;
    }

    boards.prepend(
        createBoardDiv(board)
    );
}

function appendBoard(board) {
    var boards = $("#boards");
    if (!boards) {
        return;
    }

    boards.append(
        createBoardDiv(board)
    );
}

function removeElement(id) {
    var el = $("#" + id);
    if (!el) {
        return;
    }

    el.remove();
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
    var nameField = $("#nameField");
    var name = nameField.val();
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
                nameField.val("");
                removeElement("no-boards-message");
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

function loadMore() {
    var loadMoreButton = $("#loadMore");
    var cursor = loadMoreButton.attr("cursor");

    if (!cursor) {
        return;
    }

    var url = "/api/boards?before=" + cursor;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            try {
                var boards = data.boards
                for (var i = 0; i < boards.length; i++) {
                    appendBoard(boards[i]);
                }

                if (data.cursor !== undefined) {
                    loadMoreButton[0].setAttribute("cursor", data.cursor);
                } else {
                    loadMoreButton.remove();
                }

                if (!data.hasMore) {
                    loadMoreButton.remove();
                }
            } catch {
                console.log("an error occurred attempting to load more boards");
            }
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}