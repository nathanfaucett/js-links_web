var app = require("../app");


app.router.use(
    require("./middleware/i18n")
);

require("./auth");

require("./home");
require("./not_found");