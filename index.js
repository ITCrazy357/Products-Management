require("dotenv").config();

const express = require("express");

const systemConfig = require("./config/system")

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route")

const database = require("./config/database")
database.connect();



const app = express();
const port = process.env.PORT;


app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'));


//App local Variables
app.locals.prefixAdmin = systemConfig.prefixAmin;

//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Chạy thành công !!!🚀🚀🚀 tại cổng ${port}`);
});
