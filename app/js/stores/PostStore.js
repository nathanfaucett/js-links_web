var apt = require("@nathanfaucett/apt"),
    request = require("@nathanfaucett/request"),
    app = require("../app");


var Store = apt.Store,
    PostStorePrototype;


function PostStore() {

    Store.call(this);

    this.posts = {};

    this.createChangeCallback = function(name) {
        return function onChange(error, value) {
            _this.emit(name, error, value);
        };
    };
}
Store.extend(PostStore, "links.PostStore", [
    "CREATE",
    "UPDATE"
]);
PostStorePrototype = PostStore.prototype;

PostStorePrototype.toJSON = function() {
    return {};
};

PostStorePrototype.fromJSON = function( /* json */ ) {
    return {};
};

PostStorePrototype.create = function(data, callback) {
    var _this = this;

    request.post(app.config.baseUrl + "/posts", {
        post: data
    }, {
        success: function(response) {
            var post = response.data;
            _this.posts[post.id] = post;
        },
        error: function(response) {
            callback(response.data);
        }
    });
};

PostStorePrototype.handler = function(action) {
    switch (action.type) {
        case this.consts.CREATE:
            this.create({
                title: action.title,
                subject: action.subject,
                tags: action.tags,
                href: action.href
            }, this.createChangeCallback("onPostCreate"));
            break;
        case this.consts.UPDATE:
            this.update({
                id: action.id,
                title: action.title,
                subject: action.subject,
                tags: action.tags,
                href: action.href
            }, this.createChangeCallback("onPostUpdate"));
            break;
    }
};


module.exports = new PostStore();