var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    app = require("../../app"),
    UserStore = require("../../stores/UserStore"),
    Link = require("virt-ui-link");


var NotConfirmedPrototype;


module.exports = NotConfirmed;


function NotConfirmed(props, context) {
    virt.Component.call(this, props, context);
}
virt.Component.extend(NotConfirmed, "NotConfirmed");
NotConfirmedPrototype = NotConfirmed.prototype;

NotConfirmed.contextTypes = {
    i18n: propTypes.func.isRequired
};

NotConfirmedPrototype.resend = function() {
    app.dispatchAction({
        type: UserStore.consts.RESEND_CONFIRMATION
    });
};

NotConfirmedPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "center"
        }
    };

    return styles;
};

NotConfirmedPrototype.render = function() {
    var styles = this.getStyles(),
        i18n = this.context.i18n;

    return (
        virt.createView("div", {
                className: "NotConfirmed",
                style: styles.root
            },
            virt.createView("div", {
                    className: "page not-confirmed"
                },
                virt.createView("h2",
                    i18n("errors.confirm.email")
                ),
                virt.createView("p",
                    i18n("errors.confirm.email_desc", UserStore.user.email)
                ),
                virt.createView("p",
                    i18n("errors.confirm.resend_email"),
                    virt.createView(Link, {
                        onClick: this.resend
                    }, i18n("errors.confirm.resend_here"))
                )
            )
        )
    );
};