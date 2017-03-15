var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutApp = require("../../components/layouts/LayoutApp"),
    Confirm = require("../../components/auth/Confirm");


app.registerPage("confirm", function(ctx) {
    return (
        virt.createView(LayoutApp, {
            ctx: ctx,
            i18n: app.i18n,
            render: function() {
                return virt.createView(Confirm, {
                    token: ctx.params.token
                });
            }
        })
    );
});