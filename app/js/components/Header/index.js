var virt = require("@nathanfaucett/virt"),
    css = require("@nathanfaucett/css"),
    propTypes = require("@nathanfaucett/prop_types"),
    Nav = require("./Nav"),
    Wrapper = require("../Wrapper");


var HeaderPrototype;


module.exports = Header;


function Header(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Header, "Header");

HeaderPrototype = Header.prototype;

Header.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

HeaderPrototype.getStyles = function() {
    var theme = this.context.theme,
        styles = {
            root: {
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                zIndex: 1000,
                backgroundColor: theme.palette.canvasColor
            }
        };

    css.boxShadow(styles.root, "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)");

    return styles;
};

HeaderPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "Header grid",
                style: styles.root
            },
            virt.createView(Wrapper,
                virt.createView(Nav)
            )
        )
    );
};