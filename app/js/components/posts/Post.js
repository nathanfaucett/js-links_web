var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    ListItem = require("virt-ui-list_item"),
    Link = require("virt-ui-link");


var PostPrototype;


module.exports = Post;


function Post(props, children, context) {
    virt.Component.call(this, props, children, context);
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

PostPrototype.getStyles = function() {
    var theme = this.context.theme,
        styles = {
            root: {
                fontSize: "0.75em",
                position: "relative"
            },
            link: {
                display: "block"
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
            virt.createView(Link, {
                    target: "_blank",
                    href: post.href,
                    style: styles.link
                },
                virt.createView("h2", {
                        style: styles.title
                    },
                    virt.createView("span", post.title),
                    virt.createView("span", {
                        style: styles.href
                    }, "(" + post.href + ")")
                )
            ),

            virt.createView("p", {
                style: styles.subjectLabel
            }, i18n("post.subject") + ": "),
            virt.createView("p", {
                style: styles.subject
            }, post.subject + ", "),

            virt.createView("p", {
                style: styles.tagsLabel
            }, i18n("post.tags") + ": "),
            virt.createView("p", {
                style: styles.tags
            }, post.tags.join(", "))
        )
    );
};