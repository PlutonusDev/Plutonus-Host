const { randomBytes } = require("crypto");

module.exports = {
	csrf: {
		makeToken: () => new Promise((res, rej) => {
			randomBytes(80, (err, buffer) => {
				if (err) rej(err);
				res(buffer.toString("base64").substr(0, 50));
			});
		}),
	},
};
