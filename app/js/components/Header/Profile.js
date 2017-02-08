var virt = require("@nathanfaucett/virt"),
    Gravatar = require("@nathanfaucett/virt-gravatar"),
    propTypes = require("@nathanfaucett/prop_types"),
    UserStore = require("../../stores/UserStore");


var ProfilePrototype;


module.exports = Profile;


function Profile(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Profile, "Profile");

ProfilePrototype = Profile.prototype;

Profile.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

ProfilePrototype.getStyles = function() {
    var styles = {
        root: {
            display: "inline-block",
            width: "256px",
            padding: "8px"
        },
        img: {
            verticalAlign: "top"
        },
        email: {
            display: "inline-block",
            fontSize: "16px",
            lineHeight: "16px",
            margin: "0px",
            padding: "8px 0px 8px 8px"
        }
    };

    return styles;
};

ProfilePrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "Profile",
                style: styles.root
            },
            virt.createView(Gravatar, {
                style: styles.img,
                size: 32,
                email: UserStore.user.email
            }),
            virt.createView("p", {
                style: styles.email
            }, UserStore.user.email)
        )
    );
};