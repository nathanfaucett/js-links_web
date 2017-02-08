var indexOf = require("@nathanfaucett/index_of"),
    app = require("../../../app"),
    UserStore = require("../../../stores/UserStore");


var redirectPaths = [
    "/sign_up",
    "/sign_in"
];


module.exports = redirect;


function redirect(ctx, next) {
    var pathname = ctx.pathname;

    if (UserStore.isSignedIn() && indexOf(redirectPaths, pathname) !== -1) {
        app.page.go("/sign_in");
    } else {
        next();
    }
}