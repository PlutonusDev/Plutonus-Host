const chalk = require("chalk");
const mongoose = require("mongoose");
const express = require("express");

const app = express.Router();
const { schema } = require("../util/constants");
const { log } = require("../util/logger");

module.exports = (database) => {
	database.connect().then(() => {
		const userSchema = mongoose.model("User", schema.User);
		log(`Database connected and API ${chalk.blue("operational")}.`);
	});

	app.get("/", (req, res) => {
		res.send("API");
	});

	return app;
};
