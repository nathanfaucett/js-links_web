var RouteStore = require("../../stores/RouteStore"),
    app = require("../../app");


app.router.route(
    "/posts/create",
    function handlePostsCreate(ctx, next) {
        app.dispatchAction({
            type: RouteStore.consts.UPDATE,
            state: "posts_create",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);