var app = require("../../app");


require("./confirm");
require("./not_confirmed");
require("./sign_out");

app.router.use(
    require("./middleware/is_confirmed")
);