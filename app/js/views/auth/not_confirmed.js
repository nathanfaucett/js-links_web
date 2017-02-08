var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutNoHeader = require("../../components/layouts/LayoutNoHeader"),
    NotConfirmed = require("../../components/auth/NotConfirmed");


app.registerPage("not_confirmed", function(ctx) {
    return (
        virt.createView(LayoutNoHeader, {
            ctx: ctx,
            i18n: app.i18n,
            render: function() {
                return virt.createView(NotConfirmed);
            }
        })
    );
});