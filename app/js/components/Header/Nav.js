var virt = require("@nathanfaucett/virt"),
    css = require("@nathanfaucett/css"),
    propTypes = require("@nathanfaucett/prop_types"),
    FlatButton = require("virt-ui-flat_button"),
    Popover = require("virt-ui-popover"),
    SubNav = require("./SubNav"),
    Profile = require("./Profile");


var NavPrototype;


module.exports = Nav;


function Nav(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        open: false
    };
    this._requestClose = false;

    this.onClick = function(e) {
        return _this._onClick(e);
    };
    this.onRequestClose = function(e) {
        return _this._onRequestClose(e);
    };
}
virt.Component.extend(Nav, "Nav");

NavPrototype = Nav.prototype;

Nav.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

NavPrototype._onClick = function() {
    var open = this.state.open;

    if (!open) {
        this._requestClose = false;
        this.replaceState({
            open: true
        });
    }
};
NavPrototype._onRequestClose = function() {
    var _this = this;

    this._requestClose = true;
    setTimeout(function onTimeout() {
        if (_this._requestClose) {
            _this._requestClose = false;
            _this.replaceState({
                open: false
            });
        }
    }, 100);
};

NavPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "right",
            position: "relative"
        },
        button: {},
        buttonContent: {
            padding: "0px",
            textTransform: "none"
        },
        popover: {
            zIndex: 999,
            top: "46px",
            width: "256px"
        }
    };

    css.borderRadius(styles.button, "none");

    return styles;
};

NavPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "Nav",
                style: styles.root
            },
            virt.createView(FlatButton, {
                    style: styles.button,
                    onClick: this.onClick,
                    contentStyle: styles.buttonContent
                },
                virt.createView(Profile)
            ),
            virt.createView(Popover, {
                    style: styles.popover,
                    origin: {
                        vertical: "top",
                        horizontal: "right"
                    },
                    onRequestClose: this.onRequestClose,
                    open: this.state.open
                },
                virt.createView(SubNav)
            )
        )
    );
};