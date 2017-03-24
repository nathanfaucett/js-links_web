var virt = require("@nathanfaucett/virt"),
    css = require("@nathanfaucett/css"),
    propTypes = require("@nathanfaucett/prop_types"),
    request = require("@nathanfaucett/request"),
    Link = require("virt-ui-link"),
    RaisedButton = require("virt-ui-raised_button"),
    app = require("../../app"),
    UserStore = require("../../stores/UserStore");


var SignInPrototype;


module.exports = SignIn;


function SignIn(props, context) {
    var _this = this;

    virt.Component.call(this, props, context);

    this.onSignIn = function(errors) {
        return _this._onSignIn(errors);
    };
    this.signInWithGoogle = function(e) {
        return _this._signInWithGoogle(e);
    };
    this.signInWithGithub = function(e) {
        return _this._signInWithGithub(e);
    };
}
virt.Component.extend(SignIn, "SignIn");
SignInPrototype = SignIn.prototype;

SignIn.contextTypes = {
    i18n: propTypes.func.isRequired
};

SignInPrototype.componentDidMount = function() {
    UserStore.on("onSignIn", this.onSignIn);
};

SignInPrototype.componentWillUnmount = function() {
    UserStore.off("onSignIn", this.onSignIn);
};

SignInPrototype._signInWith = function(provider) {
    request.get(app.config.baseUrl + "/users/" + provider, {
        success: function(response) {
            var newWindow = window.open(
                response.data.data,
                "_blank",
                "location=yes,height=512,width=512,scrollbars=yes,status=yes"
            );

            function onMessage(event) {
                var data = JSON.parse(event.data);

                switch (data.type) {
                    case "load":
                        newWindow.postMessage(JSON.stringify({
                            type: "provider",
                            provider: provider
                        }), app.config.appUrl);
                        break;
                    case "success":
                        window.removeEventListener("message", onMessage);
                        app.dispatchAction({
                            type: UserStore.consts.OAUTH_SIGN_IN,
                            user: data.user
                        });
                        break;
                    case "error":
                        window.removeEventListener("message", onMessage);
                        app.dispatchAction({
                            type: UserStore.consts.OAUTH_SIGN_IN,
                            error: data.error
                        });
                        break;
                }
            }
            window.addEventListener("message", onMessage, false);
        },
        error: function(response) {
            app.dispatchAction({
                type: UserStore.consts.OAUTH_SIGN_IN,
                error: response.data
            });
        }
    });
};
SignInPrototype._signInWithGoogle = function() {
    this._signInWith("google");
};
SignInPrototype._signInWithGithub = function() {
    this._signInWith("github");
};

SignInPrototype._onSignIn = function(errors) {
    if (!errors) {
        app.page.go("/");
    }
};

SignInPrototype.getStyles = function() {
    var styles = {
        root: {
            textAlign: "center",
            padding: "16px",
            background: css.colors.white
        },
        btnImage: {
            width: "20px",
            height: "20px",
            position: "absolute",
            left: "8px",
            top: "8px"
        },
        divBtn: {
            marginBottom: "16px"
        },
        googleBtn: {
            width: "256px",
            backgroundColor: css.colors.white
        },
        googleBtnSpan: {
            fontWeight: "bold",
            textTransform: "none",
            color: "#757575"
        },
        githubBtn: {
            width: "256px",
            backgroundColor: "#24292e"
        },
        githubBtnSpan: {
            fontWeight: "bold",
            textTransform: "none",
            color: css.colors.white
        }
    };

    return styles;
};

SignInPrototype.render = function() {
    var styles = this.getStyles(),
        i18n = this.context.i18n;

    return (
        virt.createView("div", {
                className: "Sign in",
                style: styles.root
            },
            virt.createView("h2", null,
                i18n("sign_in.sign_in")
            ),
            virt.createView("p", null,
                i18n("sign_in.skip_sign_in") + " ",
                virt.createView(Link, {
                        href: "/"
                    },
                    i18n("sign_in.home")
                )
            ),
            virt.createView("div", {
                    style: styles.divBtn
                },
                virt.createView(RaisedButton, {
                        style: styles.googleBtn,
                        onClick: this.signInWithGoogle
                    },
                    virt.createView("img", {
                        style: styles.btnImage,
                        src: "img/google.png"
                    }),
                    virt.createView("span", {
                        style: styles.googleBtnSpan
                    }, i18n("sign_in.sign_in_with_google"))
                )
            ),
            virt.createView("div", {
                    style: styles.divBtn
                },
                virt.createView(RaisedButton, {
                        style: styles.githubBtn,
                        onClick: this.signInWithGithub
                    },
                    virt.createView("img", {
                        style: styles.btnImage,
                        src: "img/github.png"
                    }),
                    virt.createView("span", {
                        style: styles.githubBtnSpan
                    }, i18n("sign_in.sign_in_with_github"))
                )
            )
        )
    );
};