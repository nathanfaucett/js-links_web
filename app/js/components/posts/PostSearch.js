var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    List = require("virt-ui-list"),
    TextField = require("virt-ui-text_field"),
    RaisedButton = require("virt-ui-raised_button"),
    Post = require("./Post");


var PostSearchPrototype;


module.exports = PostSearch;


function PostSearch(props, children, context) {
    virt.Component.call(this, props, children, context);

    this.state = {
        posts: []
    };
}
virt.Component.extend(PostSearch, "PostSearch");

PostSearchPrototype = PostSearch.prototype;

PostSearch.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostSearchPrototype.componentDidMount = function() {};

PostSearchPrototype.getStyles = function() {
    var styles = {
        root: {
            position: "relative"
        }
    };

    return styles;
};

PostSearchPrototype.render = function() {
    var i18n = this.context.i18n,
        styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "PostSearch",
                style: styles.root
            },
            virt.createView("div",
                virt.createView(TextField, {
                    ref: "subject",
                    type: "text",
                    name: "subject",
                    value: this.state.subject,
                    onChange: this.onChange,
                    placeholder: i18n("post.search.subject")
                })
            ),
            virt.createView("div",
                virt.createView(TextField, {
                    ref: "tags",
                    type: "text",
                    name: "tags",
                    value: this.state.tags,
                    onChange: this.onChange,
                    placeholder: i18n("post.search.tags")
                })
            ),
            virt.createView("div",
                virt.createView(RaisedButton, {
                    onClick: this.onSubmit
                }, i18n("header.menu.search"))
            ),
            virt.createView(List,
                arrayMap(this.state.posts, function renderPost(post) {
                    return virt.createView(Post, {
                        post: post
                    });
                })
            )
        )
    );
};