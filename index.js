// =======================
// 1. Load Environment
// =======================
require("dotenv").config();

// =======================
// 2. Import Packages
// =======================
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");

// =======================
// 3. Import Local Files
// =======================
const systemConfig = require("./config/system");
const database = require("./config/database");
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

// =======================
// 4. Connect Database
// =======================
database.connect();

// =======================
// 5. Initialize App
// =======================
const app = express();
const port = process.env.PORT || 3000;

// =======================
// 6. Middleware
// =======================

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Override method (PUT, PATCH, DELETE)
app.use(methodOverride("_method"));

// Static folder
app.use(express.static(`${__dirname}/public`));

// =======================
// 7. View Engine
// =======================
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// =======================
// 8. Session + Flash
// =======================
app.use(cookieParser("nmd2614"));
app.use(
  session({
    secret: "nmd2614",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// =======================
// 9. App TinyMCE
// =======================
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);

// =======================
// 10. App Local Variables
// =======================
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
// =======================
// 11. Routes
// =======================
routeClient(app);
routeAdmin(app);
app.use((req, res) => {
  res.render("client/pages/error/404", {
    pageTitle: "404 Not Found",
  });
});
// =======================

// =======================
// 12. Start Server
// =======================
app.listen(port, () => {
  console.log(`🚀🚀🚀 Server đang chạy tại cổng ${port}`);
});
