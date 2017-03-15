var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    PostCreate = require("../../components/posts/PostCreate"),
    Wrapper = require("../../components/Wrapper"),
    LayoutApp = require("../../components/layouts/LayoutApp");


app.registerPage("posts_create", function renderHomePage(ctx) {
    return (
        virt.createView(LayoutApp, {
            ctx: ctx,
            i18n: app.i18n,
            render: function render() {
                return virt.createView(Wrapper,
                    virt.createView(PostCreate)
                );
            }
        })
    );
});