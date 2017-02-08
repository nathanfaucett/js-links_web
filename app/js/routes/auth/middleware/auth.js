var app = require("../../../app"),
    HEADER_TOKEN = require("../../../consts/HEADER_TOKEN");


module.exports = auth;


function auth(ctx, next) {
    var pathname = ctx.pathname;

    app.hasCookie(HEADER_TOKEN, function onHasCookie(error, hasCookie) {
        if (!hasCookie) {
            if (pathname === "/sign_up") {
                app.page.go("/sign_up");
            } else {
                app.page.go("/sign_in");
            }
        } else {
            next();
        }
    });
}