function createPost(body) {
    var newElement = $("<div class=\"box post\"></div>");
    newElement.text(body);

    return newElement;
}

function prependPost(body) {
    var posts = $("#posts");
    if (!posts) {
        return;
    }

    posts.prepend(
        createPost(body)
    );
}

function appendPost(body) {
    var posts = $("#posts");
    if (!posts) {
        return;
    }

    posts.append(
        createPost(body)
    );
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

function removeElement(id) {
    var el = $("#" + id);
    if (!el) {
        return;
    }

    el.remove();
}

function submit() {
    var boardId = $("#boardIdField").val();
    var bodyElement = $("#bodyField");
    var body = bodyElement.val();

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
                prependPost(data.body);
                bodyElement.val("");
                removeElement("no-posts-message");
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
    var loadMoreButton = $("#load-more");
    var cursor = loadMoreButton.attr("cursor");
    var boardId = $("#boardIdField").val();

    if (!cursor || !boardId) {
        return;
    }

    var url = "/api/posts?boardId=" +
        boardId + "&" +
        "before=" + cursor;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            try {
                var posts = data.posts
                for (var i = 0; i < posts.length; i++) {
                    appendPost(posts[i].body);
                }

                if (data.hasMore) {
                    loadMoreButton.attr("cursor", posts.cursor);
                } else {
                    loadMoreButton.remove();
                }
            } catch {
                console.log("an error occurred attempting to load more posts");
            }
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}