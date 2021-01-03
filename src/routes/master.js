require("dotenv").config();
const path = require("path");
const express = require("express");
const auth = require("../middleware/auth");
const { navlinks } = require("../util/constants");

const app = express.Router();

function formatLinks(req) {
	return new Promise((res) => {
		const links = {};
		Object.keys(navlinks).forEach((data) => {
			const ndata = navlinks[data];
			if (!ndata.authOnly && !ndata.noAuthOnly) links[data] = ndata;
			if (req.session.auth && req.session.auth.token
				&& ndata.authOnly) links[data] = ndata;
			if (!req.session.auth && ndata.noAuthOnly) links[data] = ndata;
		});
		if (req.session.auth && !req.session.auth.token) {
			links.invite = {
				href: "/invite",
				page: "Invite",
				icon: "receipt",
				active: false,
			};
		}
		Object.keys(links).forEach((data) => {
			if (navlinks[data] && navlinks[data].muted !== undefined) links[data].muted = "text-muted";
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
		return res.render("home", { navlinks: res.locals.links, user: req.session.auth });
	});

	app.get("/login", (req, res) => res.redirect(`https://discord.com/api/oauth2/authorize?scope=identify%20guilds.join&response_type=code&client_id=${process.env.DISCORD_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT)}&prompt=none`));
	app.get("/logout", (req, res) => res.redirect("/api/logout"));

	app.get("/invite", (req, res) => {
		if (!req.session.auth) return res.redirect("/login");
		if (req.session.auth.token) return res.redirect("/dashboard");
		res.locals.links.invite.active = true;
		return res.render("invite", { navlinks: res.locals.links, user: req.session.auth /* csrf: req.cookies["X-Plutonus-CSRF"] */ });
	});

	app.get("/terms", (req, res) => {
		res.locals.links.terms.active = "active";
		res.locals.links.terms.muted = false;
		return res.render("terms", { navlinks: res.locals.links });
	});

	app.get("/privacy", (req, res) => {
		res.locals.links.privacy.active = "active";
		res.locals.links.privacy.muted = false;
		return res.render("privacy", { navlinks: res.locals.links });
	});

	app.get("/abuse", (req, res) => {
		res.locals.links.abuse.active = "active";
		res.locals.links.abuse.muted = false;
		return res.render("abuse", { navlinks: res.locals.links, user: req.session.auth });
	});

	// Authorized-Only Routes
	app.use("*", auth(database).validate);
	app.get("/dashboard", (req, res) => {
		res.locals.links.dashboard.active = "active";
		return res.render("dashboard", { navlinks: res.locals.links, user: req.session.auth });
	});

	return app;
};
