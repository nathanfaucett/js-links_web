var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/search",
    function handlePostsSearch(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "posts_search",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);