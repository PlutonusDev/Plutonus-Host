require("dotenv").config();
const { get, post } = require("axios");
const btoa = require("btoa");
const querystring = require("querystring");
const chalk = require("chalk");
const mongoose = require("mongoose");
const express = require("express");

const app = express.Router();
const { schema } = require("../util/constants");
const { auth } = require("../util/security");
const { log, error } = require("../util/logger");

module.exports = (database) => {
	const UserSchema = mongoose.model("User", schema.User, "users");
	const InviteSchema = mongoose.model("Invite", schema.Invite, "invites");
	log(`Database connected (@ ${chalk.blue(database.config.dir)}) and API ${chalk.blue("operational")}.`);
	const UserDB = database.connection.db.collection("users");
	const InviteDB = database.connection.db.collection("invites");

	UserDB.countDocuments((e, count) => {
		if (e) return error(e.message);
		if (count === 0) return log(`There are ${chalk.red("no")} users in the database. ${chalk.yellow("The first registered user will be made an admin")}.`);
		log(`Successfully loaded ${chalk.blue(count)} users.`);

		return 0;
	});

	InviteDB.countDocuments(async (e, count) => {
		if (e) return error(e.message);
		if (count === 0) {
			new InviteSchema({
				creator: 0,
				code: "root",
			}).save((e2) => {
				if (e2) return error(e.message);
				log(`Created invite code '${chalk.blue("root")}'. Use this to authorize your admin account.`);

				return 0;
			});
		}
		log(`Successfully loaded ${chalk.blue(count)} invites.`);

		return 0;
	});

	app.get("/", (req, res) => {
		const user = new UserSchema();
		res.send(user);
	});

	app.get("/redeeminvite", (req, res) => {
		if (!req.session.auth) return res.redirect("/login");
		return InviteDB.findOne({ code: req.query.code }, async (e, invite) => {
			if (!invite) {
				log(`${chalk.blue(req.ip)} attempted to redeem code '${chalk.blue(req.query.code)}' but it doesn't exist.`);
				return res.status(401).redirect("/invite?e=1");
			}
			if (invite.redeemed) {
				log(`${chalk.blue(req.ip)} attempted to redeem code '${chalk.blue(req.query.code)}' but it was already redeemed.`);
				return res.status(401).redirect("/invite?e=2");
			}

			await InviteDB.updateOne({ code: invite.code }, { $set: { redeemed: true } });

			const user = new UserSchema(req.session.auth);
			if (invite.code === "root") {
				user.type = "admin";
				log(`Account '${chalk.blue(req.session.auth.username)}' is now the main admin user.`);
			} else {
				user.type = "user";
				log(`Account '${chalk.blue(req.session.auth.username)}' redeemed the '${invite.code}' invite.`);
			}
			const token = await auth.makeToken();
			user.token = token;
			req.session.auth.token = token;
			await user.save();
			return res.status(200).redirect("/dashboard?s=1");
		});
	});

	app.get("/oauth2/discord", async (req, res) => {
		post("https://discord.com/api/v8/oauth2/token",
			querystring.stringify({
				client_id: process.env.DISCORD_ID,
				client_secret: process.env.DISCORD_SECRET,
				grant_type: "authorization_code",
				code: req.query.code,
				redirect_uri: process.env.DISCORD_REDIRECT,
				scope: "identify guilds.join",
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Bot ${btoa(`${process.env.DISCORD_ID}:${process.env.DISCORD_SECRET}`)}`,
				},
			}).then((resp) => {
			get("https://discord.com/api/v8/users/@me", {
				headers: {
					Authorization: `Bearer ${resp.data.access_token}`,
				},
			}).then(async (user) => {
				UserDB.findOne({ id: user.data.id }, async (e, member) => {
					if (!member) {
						req.session.auth = {
							id: user.data.id,
							username: user.data.username,
							token: "",
							type: "none",
							oauth2: {
								discord: {
									access: resp.data.access_token,
									refresh: resp.data.refresh_token,
								},
							},
						};

						res.status(200).redirect("/invite");
					} else {
						log(`${chalk.blue(req.ip)} has logged in as '${chalk.yellow(member.username)}'.`);
						req.session.auth = {
							id: member.id,
							username: member.username === user.data.username
								? member.username : user.data.username,
							token: member.token,
							type: member.type,
							oauth2: {
								discord: {
									access: member.oauth2.discord.access,
									refresh: member.oauth2.discord.refresh,
								},
							},
						};

						if (member.username !== user.data.username) {
							const oldname = member.username;
							UserDB.updateOne({ id: member.id }, { $set: { username: user.data.username } });
							log(`${chalk.blue(req.ip)} (${chalk.yellow(member.username)}) Account '${chalk.blue(oldname)}' username updated to '${chalk.blue(user.data.username)}'.`);
						}

						res.status(200).redirect("/dashboard");
					}
				});
			});
		}).catch((e) => {
			res.status(400).json(e.response.data);
		});
	});

	return app;
};
