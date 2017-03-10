var virt = require("@nathanfaucett/virt"),
    virtDOM = require("@nathanfaucett/virt-dom"),

    cookies = require("@nathanfaucett/cookies"),
    page = require("@nathanfaucett/page/src/client"),

    environment = require("@nathanfaucett/environment"),

    HEADER_LOCALE = require("./consts/HEADER_LOCALE"),
    initSocket = require("./initSocket"),

    config = require("./config");


var document = environment.document,

    navigatorLanguage = (
        navigator.language ||
        (navigator.userLanguage && navigator.userLanguage.replace(/-[a-z]{2}$/, String.prototype.toUpperCase)) ||
        "en"
    );


module.exports = init;


if (config.env !== "production" && config.env !== "staging") {
    global.reset = function() {
        cookies.remove("Links.state");
        location.reload();
    };
}


function init(app) {
    var root = virtDOM.render(virt.createView(app.Component), document.getElementById("app")),
        messenger = root.adapter.messengerClient;


    page.initClient(messenger);


    messenger.on("Links.setCookie", function setCookie(data, callback) {
        cookies.set(data.key, data.value);
        callback();
    });
    messenger.on("Links.hasCookie", function getCookie(data, callback) {
        callback(undefined, cookies.has(data.key));
    });
    messenger.on("Links.getCookie", function getCookie(data, callback) {
        callback(undefined, cookies.get(data.key));
    });
    messenger.on("Links.removeCookie", function getCookie(data, callback) {
        callback(undefined, cookies.remove(data.key));
    });

    messenger.on("Links.setLocale", function setLocale(data, callback) {
        cookies.set(HEADER_LOCALE, data.locale);
        callback();
    });
    messenger.on("Links.getLocale", function getLocale(data, callback) {
        callback(undefined, cookies.get(HEADER_LOCALE) || navigatorLanguage);
    });

    messenger.on("Links.serverReady", function onServerReady(data, callback) {
        messenger.emit("Links.clientReady", cookies.get("Links.state"), function onReady() {
            page.listen();
        });
        callback();
    });

    initSocket();

    return root.adapter.messenger;
}