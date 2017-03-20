var app = require("../app");


app.router.use(
    require("./middleware/i18n")
);

require("./auth/sign_in");

app.router.use(
    require("./auth/middleware/auto_token_sign_in")
);

require("./posts/search");
require("./posts/newest");
require("./home");

app.router.use(
    require("./auth/middleware/redirect")
);

require("./auth/sign_out");

require("./posts/create");
require("./not_found");
