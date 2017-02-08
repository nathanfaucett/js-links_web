var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    Menu = require("virt-ui-menu"),
    MenuItem = require("virt-ui-menu_item"),
    FontIcon = require("virt-ui-font_icon"),
    app = require("../../app");


var SubNavPrototype;


module.exports = SubNav;


function SubNav(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(SubNav, "SubNav");

SubNavPrototype = SubNav.prototype;

SubNav.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

SubNavPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "left"
        },
        menuItemP: {
            fontSize: "1em",
            lineHeight: "1em",
            margin: "0px"
        }
    };

    return styles;
};

SubNavPrototype.createOnClick = function(href) {
    return function onClick() {
        app.page.go(href);
    };
};

SubNavPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "SubNav",
                style: styles.root
            },
            virt.createView(Menu,
                virt.createView(MenuItem, {
                        onClick: this.createOnClick("/sign_out"),
                        rightIcon: virt.createView(FontIcon, {
                            className: "material-icons"
                        }, "power_settings_new")
                    },
                    virt.createView("p", {
                        style: styles.menuItemP
                    }, "Sign out")
                )
            )
        )
    );
};