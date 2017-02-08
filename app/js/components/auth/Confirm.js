var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    app = require("../../app"),
    UserStore = require("../../stores/UserStore");


var ConfirmPrototype;


module.exports = Confirm;


function Confirm(props, context) {
    virt.Component.call(this, props, context);
}
virt.Component.extend(Confirm, "Confirm");
ConfirmPrototype = Confirm.prototype;

Confirm.propTypes = {
    token: propTypes.string.isRequired
};

Confirm.contextTypes = {
    i18n: propTypes.func.isRequired
};

ConfirmPrototype.onConfirm = function(error) {
    if (error) {
        app.page.go("/not_confirmed");
    } else {
        app.page.go("/");
    }
};

ConfirmPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "center"
        }
    };

    return styles;
};

ConfirmPrototype.componentDidMount = function() {
    UserStore.on("onConfirm", this.onConfirm);

    app.dispatchAction({
        type: UserStore.consts.CONFIRM,
        confirmation_token: this.props.token
    });
};

ConfirmPrototype.componentWillUnmount = function() {
    UserStore.off("onConfirm", this.onConfirm);
};

ConfirmPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
            className: "Confirm",
            style: styles.root
        })
    );
};