var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    PostNewest = require("../../components/posts/PostNewest"),
    HeaderOffset = require("../../components/HeaderOffset"),
    Wrapper = require("../../components/Wrapper"),
    LayoutApp = require("../../components/layouts/LayoutApp");


app.registerPage("posts_newest", function renderHomePage(ctx) {
    return (
        virt.createView(LayoutApp, {
            ctx: ctx,
            i18n: app.i18n,
            render: function render() {
                return virt.createView(HeaderOffset,
                    virt.createView(Wrapper,
                        virt.createView(PostNewest)
                    )
                );
            }
        })
    );
});