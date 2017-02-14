var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    Link = require("virt-ui-link"),
    TextField = require("virt-ui-text_field");


var MENU_ITEMS = [{
        name: "header.menu.home",
        href: "/"
    }, {
        name: "header.menu.latest",
        href: "/latest"
    }, {
        name: "header.menu.create",
        href: "/posts/create"
    }],
    MenuPrototype;


module.exports = Menu;


function Menu(props, children, context) {

    virt.Component.call(this, props, children, context);

    this.state = {
        menuItems: MENU_ITEMS
    };
}
virt.Component.extend(Menu, "Menu");

MenuPrototype = Menu.prototype;

Menu.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

MenuPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "left",
            position: "relative"
        },
        menuItem: {
            display: "inline",
            paddingRight: "16px"
        }
    };

    return styles;
};

MenuPrototype.render = function() {
    var i18n = this.context.i18n,
        styles = this.getStyles(),
        children = arrayMap(this.state.menuItems, function each(menuItem) {
            return virt.createView(Link, {
                    style: styles.menuItem,
                    href: menuItem.href
                },
                i18n(menuItem.name)
            );
        });

    children.push(virt.createView("div", {
            style: styles.menuItem
        },
        virt.createView(TextField, {
            ref: "search",
            type: "text",
            name: "search",
            value: this.state.search,
            onChange: this.onChange,
            placeholder: i18n("header.menu.search")
        })
    ));

    return (
        virt.createView("div", {
                className: "Menu",
                style: styles.root
            },
            children
        )
    );
};