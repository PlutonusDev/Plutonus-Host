const path = require("path");
const express = require("express");
const { navlinks } = require("../util/constants");

const app = express.Router();

function formatLinks(req, res, next) {
	res.locals.links = {};
	Object.keys(navlinks).forEach((data) => {
		const ndata = navlinks[data];
		if (!ndata.authOnly && !ndata.noAuthOnly) res.locals.links[data] = ndata;
		if (req.session.username && ndata.authOnly) res.locals.links[data] = ndata;
		if (!req.session.username && ndata.noAuthOnly) res.locals.links[data] = ndata;
	});

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
