const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");
const exphbs = require("express-handlebars");
const { log } = require("./util/logger");

const app = express();

app.engine("html", exphbs({
	extname: ".html",
	defaultLayout: "main",
}));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.enable("trust proxy");
app.use(bodyParser.json());
app.use(cookie());
app.set("x-powered-by", false);

const routers = require("./routes");

app.use("/", routers.master);

app.listen(process.env.port || 3000, () => {
	log(`Services are now online on port :${process.env.port || 3000}`);
});
