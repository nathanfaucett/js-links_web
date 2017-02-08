var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutNoHeader = require("../../components/layouts/LayoutNoHeader"),
    SignIn = require("../../components/auth/SignIn");


app.registerPage("sign_in", function(ctx) {
    return (
        virt.createView(LayoutNoHeader, {
            ctx: ctx,
            i18n: app.i18n,
            render: function() {
                return (
                    virt.createView(SignIn)
                );
            }
        })
    );
});