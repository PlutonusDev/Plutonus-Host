const chalk = require("chalk");
const { log } = require("../util/logger");

module.exports = (req, res, next) => {
	log(`${chalk.blue(req.ip)} (${req.session.username ? chalk.blue(req.session.username) : chalk.yellow("Not Logged In")}) requested ${chalk.blue(req.baseUrl || req.path)}`);
	next();
}
