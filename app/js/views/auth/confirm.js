var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutNoHeader = require("../../components/layouts/LayoutNoHeader"),
    Confirm = require("../../components/auth/Confirm");


app.registerPage("confirm", function(ctx) {
    return (
        virt.createView(LayoutNoHeader, {
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