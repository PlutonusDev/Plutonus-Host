module.exports = async (database) => {
	await database.connect(); // This is probably bad practise.

	async function validateToken(req, useCookie) {
		let authorization = useCookie ? req.cookies.authorization : req.params.authorization;
		if (!authorization || typeof authorization !== "string") return false;

		authorization = decodeURIComponent(authorization);
		if (authorization.length !== 50) return false;

		const user = database.getUserByToken(authorization);
		if (!user) return false;
		req.session.user = user;
		return true;
	}

	return {
		validate: (req, res, next) => {
			if (validateToken(req)) next();
			res.status(401).redirect("login");
		},
	};
};
