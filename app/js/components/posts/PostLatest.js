var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    List = require("virt-ui-list"),
    PostStore = require("../../stores/PostStore"),
    Post = require("./Post");


var PostLatestPrototype;


module.exports = PostLatest;


function PostLatest(props, children, context) {
    virt.Component.call(this, props, children, context);

    this.state = {
        page: 0,
        pageSize: 20,
        posts: []
    };
}
virt.Component.extend(PostLatest, "PostLatest");

PostLatestPrototype = PostLatest.prototype;

PostLatest.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostLatestPrototype.componentDidMount = function() {
    this.getPosts();
};

PostLatestPrototype.getPosts = function() {
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

PostLatestPrototype.getStyles = function() {
    var styles = {
        root: {
            position: "relative"
        }
    };

    return styles;
};

PostLatestPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "PostLatest",
                style: styles.root
            },
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