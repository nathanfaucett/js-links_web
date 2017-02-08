var app = require("../../app");


app.router.use(
    require("./middleware/redirect")
);

require("./sign_in");
require("./sign_up");

app.router.use(
    require("./middleware/auth"),
    require("./middleware/auto_token_sign_in")
);

require("./confirm");
require("./not_confirmed");
require("./sign_out");

app.router.use(
    require("./middleware/is_confirmed")
);