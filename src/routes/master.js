require("dotenv").config();
const path = require("path");
const express = require("express");
const auth = require("../middleware/auth");
const { navlinks } = require("../util/constants");

const app = express.Router();

function formatLinks(req, res, next) {
	res.locals.links = {};
	Object.keys(navlinks).forEach((data) => {
		const ndata = navlinks[data];
		if (!ndata.authOnly && !ndata.noAuthOnly) res.locals.links[data] = ndata;
		if (req.session.auth && req.session.auth.token && ndata.authOnly) res.locals.links[data] = ndata;
		if (!req.session.auth && ndata.noAuthOnly) res.locals.links[data] = ndata;
	});

	next();
}

module.exports = (database) => {
	app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
	app.use("*", formatLinks);

	app.get("/", (req, res) => {
		res.locals.links.home.active = "active";
		return res.render("home", { navlinks: res.locals.links });
	});

	app.get("/login", (req, res) => {
		res.locals.links.login.active = "active";
		return res.status(200).redirect(`https:/discord.com/api/oauth2/authorize?scope=identify%20guilds.join&response_type=code&client_id=${process.env.DISCORD_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT)}&prompt=none`);
		// res.render("login", { navlinks: res.locals.links });
	});

	app.get("/invite", (req, res) => {
		if (!req.session.auth) return res.redirect("/login");
		if (req.session.auth.token) return res.redirect("/dashboard");
		return res.render("invite", { navlinks: res.locals.links, user: req.session.auth /* csrf: req.cookies["X-Plutonus-CSRF"] */ });
	});

	// Authorized-Only Routes
	app.use("*", auth(database).validate);
	app.get("/dashboard", (req, res) => {
		res.locals.links.dashboard.active = "action";
		return res.render("dashboard", { navlinks: res.locals.links, user: req.session.auth });
	});

	return app;
};
