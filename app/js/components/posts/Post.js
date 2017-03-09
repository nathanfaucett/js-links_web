var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    ListItem = require("virt-ui-list_item"),
    SVGIcon = require("virt-ui-svg_icon"),
    Link = require("virt-ui-link"),
    app = require("../../app"),
    UserStore = require("../../stores/UserStore"),
    PostStore = require("../../stores/PostStore");


var SVG_STAR = "M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z",
    PostPrototype;


module.exports = Post;


function Post(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.onStar = function(e) {
        return _this._onStar(e);
    };
}
virt.Component.extend(Post, "Post");

PostPrototype = Post.prototype;

Post.propTypes = {
    post: propTypes.object.isRequired
};

Post.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostPrototype._onStar = function() {
    if (UserStore.isSignedIn()) {
        app.dispatchAction({
            type: PostStore.consts.STAR,
            id: this.props.post.id
        });
    }
};

PostPrototype.getStyles = function() {
    var theme = this.context.theme,
        styles = {
            root: {
                fontSize: "0.75em",
                position: "relative"
            },
            starLink: {
                width: "16px",
                height: "14px",
                lineHeight: "8px",
                verticalAlign: "top",
                display: "inline-block"
            },
            titleLink: {
                display: "inline-block"
            },
            title: {
                fontSize: "1.5em",
                lineHeight: "1em",
                margin: "0px"
            },
            href: {
                fontSize: "0.75em",
                color: theme.palette.secondaryTextColor,
                paddingLeft: "8px",
                margin: "0px"
            },
            starCount: {
                fontSize: "0.9em",
                color: theme.palette.secondaryTextColor,
                display: "inline",
                margin: "0px"
            },
            subjectLabel: {
                fontSize: "0.9em",
                color: theme.palette.secondaryTextColor,
                display: "inline",
                margin: "0px"
            },
            subject: {
                fontSize: "0.9em",
                color: theme.palette.secondaryTextColor,
                display: "inline",
                margin: "0px"
            },
            tagsLabel: {
                fontSize: "0.9em",
                color: theme.palette.secondaryTextColor,
                display: "inline",
                margin: "0px"
            },
            tags: {
                fontSize: "0.9em",
                color: theme.palette.secondaryTextColor,
                display: "inline",
                margin: "0px"
            },
            info: {
                paddingTop: "8px",
                display: "block"
            },
            starsDiv: {
                paddingRight: "0px",
                display: "inline-block"
            },
            starCountDiv: {
                paddingRight: "8px",
                display: "inline-block"
            },
            subjectDiv: {
                paddingRight: "8px",
                display: "inline-block"
            },
            tagsDiv: {
                display: "inline-block"
            }
        };

    return styles;
};

PostPrototype.render = function() {
    var post = this.props.post,
        i18n = this.context.i18n,
        styles = this.getStyles();

    return (
        virt.createView(ListItem, {
                className: "Post",
                style: styles.root
            },
            virt.createView("div",
                virt.createView(Link, {
                        target: "_blank",
                        href: post.href,
                        style: styles.titleLink
                    },
                    virt.createView("h2", {
                            style: styles.title
                        },
                        virt.createView("span", post.title),
                        virt.createView("span", {
                            style: styles.href
                        }, "(" + post.href + ")")
                    )
                )
            ),
            virt.createView("div", {
                    style: styles.info
                },
                virt.createView("div", {
                        style: styles.starsDiv
                    },
                    virt.createView(SVGIcon, {
                            onClick: this.onStar,
                            style: styles.starLink
                        },
                        virt.createView("path", {
                            d: SVG_STAR
                        })
                    )
                ),
                virt.createView("div", {
                        style: styles.starCountDiv
                    },
                    virt.createView("p", {
                        style: styles.starCount
                    }, post.stars)
                ),
                virt.createView("div", {
                        style: styles.subjectDiv
                    },
                    virt.createView("p", {
                        style: styles.subjectLabel
                    }, i18n("post.subject") + ": "),
                    virt.createView("p", {
                        style: styles.subject
                    }, post.subject + ", ")
                ),
                virt.createView("div", {
                        style: styles.tagsDiv
                    },
                    virt.createView("p", {
                        style: styles.tagsLabel
                    }, i18n("post.tags") + ": "),
                    virt.createView("p", {
                        style: styles.tags
                    }, post.tags.join(", "))
                )
            )
        )
    );
};