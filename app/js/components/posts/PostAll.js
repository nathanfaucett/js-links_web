var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    PostStore = require("../../stores/PostStore"),
    Post = require("./Post");


var PostAllPrototype;


module.exports = PostAll;


function PostAll(props, children, context) {
    virt.Component.call(this, props, children, context);

    this.state = {
        page: 0,
        pageSize: 20,
        posts: []
    };
}
virt.Component.extend(PostAll, "PostAll");

PostAllPrototype = PostAll.prototype;

PostAll.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostAllPrototype.componentDidMount = function() {
    this.getPosts();
};

PostAllPrototype.getPosts = function() {
    var _this = this,
        state = this.state;

    PostStore.all(state.page, state.pageSize, function(error, posts) {
        if (!error) {
            _this.setState({
                posts: posts
            });
        }
    });
};

PostAllPrototype.getStyles = function() {
    var styles = {
        root: {
            position: "relative"
        }
    };

    return styles;
};

PostAllPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "PostAll",
                style: styles.root
            },
            arrayMap(this.state.posts, function renderPost(post) {
                return virt.createView(Post, {
                    post: post
                });
            })
        )
    );
};