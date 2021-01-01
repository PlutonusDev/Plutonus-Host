const path = require("path");
const express = require("express");
const { navlinks } = require("../util/constants");

const app = express.Router();

function formatLinks(req, res, next) {
	res.locals.links = {};
	for (const data of Object.values(navlinks)) {
		if (!data.authOnly && !data.noAuthOnly) res.locals.links[i] = navlinks[i];
		if (req.session.username && data.authOnly) res.locals.links[i] = navlinks[i];
		if (!req.session.username && data.noAuthOnly) res.locals.links[i] = navlinks[i];
	}

	next();
}

app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use("/", formatLinks);

app.get("/", (req, res) => {
	res.locals.links.home.active = "active";
	res.render("home", { navlinks: res.locals.links });
});

app.get("/login", (req, res) => {
	res.locals.links.login.active = "active";
	res.render("login", { navlinks: res.locals.links });
});

module.exports = app;
