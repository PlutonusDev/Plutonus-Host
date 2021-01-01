const chalk = require("chalk");
const moment = require("moment");

function sendLog(title, msg) {
	// eslint-disable-next-line no-console
	console.log(` ${chalk.bgBlue(` [${moment().format("MM/DD HH:mm:ss")}] `)} ${chalk.bgBlue(` [${title}] `)} ${msg}`);
}

module.exports = {
	log: (msg) => sendLog("OKAY", chalk.green(msg)),
	warn: (msg) => sendLog("WARN", chalk.yellow(msg)),
	error: (msg) => sendLog("ERR!", chalk.red(msg)),
};
