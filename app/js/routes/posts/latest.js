var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/latest",
    function handlePostsLatest(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "posts_latest",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);