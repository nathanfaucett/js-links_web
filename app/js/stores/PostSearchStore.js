var app = require("../app"),
    FormStore = require("./FormStore");


var PostSearchStore = module.exports = new FormStore("PostSearchStore", {
    subject: "All",
    tags: ""
});


app.registerStore(PostSearchStore);