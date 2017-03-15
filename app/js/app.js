var apt = require("@nathanfaucett/apt"),
    page = require("@nathanfaucett/page/src/server"),
    request = require("@nathanfaucett/request"),
    i18n = require("@nathanfaucett/i18n"),

    router = require("./router"),

    i18nBound, RouteStore, UserStore;


var Application = apt.Application,
    app, LinksApplicationPrototype;


function LinksApplication() {

    Application.call(this);

    this.router = router;

    this.config = null;
    this.Component = null;
    this.page = page;
    this.i18n = null;
    this.messenger = null;

    this.pages = {};
}
Application.extend(LinksApplication, "Links.Application");
LinksApplicationPrototype = LinksApplication.prototype;


app = module.exports = new LinksApplication();


app.Component = require("./components/App");
i18nBound = require("./utils/i18n");
RouteStore = require("./stores/RouteStore");
UserStore = require("./stores/UserStore");


LinksApplicationPrototype.init = function(config, messenger) {
    var _this = this,
        dispatcher = this.dispatcher;

    this.i18n = i18nBound;
    this.router = router;

    this.config = config;
    this.messenger = messenger;

    request.defaults.headers["Content-Type"] = "application/json";
    request.defaults.withCredentials = true;

    this.registerStore(RouteStore);
    this.registerStore(UserStore);
    this.registerStore(require("./stores/PostStore"));
    this.registerStore(require("./stores/MenuStore"));

    page.initServer(messenger);
    page.on("request", function onRequest(ctx) {
        dispatcher.dispatch({
            type: RouteStore.consts.CHANGE,
            ctx: ctx
        });
    });

    UserStore.on("changeLocale", function onChangeLocale() {
        page.reload();
    });

    i18n.throwMissingError(config.throwMissingTranslationError);

    dispatcher.on("dispatch", function onDispatch() {
        _this.setCookie("Links.state", _this.toJSON());
    });

    this.messenger.on("Links.clientReady", function onRestoreState(data, callback) {
        _this.fromJSON(data);
        _this.emit("init");
        callback();
    });

    page.setHtml5Mode(config.html5Mode, function onSetHtml5Mode() {
        messenger.emit("Links.serverReady");
    });
};

LinksApplicationPrototype.setCookie = function(key, value, callback) {
    this.messenger.emit("Links.setCookie", {
        key: key,
        value: value
    }, callback);
};
LinksApplicationPrototype.hasCookie = function(key, callback) {
    this.messenger.emit("Links.hasCookie", {
        key: key
    }, callback);
};
LinksApplicationPrototype.getCookie = function(key, callback) {
    this.messenger.emit("Links.getCookie", {
        key: key
    }, callback);
};
LinksApplicationPrototype.removeCookie = function(key, callback) {
    this.messenger.emit("Links.removeCookie", {
        key: key
    }, callback);
};

LinksApplicationPrototype.setLocale = function(value, callback) {
    this.messenger.emit("Links.setLocale", {
        value: value
    }, callback);
};
LinksApplicationPrototype.getLocale = function(callback) {
    this.messenger.emit("Links.getLocale", null, callback);
};

LinksApplicationPrototype.registerPage = function(name, render) {
    this.pages[name] = render;
};

LinksApplicationPrototype.getPage = function(name) {
    return this.pages[name];
};

require("./views");
require("./routes");