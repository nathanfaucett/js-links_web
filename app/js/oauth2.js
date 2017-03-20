var config = require("./config"),
    qs = require("@nathanfaucett/qs"),
    url = require("@nathanfaucett/url"),
    request = require("@nathanfaucett/request");


var opener = window.opener,
    fullUrl = url.parse(location + ""),
    search = qs.parse(fullUrl.search.slice(1)),
    code = search.code;


function init(provider) {
    request.get(config.baseUrl + "/users/"+ provider +"/callback?" + qs.stringify({
        code: code
    }), {
        success: function(response) {
            opener.postMessage(JSON.stringify({
                type: "success",
                user: response.data
            }), config.appUrl);
            window.close();
        },
        error: function(response) {
            opener.postMessage(JSON.stringify({
                type: "error",
                error: response.data
            }), config.appUrl);
            window.close();
        }
    });
}


function onMessage(event) {
    var data = JSON.parse(event.data);

    switch (data.type) {
        case "provider":
            init(data.provider);
            break;
    }
}
window.addEventListener("message", onMessage, false);

opener.postMessage(JSON.stringify({
    type: "load"
}), config.appUrl);
