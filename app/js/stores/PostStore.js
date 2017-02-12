var apt = require("@nathanfaucett/apt"),
    request = require("@nathanfaucett/request"),
    qs = require("@nathanfaucett/qs"),
    app = require("../app");


var Store = apt.Store,
    PostStorePrototype;


function PostStore() {
    var _this = this;

    Store.call(this);

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

PostStorePrototype.all = function(page, pageSize, callback) {
    request.get(app.config.baseUrl + "/posts?" + qs.stringify({
        page_size: pageSize,
        offset: page * pageSize
    }), {
        success: function(response) {
            callback(undefined, response.data.data);
        },
        error: function(response) {
            callback(response.data);
        }
    });
};

PostStorePrototype.search = function(subject, tags, callback) {
    request.get(app.config.baseUrl + "/posts?" + qs.stringify({
        subject: subject,
        tags: tags
    }), {
        success: function(response) {
            callback(undefined, response.data.data);
        },
        error: function(response) {
            callback(response.data);
        }
    });
};

PostStorePrototype.create = function(data, callback) {
    request.post(app.config.baseUrl + "/posts", {
        post: data
    }, {
        success: function(response) {
            callback(undefined, response.data.data);
        },
        error: function(response) {
            callback(response.data);
        }
    });
};

PostStorePrototype.update = function(id, data, callback) {
    request.patch(app.config.baseUrl + "/posts/" + id, {
        post: data
    }, {
        success: function(response) {
            callback(undefined, response.data.data);
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
            this.update(action.id, {
                title: action.title,
                subject: action.subject,
                tags: action.tags,
                href: action.href
            }, this.createChangeCallback("onPostUpdate"));
            break;
    }
};


module.exports = new PostStore();