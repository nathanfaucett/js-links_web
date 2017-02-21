var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    List = require("virt-ui-list"),
    TextField = require("virt-ui-text_field"),
    RaisedButton = require("virt-ui-raised_button"),
    capitalizeString = require("@nathanfaucett/capitalize_string"),
    app = require("../../app"),
    PostStore = require("../../stores/PostStore"),
    PostSearchStore = require("../../stores/PostSearchStore"),
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
    this.getPosts();
};

PostSearchPrototype.componentWillUnmount = function() {
    PostSearchStore.removeChangeListener(this.onInput);
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

PostSearchPrototype.getPosts = function() {
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
            virt.createView("div", {
                    className: "grid"
                },
                virt.createView("div", {
                        className: "col-xs-12 col-sm-6 col-md-4 col-lg-4"
                    },
                    virt.createView(TextField, {
                        ref: "subject",
                        type: "text",
                        name: "subject",
                        value: this.state.subject,
                        onChange: this.onChange,
                        placeholder: i18n("post.search.subject")
                    })
                ),
                virt.createView("div", {
                        className: "col-xs-12 col-sm-6 col-md-4 col-lg-4"
                    },
                    virt.createView(TextField, {
                        ref: "tags",
                        type: "text",
                        name: "tags",
                        value: this.state.tags,
                        onChange: this.onChange,
                        placeholder: i18n("post.search.tags")
                    })
                ),
                virt.createView("div", {
                        className: "col-xs-12 col-sm-12 col-md-4 col-lg-4"
                    },
                    virt.createView(RaisedButton, {
                        onClick: this.onSubmit
                    }, i18n("header.menu.search"))
                )
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