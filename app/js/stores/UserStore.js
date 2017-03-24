var apt = require("@nathanfaucett/apt"),
    extend = require("@nathanfaucett/extend"),
    indexOf = require("@nathanfaucett/index_of"),
    emptyFunction = require("@nathanfaucett/empty_function"),
    request = require("@nathanfaucett/request"),
    HEADER_LOCALE = require("../consts/HEADER_LOCALE"),
    HEADER_TOKEN = require("../consts/HEADER_TOKEN"),
    app = require("../app");


var Store = apt.Store,

    emptyUser = {
        token: null,
        email: ""
    },

    UserStorePrototype, defaultLocale, userStore;


function UserStore() {
    var _this = this;

    Store.call(this);

    this.user = extend({
        locale: "en"
    }, emptyUser);

    this.createChangeCallback = function(name) {
        return function onChange(error, value) {
            _this.emit(name, error, value);
        };
    };
}
Store.extend(UserStore, "links.UserStore", [
    "OAUTH_SIGN_IN",
    "CHANGE_LOCALE",
    "SIGN_OUT"
]);
UserStorePrototype = UserStore.prototype;


function deleteUser(user) {
    app.removeCookie(HEADER_TOKEN);
    delete request.defaults.headers[HEADER_TOKEN];
    return user;
}

UserStorePrototype.toJSON = function() {
    return {
        user: this.user
    };
};

UserStorePrototype.fromJSON = function(json) {
    this.user.locale = json.user.locale || defaultLocale;
};

UserStorePrototype.setLocale = function(value, callback) {
    var changed = UserStore_setLocale(_this, value);
    (callback || emptyFunction)();
    return changed;
};

function UserStore_setLocale(_this, value) {
    var last = _this.user.locale;

    value = indexOf(app.config.locales, value) === -1 ? app.config.locales[0] : value;
    request.defaults.headers[HEADER_LOCALE] = value;

    if (last !== value) {
        _this.user.locale = value;
        app.setLocale(value);
        return true;
    } else {
        return false;
    }
}

UserStorePrototype.isSignedIn = function() {
    return this.user.token !== null;
};

function UserStore_signUserIn(_this, data_user, callback) {
    var user = extend(_this.user, data_user);

    request.defaults.headers[HEADER_TOKEN] = user.token;

    app.setCookie(HEADER_TOKEN, user.token, function onSetCookie(error) {
        if (error) {
            callback(error);
        } else {
            callback(undefined, user);
        }
    });
}

UserStorePrototype.signInWithApiToken = function(data, callback) {
    var _this = this;

    request.defaults.headers[HEADER_TOKEN] = data.token;

    request.get(app.config.baseUrl + "/users/create_from_token", {
        success: function(response) {
            UserStore_signUserIn(_this, response.data, callback);
        },
        error: function(response) {
            delete request.defaults.headers[HEADER_TOKEN];
            callback(response.data);
        }
    });
};

UserStorePrototype.oauthSignIn = function(error, user, callback) {
    if (error) {
        delete request.defaults.headers[HEADER_TOKEN];
        callback(error);
    } else {
        UserStore_signUserIn(this, user, callback);
    }
};

UserStorePrototype.signUserOut = function(callback) {
    var user = extend(this.user, emptyUser);

    function removeCookie() {

        deleteUser(user);

        app.removeCookie(HEADER_TOKEN, function onSetCookie(error) {
            if (error) {
                callback(error);
            } else {
                callback(undefined, user);
            }
        });
    }

    request["delete"](app.config.baseUrl + "/users", {
        success: removeCookie,
        error: removeCookie
    });
};

UserStorePrototype.handler = function(action) {
    switch (action.type) {
        case this.consts.CHANGE_LOCALE:
            if (this.setLocale(action.locale)) {
                this.emit("changeLocale");
            }
            break;
        case this.consts.OAUTH_SIGN_IN:
            this.oauthSignIn(action.error, action.user, this.createChangeCallback("onSignIn"));
            break;
        case this.consts.SIGN_OUT:
            this.signUserOut(this.createChangeCallback("onSignOut"));
            break;
    }
};


userStore = module.exports = new UserStore();


app.on("init", function onInit() {
    var locales = app.config.locales;

    app.getLocale(function onGetCookie(error, locale) {
        if (!error) {
            if (indexOf(locales, locale) === -1) {
                locale = locales[0];
            }

            defaultLocale = locale;
            UserStore_setLocale(userStore, defaultLocale);
        }
    });
});