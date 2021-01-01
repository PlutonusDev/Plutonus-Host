const logger = require("./logger");
const master = require("./master");
const api = require("./api");

module.exports = (database) => ({
	logger,
	master,
	api: api(database),
});
