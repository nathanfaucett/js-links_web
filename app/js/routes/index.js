var app = require("../app");


app.router.use(
    require("./middleware/i18n")
);

require("./posts/search");
require("./home");

require("./auth");

require("./posts/create");
require("./not_found");