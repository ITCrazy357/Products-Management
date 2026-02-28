// =======================
// 1. Load Environment
// =======================
require("dotenv").config();

// =======================
// 2. Import Packages
// =======================
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

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
app.use(express.static("public"));

// =======================
// 7. View Engine
// =======================
app.set("views", "./views");
app.set("view engine", "pug");

// =======================
// 8. Session + Flash
// =======================
app.use(cookieParser("nmd2614"));
app.use(session({
  secret: "nmd2614",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  console.log("Flash Messages:", res.locals.messages);
  next();
});

// =======================
// 9. App Local Variables
// =======================
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// =======================
// 10. Routes
// =======================
routeClient(app);
routeAdmin(app);

// =======================
// 11. Start Server
// =======================
app.listen(port, () => {
  console.log(`🚀🚀🚀 Server đang chạy tại cổng ${port}`);
});
