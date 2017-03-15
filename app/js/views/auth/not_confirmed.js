var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutApp = require("../../components/layouts/LayoutApp"),
    NotConfirmed = require("../../components/auth/NotConfirmed");


app.registerPage("not_confirmed", function(ctx) {
    return (
        virt.createView(LayoutApp, {
            ctx: ctx,
            i18n: app.i18n,
            render: function() {
                return virt.createView(NotConfirmed);
            }
        })
    );
});