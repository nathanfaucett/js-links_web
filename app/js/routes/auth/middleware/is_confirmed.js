var app = require("../../../app"),
    UserStore = require("../../../stores/UserStore");


module.exports = isConfirmed;


function isConfirmed(ctx, next) {
    if (UserStore.isConfirmed()) {
        next();
    } else {
        app.page.go("/not_confirmed");
    }
}