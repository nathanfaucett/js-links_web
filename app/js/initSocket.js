var app = require("./app"),
    config = require("./config"),
    phoenix = require("./phoenix");


module.exports = initSocket;


function initSocket() {
    var socket = new phoenix.Socket(config.baseUrlWS + "/socket");

    socket.connect();

    socket.onOpen(function onOpen(ev) {
        console.log("SOCKET OPEN", ev);
    });
    socket.onError(function onOpen(ev) {
        console.log("SOCKET ERROR", ev);
    });
    socket.onClose(function onOpen(e) {
        console.log("SOCKET CLOSE", e);
    });

    var topic = "posts",
        channel = socket.channel(topic, {});

    channel.join()
        .receive("ok", function(data) {
            console.log("Joined topic", topic, data);
        })
        .receive("error", function(resp) {
            console.log("Unable to join topic", topic, resp);
        });

    channel.on("create", function(post) {
        app.emit("posts:create", post);
    });
    channel.on("update", function(post) {
        app.emit("posts:update", post);
    });
    channel.on("delete", function(post) {
        app.emit("posts:delete", post);
    });

    return socket;
}