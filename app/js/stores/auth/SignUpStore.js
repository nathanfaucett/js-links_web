var app = require("../../app"),
    FormStore = require("../FormStore");


var SignUpStore = module.exports = new FormStore("SignUpStore", {
    email: "",
    password: "",
    confirmPassword: ""
});


app.registerStore(SignUpStore);