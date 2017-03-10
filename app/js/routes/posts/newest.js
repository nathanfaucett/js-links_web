var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/newest",
    function handlePostsNewest(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "posts_newest",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);