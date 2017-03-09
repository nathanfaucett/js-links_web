var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types");


var HeaderOffsetPrototype;


module.exports = HeaderOffset;


function HeaderOffset(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(HeaderOffset, "HeaderOffset");
HeaderOffsetPrototype = HeaderOffset.prototype;

HeaderOffset.contextTypes = {
    size: propTypes.object.isRequired
};

HeaderOffsetPrototype.getStyles = function() {
    var size = this.context.size,
        styles = {
            root: {
                marginTop: "48px"
            }
        };

    if (size.width < 640) {
        styles.root.marginTop = "80px";
    }

    return styles;
};

HeaderOffsetPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "HeaderOffset",
                style: styles.root
            },
            this.children
        )
    );
};