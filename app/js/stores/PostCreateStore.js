var app = require("../app"),
    FormStore = require("./FormStore");


var PostCreateStore = module.exports = new FormStore("PostCreateStore", {
    title: "",
    href: "",
    subject: "",
    tags: ""
});


app.registerStore(PostCreateStore);