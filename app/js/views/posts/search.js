var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    PostSearch = require("../../components/posts/PostSearch"),
    Wrapper = require("../../components/Wrapper"),
    LayoutApp = require("../../components/layouts/LayoutApp");


app.registerPage("posts_search", function renderHomePage(ctx) {
    return (
        virt.createView(LayoutApp, {
            ctx: ctx,
            i18n: app.i18n,
            render: function render() {
                return virt.createView(Wrapper,
                    virt.createView(PostSearch)
                );
            }
        })
    );
});