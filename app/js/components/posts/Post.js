var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
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
    var styles = {
        root: {
            display: "block",
            position: "relative"
        },
        title: {
            margin: "0px"
        },
        href: {
            fontSize: "0.5em",
            paddingLeft: "8px",
            margin: "0px"
        },
        subjectLabel: {
            display: "inline",
            margin: "0px"
        },
        subject: {
            display: "inline",
            margin: "0px"
        },
        tagsLabel: {
            display: "inline",
            margin: "0px"
        },
        tags: {
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
        virt.createView(Link, {
                className: "Post",
                target: "_blank",
                href: post.href,
                style: styles.root
            },
            virt.createView("h2", {
                    style: styles.title
                },
                virt.createView("span", post.title),
                virt.createView("span", {
                    style: styles.href
                }, "(" + post.href + ")")
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