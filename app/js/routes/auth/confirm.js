var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/users/confirm/:token{[a-zA-Z0-9]+}",
    function renderNotConfirmed(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "confirm",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);