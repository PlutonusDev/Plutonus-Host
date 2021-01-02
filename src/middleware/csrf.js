const { csrf } = require("../util/security.js");

const protectedMethods = ["post", "patch", "put", "delete"];

module.exports = async (req, res, next) => {
	if (protectedMethods.includes(req.method.toLowerCase())) {
		// Verify CSRF presence
		if (req.cookies["X-Plutonus-CSRF"] && req.get("X-Plutonus-CSRF")) {
			if (req.cookies["X-Plutonus-CSRF"] === decodeURIComponent(req.get("CSRF-TOKEN"))) return next();
		}
		if (req.cookies["X-Plutonus-CSRF"] && req.body["X-Plutonus-CSRF"]) {
			if (req.cookies["X-Plutonus-CSRF"] === req.body["X-Plutonus-CSRF"]) return res.next();
		}
		return res.status(400).send("Browser integrity check failed. What are you doing?");
	}
	// Generate CSRF presence if it doesn't exist
	if (!req.cookies["X-Plutonus-CSRF"]) {
		res.cookie("X-Plutonus-CSRF", await csrf.makeToken(), {
			maxAge: 60000 * 15,
			sameSite: "strict",
			httpOnly: true,
		});
	}
	return next();
};
