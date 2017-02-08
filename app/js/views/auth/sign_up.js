var virt = require("@nathanfaucett/virt"),
    app = require("../../app"),
    LayoutNoHeader = require("../../components/layouts/LayoutNoHeader"),
    SignUp = require("../../components/auth/SignUp");


app.registerPage("sign_up", function(ctx) {
    return (
        virt.createView(LayoutNoHeader, {
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