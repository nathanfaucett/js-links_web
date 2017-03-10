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
            _this.emitChange();
            _this.emit(name, error, value);
        };
    };
}
Store.extend(PostStore, "links.PostStore", [
    "CREATE",
    "UPDATE",
    "STAR"
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
        offset: page * pageSize,
        order_by_stars: true
    }), {
        success: function(response) {
            callback(undefined, response.data.data);
        },
        error: function(response) {
            callback(response.data);
        }
    });
};

PostStorePrototype.search = function(subject, tags, page, pageSize, callback) {
    request.get(app.config.baseUrl + "/posts?" + qs.stringify({
        page_size: pageSize,
        offset: page * pageSize,
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

PostStorePrototype.newest = function(page, pageSize, callback) {
    request.get(app.config.baseUrl + "/posts?" + qs.stringify({
        page_size: pageSize,
        offset: page * pageSize,
        order_by_stars: false
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

PostStorePrototype.star = function(id, callback) {
    request.post(app.config.baseUrl + "/posts/" + id + "/star", null, {
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
        case this.consts.STAR:
            this.star(action.id, this.createChangeCallback("onPostStar"));
            break;
    }
};


app.on("init", function onAppInit() {
    var PostStore = module.exports;

    app.on("posts:create", function onPostCreate(post) {
        PostStore.emit("onPostCreate", undefined, post);
    });
    app.on("posts:update", function onPostUpdate(post) {
        PostStore.emit("onPostUpdate", undefined, post);
    });
    app.on("posts:delete", function onPostCreate(post) {
        PostStore.emit("onPostDelete", undefined, post);
    });
});


module.exports = new PostStore();