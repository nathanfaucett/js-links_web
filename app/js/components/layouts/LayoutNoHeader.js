var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    Footer = require("../Footer");


var LayoutNoHeaderPrototype;


module.exports = LayoutNoHeader;


function LayoutNoHeader(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(LayoutNoHeader, "LayoutNoHeader");
LayoutNoHeaderPrototype = LayoutNoHeader.prototype;

LayoutNoHeader.propTypes = {
    ctx: propTypes.object.isRequired,
    i18n: propTypes.func.isRequired,
    render: propTypes.func.isRequired
};

LayoutNoHeader.contextTypes = {
    theme: propTypes.object.isRequired
};

LayoutNoHeader.childContextTypes = {
    ctx: propTypes.object.isRequired,
    i18n: propTypes.func.isRequired
};

LayoutNoHeaderPrototype.getChildContext = function() {
    return {
        ctx: this.props.ctx,
        i18n: this.props.i18n
    };
};

LayoutNoHeaderPrototype.getStyles = function() {
    var theme = this.context.theme,
        styles = {
            background: {
                background: theme.palette.canvasColor
            }
        };

    return styles;
};

LayoutNoHeaderPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "LayoutNoHeader",
                style: styles.background
            },
            this.props.render(this.props.ctx),
            virt.createView(Footer)
        )
    );
};