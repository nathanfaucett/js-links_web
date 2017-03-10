var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    extend = require("@nathanfaucett/extend"),
    List = require("virt-ui-list"),
    PostStore = require("../../stores/PostStore"),
    Pagination = require("../Pagination"),
    Post = require("./Post");


var PostNewestPrototype;


module.exports = PostNewest;


function PostNewest(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        page: 0,
        pageSize: 20,
        posts: []
    };

    this.getPosts = function() {
        return _this._getPosts();
    };
    this.onPostCreate = function(error, post) {
        return _this._onPostCreate(error, post);
    };
    this.onPostUpdate = function(error, post) {
        return _this._onPostUpdate(error, post);
    };
    this.onPostDelete = function(error, post) {
        return _this._onPostDelete(error, post);
    };

    this.onNextPage = function(e) {
        return _this._onNextPage(e);
    };
    this.onPrevPage = function(e) {
        return _this._onPrevPage(e);
    };
}
virt.Component.extend(PostNewest, "PostNewest");

PostNewestPrototype = PostNewest.prototype;

PostNewest.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostNewestPrototype.componentDidMount = function() {
    var _this = this;

    this._getPosts(function onFirstRender() {
        PostStore.on("onPostCreate", _this.onPostCreate);
        PostStore.on("onPostUpdate", _this.onPostUpdate);
        PostStore.on("onPostDelete", _this.onPostDelete);
    });
};
PostNewestPrototype.componentWillUnmount = function() {
    PostStore.off("onPostCreate", this.onPostCreate);
    PostStore.off("onPostUpdate", this.onPostUpdate);
    PostStore.off("onPostDelete", this.onPostDelete);
};

PostNewestPrototype._onNextPage = function() {
    this.setState({
        page: this.state.page + 1
    });
};
PostNewestPrototype._onPrevPage = function() {
    this.setState({
        page: this.state.page - 1
    });
};

PostNewestPrototype._onPostCreate = function(error, post) {
    var posts = this.state.posts;

    posts.unshift(post);

    this.setState({
        posts: posts
    });
};
PostNewestPrototype._onPostUpdate = function(error, post) {
    var posts = this.state.posts,
        i = -1,
        il = posts.length - 1;

    while (i++ < il) {
        p = posts[i];

        if (p.id === post.id) {
            extend(p, post);
            break;
        }
    }

    this.setState({
        posts: posts
    });
};
PostNewestPrototype._onPostDelete = function(error, post) {
    var posts = this.state.posts,
        i = -1,
        il = posts.length - 1;

    while (i++ < il) {
        p = posts[i];

        if (p.id === post.id) {
            break;
        }
    }

    posts.splice(i, 1);

    this.setState({
        posts: posts
    });
};

PostNewestPrototype._getPosts = function(callback) {
    var _this = this,
        state = this.state;

    PostStore.newest(state.page, state.pageSize, function(error, posts) {
        if (!error) {
            _this.setState({
                posts: posts
            }, callback);
        }
    });
};

PostNewestPrototype.getStyles = function() {
    var styles = {
        root: {
            position: "relative"
        }
    };

    return styles;
};

PostNewestPrototype.render = function() {
    var styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "PostNewest",
                style: styles.root
            },
            virt.createView(List,
                arrayMap(this.state.posts, function renderPost(post) {
                    return virt.createView(Post, {
                        post: post
                    });
                })
            ),
            virt.createView(Pagination, {
                page: this.state.page,
                onNext: this.onNextPage,
                onPrev: this.onPrevPage
            })
        )
    );
};