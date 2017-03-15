var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutApp = require("../../components/layouts/LayoutApp"),
    SignUp = require("../../components/auth/SignUp");


app.registerPage("sign_up", function(ctx) {
    return (
        virt.createView(LayoutApp, {
            ctx: ctx,
            i18n: app.i18n,
            render: function() {
                return (
                    virt.createView(SignUp)
                );
            }
        })
    );
});