var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    extend = require("@nathanfaucett/extend"),
    List = require("virt-ui-list"),
    TextField = require("virt-ui-text_field"),
    RaisedButton = require("virt-ui-raised_button"),
    capitalizeString = require("@nathanfaucett/capitalize_string"),
    app = require("../../app"),
    PostStore = require("../../stores/PostStore"),
    PostSearchStore = require("../../stores/PostSearchStore"),
    Pagination = require("../Pagination"),
    Post = require("./Post");


var reValidChars = /[a-zA-Z0-9-]+/g,
    PostSearchPrototype;


module.exports = PostSearch;


function PostSearch(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        page: 0,
        pageSize: 20,
        subject: PostSearchStore.get("subject"),
        tags: PostSearchStore.get("tags"),
        searchSubject: PostSearchStore.get("subject"),
        searchTags: [],
        posts: []
    };

    this.onInput = function(name, value) {
        return _this._onInput(name, value);
    };
    this.onChange = function(e) {
        return _this._onChange(e);
    };
    this.onSubmit = function(e) {
        return _this._onSubmit(e);
    };
    this.onPostSearch = function() {
        return _this._onPostSearch();
    };

    this.onNextPage = function(e) {
        return _this._onNextPage(e);
    };
    this.onPrevPage = function(e) {
        return _this._onPrevPage(e);
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
}
virt.Component.extend(PostSearch, "PostSearch");

PostSearchPrototype = PostSearch.prototype;

PostSearch.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostSearchPrototype.componentDidMount = function() {
    PostSearchStore.addChangeListener(this.onInput);
    PostStore.on("onPostCreate", this.onPostCreate);
    PostStore.on("onPostUpdate", this.onPostUpdate);
    PostStore.on("onPostDelete", this.onPostDelete);
    this._getPosts();
};

PostSearchPrototype.componentWillUnmount = function() {
    PostSearchStore.removeChangeListener(this.onInput);
    PostStore.off("onPostCreate", this.onPostCreate);
    PostStore.off("onPostUpdate", this.onPostUpdate);
    PostStore.off("onPostDelete", this.onPostDelete);
};

function cleanSubject(subject) {
    if (subject) {
        return arrayMap(
            subject.match(reValidChars),
            capitalizeString
        ).join(" ");
    } else {
        return "";
    }
}

function cleanTags(tags) {
    if (tags) {
        return arrayMap(
            tags.match(reValidChars),
            capitalizeString
        );
    } else {
        return [];
    }
}

PostSearchPrototype._onSubmit = function(e) {
    var _this = this;

    e.preventDefault();

    this.setState({
        searchSubject: cleanSubject(this.state.subject),
        searchTags: cleanTags(this.state.tags)
    }, function onSetState() {
        _this.getPosts();
    });
};

PostSearchPrototype._onInput = function(name, value) {
    var state = {};
    state[name] = value;
    this.setState(state);
};

PostSearchPrototype._onChange = function(e) {
    var currentTarget = e.currentTarget,
        name = currentTarget.getAttribute("name"),
        value = currentTarget.value;

    app.dispatchAction({
        type: PostSearchStore.consts.CHANGE,
        name: name,
        value: value
    });
};

PostSearchPrototype._onPostCreate = function(error, post) {
    var posts = this.state.posts;

    posts.unshift(post);

    this.setState({
        posts: posts
    });
};
PostSearchPrototype._onPostUpdate = function(error, post) {
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
PostSearchPrototype._onPostDelete = function(error, post) {
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

PostSearchPrototype._onNextPage = function() {
    this.setState({
        page: this.state.page + 1
    });
};
PostSearchPrototype._onPrevPage = function() {
    this.setState({
        page: this.state.page - 1
    });
};

PostSearchPrototype._getPosts = function() {
    var _this = this,
        state = this.state;

    PostStore.search(
        state.searchSubject, state.searchTags, state.page, state.pageSize,
        function onSearch(error, posts) {
            if (!error) {
                _this.setState({
                    posts: posts
                });
            }
        }
    );
};

PostSearchPrototype.getStyles = function() {
    var size = this.context.size,
        styles = {
            root: {
                position: "relative"
            },
            subjectDiv: {
                padding: "0px 8px 0px 8px",
                textAlign: "center"
            },
            subject: {
                width: "100%"
            },
            tagsDiv: {
                padding: "0px 8px 0px 8px",
                textAlign: "center"
            },
            tags: {
                width: "100%"
            },
            submitDiv: {
                paddingTop: "8px",
                paddingLeft: "8px",
                textAlign: "left"
            },
            submit: {}
        };

    if (size.width < 640) {
        styles.tagsDiv.padding = "0px";
        styles.subjectDiv.padding = "0px";
    }

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
            virt.createView("div", {
                    className: "grid"
                },
                virt.createView("div", {
                        className: "col-xs-12 col-sm-12 col-md-6 col-lg-4"
                    },
                    virt.createView("div", {
                            style: styles.subjectDiv
                        },
                        virt.createView(TextField, {
                            style: styles.subject,
                            ref: "subject",
                            type: "text",
                            name: "subject",
                            value: this.state.subject,
                            onChange: this.onChange,
                            placeholder: i18n("post.search.subject")
                        })
                    )
                ),
                virt.createView("div", {
                        className: "col-xs-12 col-sm-12 col-md-6 col-lg-4"
                    },
                    virt.createView("div", {
                            style: styles.tagsDiv
                        },
                        virt.createView(TextField, {
                            style: styles.tags,
                            ref: "tags",
                            type: "text",
                            name: "tags",
                            value: this.state.tags,
                            onChange: this.onChange,
                            placeholder: i18n("post.search.tags")
                        })
                    )
                ),
                virt.createView("div", {
                        className: "col-xs-12 col-sm-12 col-md-12 col-lg-4"
                    },
                    virt.createView("div", {
                            style: styles.submitDiv
                        },
                        virt.createView(RaisedButton, {
                            style: styles.submit,
                            onClick: this.onSubmit
                        }, i18n("header.menu.search"))
                    )
                )
            ),
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