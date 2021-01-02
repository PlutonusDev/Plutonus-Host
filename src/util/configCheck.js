require("dotenv").config();
const { log, warn, error } = require("./logger");

const config = process.env;

module.exports = new Promise((res) => {
	log("Beginning configuration check. It is recommended you fix any warnings and errors that may appear.");
	if (!config.SESSION_SECRET) error("'SESSION_SECRET' is not set. This may be security issue. Defaulted to: 'changeme'.");
	if (config.SESSION_SECRET && config.SESSION_SECRET.length < 8) error("'SESSION_SECRET' is shorter than 8 characters. This may be a security issue.");
	if (!config.PORT) warn("'PORT' is not set. Defaulted to: '3000'.");
	if (!config.DISCORD_ID) error("'DISCORD_ID' is not set. Users will not be able to login with Discord.");
	if (!config.DISCORD_SECRET) error("'DISCORD_SECRET' is not set. Users will not be able to login with Discord.");
	if (!config.DISCORD_REDIRECT) error("'DISCORD_REDIRECT' is not set. Users will not be able to login with Discord.");
	if (!config.DB_URL) warn("'DB_URL' is not set. Defaulted to: 'mongodb://localhost/filehost'.");
	log("Configuration check completed.\n");
	res();
});
