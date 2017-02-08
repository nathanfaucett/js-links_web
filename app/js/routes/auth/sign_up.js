var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/sign_up",
    function renderSignUp(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "sign_up",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);