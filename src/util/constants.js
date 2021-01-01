const { Schema } = require("mongoose");

module.exports = {
	schema: {
		User: new Schema({
			username: String,
			password: String,
			id: Number,
			token: String
		}),
		File: new Schema({
			owner: Number,
			location: String
		})
	},

	navlinks: {
		home: {
			href: "/",
			page: "Home"
		},
		login: {
			href: "/login",
			page: "Login",
			noAuthOnly: true
		},
		logout: {
			href: "/logout",
			page: "Logout",
			authOnly: true
		}
	}
}
