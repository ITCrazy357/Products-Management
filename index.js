require("dotenv").config();

const express = require("express");

const route = require("./routes/client/index.route");

const database = require("./config/database")
database.connect();



const app = express();
const port = process.env.PORT;


app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'));


//Route
route(app);

app.listen(port, () => {
  console.log(`Chạy thành công !!!🚀🚀🚀 tại cổng ${port}`);
});
