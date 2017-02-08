var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/sign_in",
    function renderSignIn(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "sign_in",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);