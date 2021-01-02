require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");

const { log } = require("./util/logger");
const database = require("./util/database");

const app = express();

const db = new database({
	dir: process.env.DB_URL
});

app.engine("html", exphbs({
	extname: ".html",
	defaultLayout: "main",
}));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.enable("trust proxy");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookie());
app.use(session({
	secret: process.env.SESSION_SECRET || "changeme",
	resave: false,
	saveUninitialized: true
}));
app.set("x-powered-by", false);

// Security
const csrf = require("./middleware/csrf");
app.use("*", csrf);

// Routes
db.connect().then(() => {
	const routers = require("./routes")(db);
	app.use("*", routers.logger);
	app.use("/api", routers.api);
	app.use("/", routers.master);
});

require("./util/configCheck").then(() => {
	app.listen(process.env.PORT || 3000, () => {
		log(`Services are now online on port :${process.env.port || 3000}.`);
	});
});
