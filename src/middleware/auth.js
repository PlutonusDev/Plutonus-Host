module.exports = (database) => {
	async function validateToken(req, useSession) {
		if (useSession && !req.session.auth) return false;
		let authorization = useSession ? req.session.auth.token : req.params.authorization;
		if (!authorization || typeof authorization !== "string") return false;

		authorization = decodeURIComponent(authorization);
		if (authorization.length !== 50) return false;

		const user = await database.connection.db.collection("users").findOne({ token: authorization });
		if (!user) return false;
		return true;
	}

	return {
		validate: async (req, res, next) => {
			if (req.session.auth && !req.session.auth.token) return res.redirect("/invite");
			if (await validateToken(req, true)) return next();
			return res.status(401).redirect("/login");
		},
	};
};
