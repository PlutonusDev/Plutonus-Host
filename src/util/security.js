const { randomBytes } = require("crypto");

module.exports = {
	csrf: {
		makeToken: () => new Promise((res, rej) => {
			randomBytes(80, (err, buffer) => {
				if (err) rej(err);
				res(buffer.toString("hex").substr(0, 50));
			});
		}),
	},

	auth: {
		makeToken: () => new Promise((res, rej) => {
			randomBytes(80, (err, buffer) => {
				if (err) rej(err);
				res(`PHOSTv1-${buffer.toString("hex")}`.substr(0, 50));
			});
		}),
	},
};
