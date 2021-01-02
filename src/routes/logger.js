const chalk = require("chalk");
const { log } = require("../util/logger");

module.exports = (req, res, next) => {
	log(`${chalk.blue(req.ip)} (${req.session.auth ? chalk.yellow(req.session.auth.token ? req.session.auth.username : `[Unverified] ${req.session.auth.username}`) : chalk.yellow("Not Logged In")}) requested ${chalk.blue(req.baseUrl ? req.baseUrl : req.path)}`);
	next();
};
