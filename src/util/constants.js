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
			owner: String, // User.id
			location: String,
			meta: Schema.Types.Mixed,
		}),
		Invite: new Schema({
			creator: String, // User.id
			code: String,
			redeemed: Boolean,
		}),
	},

	navlinks: {
		home: {
			href: "/",
			page: "Home",
			icon: "home",
			active: false,
		},
		dashboard: {
			href: "/dashboard",
			page: "Dashboard",
			icon: "images",
			authOnly: true,
			active: false,
		},
		terms: {
			href: "/terms",
			page: "Terms",
			icon: "book",
			active: false,
			muted: "text-muted",
		},
		privacy: {
			href: "/privacy",
			page: "Privacy",
			icon: "eye",
			active: false,
			muted: "text-muted",
		},
		abuse: {
			href: "/abuse",
			page: "Abuse",
			icon: "gavel",
			active: false,
			muted: "text-muted",
		},
		login: {
			href: "/login",
			page: "Login",
			icon: "user",
			noAuthOnly: true,
			active: false,
		},
		logout: {
			href: "/logout",
			page: "Logout",
			icon: "sign-out-alt",
			authOnly: true,
			active: false,
		},
	},
};
