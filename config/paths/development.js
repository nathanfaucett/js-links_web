var defaults = require("./default"),
    path = require("@nathanfaucett/file_path");


module.exports = {
    ejs_src: path.join(defaults.app, "index.ejs"),
    ejs_out: path.join(defaults.app, "index.html"),

    js_src: path.join(defaults.js, "index.js"),
    js_out: path.join(defaults.app, "index.js"),
    js_map_out: path.join(defaults.app, "index.js.map"),

    oauth2_js_src: path.join(defaults.js, "oauth2.js"),
    oauth2_js_out: path.join(defaults.app, "oauth2.js"),
    oauth2_js_map_out: path.join(defaults.app, "oauth2.js.map"),

    css_src: path.join(defaults.css, "index.less"),
    css_out: path.join(defaults.app, "index.css"),

    locale_out: path.join(defaults.app, "locale"),

    root_serve: defaults.app
};
