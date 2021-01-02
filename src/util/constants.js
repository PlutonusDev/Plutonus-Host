const { Schema } = require("mongoose");

module.exports = {
	schema: {
		User: new Schema({
			username: String,
			id: String,
			token: String,
			type: String,
			oauth2: Schema.Types.Mixed,
		}),
		File: new Schema({
			owner: Number, // User.id
			location: String,
			meta: Schema.Types.Mixed,
		}),
		Invite: new Schema({
			creator: Number, // User.id
			code: String,
			redeemed: Boolean,
		}),
	},

	navlinks: {
		home: {
			href: "/",
			page: "Home",
		},
		login: {
			href: "/login",
			page: "Login",
			noAuthOnly: true,
		},
		dashboard: {
			href: "/dashboard",
			page: "Dashboard",
			authOnly: true,
		},
		logout: {
			href: "/logout",
			page: "Logout",
			authOnly: true,
		},
	},
};
