var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/not_confirmed",
    function renderNotConfirmed(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "not_confirmed",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);