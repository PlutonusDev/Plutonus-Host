require("dotenv").config();
const path = require("path");
const express = require("express");
const auth = require("../middleware/auth");
const { navlinks } = require("../util/constants");

const app = express.Router();

function formatLinks(req) {
	return new Promise(async res => {
		let links = {};
		await Object.keys(navlinks).forEach((data) => {
			const ndata = navlinks[data];
			if (!ndata.authOnly && !ndata.noAuthOnly) links[data] = ndata;
			if (req.session.auth && req.session.auth.token
				&& ndata.authOnly) links[data] = ndata;
			if (!req.session.auth && ndata.noAuthOnly) links[data] = ndata;
		});
		await Object.keys(links).forEach((data) => {
			links[data].active = false;
		});
		res(links);
	});
}

module.exports = (database) => {
	app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
	app.use("*", async (req, res, next) => {
		res.locals.links = await formatLinks(req);
		next();
	});

	app.get("/", (req, res) => {
		res.locals.links.home.active = "active";
		return res.render("home", { navlinks: res.locals.links });
	});

	app.get("/login", (req, res) => {
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
		res.locals.links.dashboard.active = "active";
		return res.render("dashboard", { navlinks: res.locals.links, user: req.session.auth });
	});

	return app;
};
