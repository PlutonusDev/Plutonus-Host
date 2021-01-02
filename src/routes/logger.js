const chalk = require("chalk");
const { log } = require("../util/logger");

module.exports = (req, res, next) => {
	log(`${chalk.blue(req.ip)} (${chalk.yellow(req.session.auth ? req.session.auth.username : "Not Logged In")}) requested ${chalk.blue(req.baseUrl || req.path)}`);
	next();
};
