var virt = require("@nathanfaucett/virt"),
    trim = require("@nathanfaucett/trim"),
    propTypes = require("@nathanfaucett/prop_types"),
    arrayMap = require("@nathanfaucett/array-map"),
    TextField = require("virt-ui-text_field"),
    RaisedButton = require("virt-ui-raised_button"),
    capitalizeString = require("@nathanfaucett/capitalize_string"),
    app = require("../../app"),
    PostStore = require("../../stores/PostStore"),
    PostCreateStore = require("../../stores/PostCreateStore");


var reValidChars = /[a-zA-Z0-9-]+/g,
    reHref = /(\/?[\w-]+)(\/[\w-]+)*\/?|(((http|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/gi,
    PostCreatePrototype;


module.exports = PostCreate;


function PostCreate(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        title: PostCreateStore.get("title"),
        href: PostCreateStore.get("href"),
        subject: PostCreateStore.get("subject"),
        tags: PostCreateStore.get("tags")
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
    this.onPostCreate = function() {
        return _this._onPostCreate();
    };
}
virt.Component.extend(PostCreate, "PostCreate");

PostCreatePrototype = PostCreate.prototype;

PostCreate.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PostCreatePrototype.componentDidMount = function() {
    PostStore.on("onPostCreate", this.onPostCreate);
    PostCreateStore.addChangeListener(this.onInput);
};

PostCreatePrototype.componentWillUnmount = function() {
    PostStore.off("onPostCreate", this.onPostCreate);
    PostCreateStore.removeChangeListener(this.onInput);
};

function invalidHref(href) {
    return !reHref.test(href);
}

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

PostCreatePrototype._onSubmit = function(e) {
    var i18n = this.context.i18n,
        refs = this.refs,
        errors = false,
        title, href, subject, tags;

    e.preventDefault();

    title = trim(this.state.title);
    subject = cleanSubject(this.state.subject);
    href = trim(this.state.href);
    tags = cleanTags(this.state.tags);

    if (!title) {
        errors = true;
        refs.title.setErrorText(i18n("errors.post.invalid_title"));
    }
    if (invalidHref(href)) {
        errors = true;
        refs.href.setErrorText(i18n("errors.post.invalid_href"));
    }

    if (errors === false) {
        app.dispatchAction({
            type: PostStore.consts.CREATE,
            title: title,
            href: href,
            subject: subject,
            tags: tags
        });
    }
};

PostCreatePrototype._onPostCreate = function(errors) {
    if (!errors) {
        PostCreateStore.clear();
        app.page.go("/");
    }
};

PostCreatePrototype._onInput = function(name, value) {
    var state = {};
    state[name] = value;
    this.setState(state);
};

PostCreatePrototype._onChange = function(e) {
    var currentTarget = e.currentTarget,
        name = currentTarget.getAttribute("name"),
        value = currentTarget.value;

    app.dispatchAction({
        type: PostCreateStore.consts.CHANGE,
        name: name,
        value: value
    });
};

PostCreatePrototype.getStyles = function() {
    var styles = {
        root: {
            paddingTop: "8px",
            position: "relative",
            textAlign: "center"
        },
        submitDiv: {
            marginTop: "32px"
        }
    };

    return styles;
};

PostCreatePrototype.render = function() {
    var i18n = this.context.i18n,
        styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "PostCreate",
                style: styles.root
            },
            virt.createView("h2", null,
                i18n("post.create")
            ),
            virt.createView("form", {
                    className: "grid",
                    onSubmit: this.onSubmit
                },
                virt.createView("div", {
                        className: "title"
                    },
                    virt.createView(TextField, {
                        ref: "title",
                        type: "text",
                        name: "title",
                        value: this.state.title,
                        onChange: this.onChange,
                        placeholder: i18n("post.title")
                    })
                ),
                virt.createView("div", {
                        className: "subject"
                    },
                    virt.createView(TextField, {
                        ref: "subject",
                        type: "text",
                        name: "subject",
                        value: this.state.subject,
                        onChange: this.onChange,
                        placeholder: i18n("post.subject")
                    })
                ),
                virt.createView("div", {
                        className: "tags"
                    },
                    virt.createView(TextField, {
                        ref: "tags",
                        type: "text",
                        name: "tags",
                        value: this.state.tags,
                        onChange: this.onChange,
                        placeholder: i18n("post.tags")
                    })
                ),
                virt.createView("div", {
                        className: "href"
                    },
                    virt.createView(TextField, {
                        ref: "href",
                        type: "text",
                        name: "href",
                        value: this.state.href,
                        onChange: this.onChange,
                        placeholder: i18n("post.href")
                    })
                ),
                virt.createView("div", {
                        style: styles.submitDiv
                    },
                    virt.createView(RaisedButton, {
                        onClick: this.onSubmit
                    }, i18n("post.submit"))
                )
            )
        )
    );
};