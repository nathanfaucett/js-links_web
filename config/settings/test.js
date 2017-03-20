var utils = require("../utils");


module.exports = {
    throwMissingTranslationError: false,
    html5Mode: false,
    appUrl: "http://localhost:" + (process.env.PORT || 4000),
    baseUrl: "http://" + utils.getLocalAddress() + ":3000",
    baseUrlWS: "ws://" + utils.getLocalAddress() + ":3000"
};
