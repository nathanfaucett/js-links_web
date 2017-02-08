var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types");


var HomePrototype;


module.exports = Home;


function Home(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Home, "Home");

HomePrototype = Home.prototype;

Home.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

HomePrototype.getStyles = function() {
    var styles = {
        root: {
            marginTop: "48px",
            position: "relative"
        }
    };

    return styles;
};

HomePrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
            className: "Home",
            style: styles.root
        })
    );
};