const express = require("express");

const app = express.Router();
const { log } = require("../util/logger");

module.exports = (database) => {
	database.connect().then(() => {

	});

	app.get("/", (req, res) => {
		res.send("API");
	});

	return app;
};
