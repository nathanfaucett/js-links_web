var utils = require("../utils");


module.exports = {
    throwMissingTranslationError: false,
    html5Mode: false,
    baseUrl: "http://" + utils.getLocalAddress() + ":3000",
    baseUrlWS: "ws://" + utils.getLocalAddress() + ":3000"
};
