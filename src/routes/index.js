const logger = require("./logger");
const master = require("./master");
const api = require("./api");

module.exports = database => {
	return {
		logger: logger,
		master: master,
		api: api(database)
	}
};
