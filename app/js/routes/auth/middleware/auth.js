var app = require("../../../app"),
    HEADER_TOKEN = require("../../../consts/HEADER_TOKEN");


module.exports = auth;


function auth(ctx, next) {
    app.hasCookie(HEADER_TOKEN, function onHasCookie(error, hasCookie) {
        if (!hasCookie) {
            app.page.go("/sign_in");
        } else {
            next();
        }
    });
}