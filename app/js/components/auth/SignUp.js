var virt = require("@nathanfaucett/virt"),
    trim = require("@nathanfaucett/trim"),
    css = require("@nathanfaucett/css"),
    propTypes = require("@nathanfaucett/prop_types"),
    Link = require("virt-ui-link"),
    TextField = require("virt-ui-text_field"),
    RaisedButton = require("virt-ui-raised_button"),
    UserStore = require("../../stores/UserStore"),
    app = require("../../app"),
    SignUpStore = require("../../stores/auth/SignUpStore");


var SignUpPrototype;


module.exports = SignUp;


function SignUp(props, context) {
    var _this = this;

    virt.Component.call(this, props, context);

    this.state = {
        email: SignUpStore.get("email"),
        password: SignUpStore.get("password"),
        confirmPassword: SignUpStore.get("confirmPassword")
    };

    this.onSignUp = function(errors) {
        _this._onSignUp(errors);
    };

    this.onSubmit = function(e) {
        _this._onSubmit(e);
    };

    this.onInput = function(name, value) {
        _this._onInput(name, value);
    };

    this.onChange = function(e) {
        _this._onChange(e);
    };
}
virt.Component.extend(SignUp, "SignUp");
SignUpPrototype = SignUp.prototype;

SignUp.contextTypes = {
    i18n: propTypes.func.isRequired
};

SignUpPrototype.componentDidMount = function() {
    UserStore.on("onSignUp", this.onSignUp);
    SignUpStore.addChangeListener(this.onInput);
};

SignUpPrototype.componentWillUnmount = function() {
    UserStore.off("onSignUp", this.onSignUp);
    SignUpStore.removeChangeListener(this.onInput);
};

SignUpPrototype._onSubmit = function(e) {
    var i18n = this.context.i18n,
        refs = this.refs,
        errors = false,
        email, password, confirmPassword;

    e.preventDefault();

    email = trim(this.state.email);
    password = trim(this.state.password);
    confirmPassword = trim(this.state.confirmPassword);

    if (!email) {
        errors = true;
        refs.email.setErrorText(i18n("errors.sign_up.invalid_email"));
    }
    if (!password) {
        errors = true;
        refs.password.setErrorText(i18n("errors.sign_up.invalid_password"));
    }
    if (password !== confirmPassword) {
        errors = true;
        refs.confirmPassword.setErrorText(i18n("errors.sign_up.invalid_confirm_password"));
    }

    if (errors === false) {
        app.dispatchAction({
            type: UserStore.consts.SIGN_UP,
            email: email,
            password: password
        });
    }
};

SignUpPrototype._onSignUp = function(errors) {
    if (!errors) {
        app.page.go("/");
    }
};

SignUpPrototype._onInput = function(name, value) {
    var state = {};
    state[name] = value;
    this.setState(state);
};

SignUpPrototype._onChange = function(e) {
    var currentTarget = e.currentTarget,
        name = currentTarget.getAttribute("name"),
        value = currentTarget.value;

    app.dispatchAction({
        type: SignUpStore.consts.CHANGE,
        name: name,
        value: value
    });
};

SignUpPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "center",
            padding: "16px",
            background: css.colors.white
        },
        lastInput: {
            marginBottom: "24px"
        }
    };

    return styles;
};

SignUpPrototype.render = function() {
    var styles = this.getStyles(),
        i18n = this.context.i18n;

    return (
        virt.createView("div", {
                className: "Sign up",
                style: styles.root
            },
            virt.createView("h2", null,
                i18n("sign_up.sign_up")
            ),
            virt.createView("p", null,
                i18n("sign_up.already_member") + " ",
                virt.createView(Link, {
                        href: "/sign_in"
                    },
                    i18n("sign_up.sign_in")
                )
            ),
            virt.createView("p", null,
                i18n("sign_up.skip_sign_up") + " ",
                virt.createView(Link, {
                        href: "/"
                    },
                    i18n("sign_up.home")
                )
            ),
            virt.createView("form", {
                    className: "grid",
                    onSubmit: this.onSubmit
                },
                virt.createView("div", {
                        className: "email"
                    },
                    virt.createView(TextField, {
                        ref: "email",
                        name: "email",
                        type: "text",
                        value: this.state.email,
                        onChange: this.onChange,
                        placeholder: i18n("sign_up.email")
                    })
                ),
                virt.createView("div", {
                        className: "password"
                    },
                    virt.createView(TextField, {
                        ref: "password",
                        name: "password",
                        type: "password",
                        value: this.state.password,
                        onChange: this.onChange,
                        placeholder: i18n("sign_up.password")
                    })
                ),
                virt.createView("div", {
                        className: "confirm-password",
                        style: styles.lastInput
                    },
                    virt.createView(TextField, {
                        ref: "confirmPassword",
                        name: "confirmPassword",
                        type: "password",
                        value: this.state.confirmPassword,
                        onChange: this.onChange,
                        placeholder: i18n("sign_up.confirm_password")
                    })
                ),
                virt.createView(RaisedButton, {
                    onClick: this.onSubmit
                }, i18n("sign_up.sign_up"))
            )
        )
    );
};