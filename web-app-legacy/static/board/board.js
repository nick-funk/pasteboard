function createPost(post) {
    var newElement = $("<div class=\"box post\"></div>");
    newElement.attr("id", post.id)

    var content = $("<div class=\"content\"></div>");
    content.text(post.body);

    newElement.append(content);

    var deleteButton = $(
        "<button class=\"button is-danger deleteButton\" alt=\"delete\" onclick='deletePost(\"" +
            post.id +
        "\")'>×</button>"
    );

    newElement.append(deleteButton);

    return newElement;
}

function prependPost(post) {
    var posts = $("#posts");
    if (!posts) {
        return;
    }

    posts.prepend(
        createPost(post)
    );
}

function appendPost(post) {
    var posts = $("#posts");
    if (!posts) {
        return;
    }

    posts.append(
        createPost(post)
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
                prependPost(data);
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
    var loadMoreButton = $("#loadMore");
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
                    appendPost(posts[i]);
                }

                if (data.cursor !== undefined) {
                    loadMoreButton[0].setAttribute("cursor", data.cursor);
                } else {
                    loadMoreButton.remove();
                }

                if (!data.hasMore) {
                    loadMoreButton.remove();
                }
            } catch (err) {
                console.log("an error occurred attempting to load more posts");
            }
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}

function deletePost(id) {
    if (!id) {
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/post/delete",
        data: JSON.stringify({
            id: id
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            try {
                var el = $("#" + id);
                if (!el) {
                    return;
                }

                el.remove();
            } catch (err) {
                console.log("an error occurred attempting to delete a post");
            }
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}