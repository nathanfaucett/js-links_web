var app = require("../app");


app.router.use(
    require("./middleware/i18n")
);

require("./auth");

require("./home");
require("./posts");
require("./not_found");